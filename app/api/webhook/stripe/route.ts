import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import User from "@/models/user";
import { Credits, PricingPlans } from "@/lib/config/pricing";
import { stripe } from "@/lib/stripe";
import {
  createStripePaymentHistory,
  updatePaymentStatus,
} from "@/lib/payment-utils";
import { createLogger } from "@/lib/utils/logger";
import { withTransaction, withTransactionAndExternal } from "@/lib/transaction-utils";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create logger with context for this webhook handler
const logger = createLogger({ component: "stripe-webhook" });

/**
 * Disable Next.js body parsing since we need the raw body for Stripe webhook verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Handles incoming Stripe webhook events
 * Processes subscription updates, checkout completions, and subscription cancellations
 * 
 * @param req - The incoming webhook request from Stripe
 * @returns Response indicating success or failure of webhook processing
 */
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.WEBHOOK)(async (req: NextRequest) => {
  // Check if Stripe is configured
  if (!stripe) {
    logger.error("Stripe is not configured - missing STRIPE_SECRET_KEY environment variable");
    return NextResponse.json(
      { error: "Payment service temporarily unavailable" },
      { status: 503 }
    );
  }

  await connectDB(); // Connect to MongoDB

  // Get raw request body and verify Stripe signature
  const rawBody = await new Response(req.body).text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    logger.error("Webhook request missing Stripe signature header");
    return NextResponse.json({ error: "Invalid webhook request" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    logger.info("Webhook signature verified successfully", { eventType: event.type });
  } catch (error) {
    const err = error as Error;
    logger.error("Webhook signature verification failed", err, { signature: signature?.slice(0, 20) + '...' });
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { data, type: eventType } = event;

  try {
    switch (eventType) {
      case "customer.subscription.updated": {
        // Handle subscription updates (e.g. plan changes)
        const subscription = data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        if (!customerId) {
          logger.error("Subscription update webhook missing customer ID", undefined, { subscriptionId: subscription.id });
          return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
        }

        const customer = await stripe.customers.retrieve(customerId);
        if (!("email" in customer) || !customer.email) {
          logger.error("Customer record missing email address", undefined, { customerId });
          return NextResponse.json({ error: "Invalid customer data" }, { status: 400 });
        }

        const user = await User.findOne({ emailAddress: customer.email });
        if (!user) {
          logger.error("User not found for customer email in subscription update", undefined, { customerEmail: customer.email });
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const plan = PricingPlans.find(
          (p) => p.priceId === subscription.items.data[0].price.id
        );
        if (!plan) {
          logger.error("No matching pricing plan found for subscription", undefined, { 
            priceId: subscription.items.data[0].price.id,
            userId: user.id 
          });
          return NextResponse.json({ error: "Invalid pricing plan" }, { status: 400 });
        }

        // Update user's plan and add any free credits atomically
        await withTransaction(async (session) => {
          await User.updateOne(
            { emailAddress: customer.email },
            {
              $set: {
                "plan.id": plan.id,
                "plan.type": plan.type || "premium",
                "plan.name": plan.name,
                "plan.price": plan.price,
                "plan.isPremium": plan.popular || false,
              },
              $inc: {
                credits: plan.isFreeCredits || 0,
              },
            },
            { session }
          );
        });

        logger.info("Successfully updated user subscription plan", { 
          userId: user.id, 
          planName: plan.name,
          creditsAdded: plan.isFreeCredits || 0
        });
        break;
      }

      case "checkout.session.completed": {
        // Handle successful checkout sessions (one-time purchases or subscription starts)
        const session = await stripe.checkout.sessions.retrieve(
          (data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );

        if (session.payment_status !== "paid") {
          logger.warn("Checkout session completed but payment not confirmed", { 
            sessionId: session.id,
            paymentStatus: session.payment_status 
          });
          return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }

        const customerId = session.customer as string;
        if (!customerId) {
          logger.error("Checkout session missing customer ID", undefined, { sessionId: session.id });
          return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
        }

        const customer = await stripe.customers.retrieve(customerId);
        if (!("email" in customer) || !customer.email) {
          logger.error("Customer record missing email in checkout session", undefined, { customerId });
          return NextResponse.json({ error: "Invalid customer data" }, { status: 400 });
        }

        const user = await User.findOne({ emailAddress: customer.email });
        if (!user) {
          logger.error("User not found for customer email in checkout session", undefined, { customerEmail: customer.email });
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const priceId = session.line_items?.data[0]?.price?.id;
        const creditPlan = Credits.plans.find((c) => c.priceId === priceId);
        const plan = PricingPlans.find((p) => p.priceId === priceId);

        if (creditPlan) {
          // Handle credit package purchase atomically
          await withTransaction(async (session) => {
            await User.updateOne(
              { emailAddress: customer.email },
              { $inc: { credits: creditPlan.credits } },
              { session }
            );

            // Create payment history record
            await createStripePaymentHistory(
              user.id,
              {
                paymentIntentId: session.id?.toString() || "unknown", // Use session ID as payment intent ID
                customerId: customerId,
                amount: 0, // Amount will be set from plan data
                currency: "usd", // Default currency
                planId: creditPlan.title || "credits",
                planName: creditPlan.title,
                planType: "credits",
                planPrice: creditPlan.price,
                isPremium: false,
                creditsAllocated: creditPlan.credits,
                billingEmail: customer.email || undefined,
                billingName: customer.name || undefined,
                webhookData: session as unknown as Record<string, unknown>,
              },
              "succeeded",
              session
            );
          });

          logger.info("Successfully added credits to user account", {
            userId: user.id,
            creditsAdded: creditPlan.credits,
            planTitle: creditPlan.title
          });
        } else if (plan) {
          // Handle subscription plan purchase with transaction and external API call
          await withTransactionAndExternal(
            // Database operations
            async (session) => {
              await User.updateOne(
                { emailAddress: customer.email },
                {
                  $set: {
                    "plan.id": plan.id,
                    "plan.type": plan.type || "premium",
                    "plan.name": plan.name,
                    "plan.price": plan.price,
                    "plan.isPremium": plan.popular || false,
                  },
                  $inc: {
                    credits: plan.isFreeCredits || 0,
                  },
                },
                { session }
              );

              // Create payment history record for subscription
              await createStripePaymentHistory(
                user.id,
                {
                  paymentIntentId: session.id?.toString() || "unknown", // Use session ID as payment intent ID
                  customerId: customerId,
                  amount: 0, // Amount will be set from plan data
                  currency: "usd", // Default currency
                  planId: plan.id,
                  planName: plan.name,
                  planType: plan.type,
                  planPrice: plan.price,
                  isPremium: plan.popular || false,
                  creditsAllocated: plan.isFreeCredits || 0,
                  billingEmail: customer.email || undefined,
                  billingName: customer.name || undefined,
                  subscriptionInterval: plan.billingCycle,
                  subscriptionStatus: "active",
                  webhookData: session as unknown as Record<string, unknown>,
                },
                "succeeded",
                session
              );

              return { user, plan, session };
            },
            // External API operations
            async (dbResult) => {
              // Update Clerk user metadata with plan information
              await (
                await clerkClient()
              ).users.updateUser(dbResult.user.id, {
                privateMetadata: {
                  plan: dbResult.plan.name,
                  oneTimePayment: {
                    priceId: priceId,
                    paymentDate: new Date().toISOString(),
                    paymentAmount: session.amount_subtotal,
                    sessionId: session.id,
                  },
                },
                publicMetadata: {
                  plan: dbResult.plan.name,
                },
              });
            }
          );

          logger.info("User successfully upgraded to new plan", {
            userId: user.id,
            planName: plan.name,
            planType: plan.type,
            creditsAdded: plan.isFreeCredits || 0
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancellations
        const subscription = await stripe.subscriptions.retrieve(
          (data.object as { id: string }).id
        );
        const user = await User.findOne({
          stripeCustomerId: subscription.customer,
        });

        if (!user) {
          logger.error("User not found for subscription cancellation", undefined, { 
            customerId: subscription.customer,
            subscriptionId: subscription.id 
          });
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Reset user's plan to free tier with transaction and external API call
        await withTransactionAndExternal(
          // Database operations
          async (session) => {
            await User.updateOne(
              { stripeCustomerId: subscription.customer },
              {
                $set: {
                  "plan.id": null,
                  "plan.type": "free",
                  "plan.name": null,
                  "plan.price": null,
                  "plan.isPremium": false,
                },
              },
              { session }
            );

            return { user };
          },
          // External API operations
          async (dbResult) => {
            // Update Clerk user metadata to reflect free plan
            await (
              await clerkClient()
            ).users.updateUser(dbResult.user.id, {
              privateMetadata: { plan: "free" },
              publicMetadata: { plan: "free" },
            });
          }
        );

        logger.info("Subscription successfully canceled, user downgraded to free plan", {
          userId: user.id,
          subscriptionId: subscription.id
        });
        break;
      }

      default:
        logger.warn("Received unhandled webhook event type", { eventType });
        break;
    }
  } catch (err: any) {
    const error = err as Error;
    logger.error(`Error processing webhook event`, error, { eventType });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
});
