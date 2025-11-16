import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import User from "@/models/user";
import { Credits, PricingPlans } from "@/lib/config/pricing";
import crypto from "crypto";
import { createLemonSqueezyPaymentHistory } from "@/lib/payment-utils";
import { withTransaction, withTransactionAndExternal } from "@/lib/transaction-utils";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

/**
 * Disable Next.js body parsing since we need the raw body for Lemon Squeezy webhook verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Verify Lemon Squeezy webhook signature
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;

  if (!secret || secret === "your_webhook_secret_here") {
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");

  return signature === digest;
}

/**
 * Handles incoming Lemon Squeezy webhook events
 * Processes order_created, subscription_created, and subscription_updated events
 */
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.WEBHOOK)(async (req: NextRequest) => {
  await connectDB(); // Connect to MongoDB

  // Get raw request body and verify Lemon Squeezy signature
  const rawBody = await new Response(req.body).text();
  const signature = (await headers()).get("x-signature");

  if (!signature) {
    console.error("🚨 Missing Lemon Squeezy signature");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Verify webhook signature
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("🚨 Webhook verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook signature verified successfully");

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("🚨 Invalid JSON payload");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data, meta } = event;
  const eventType = meta.event_name;

  console.log("📋 Processing webhook event:", eventType);
  console.log("Event data:", JSON.stringify(data, null, 2));

  let price_id;
  try {
    switch (eventType) {
      case "order_created": {
        // Handle one-time payment (credit purchases)
        const order = data;
        const customerId = order.attributes.customer_id;
        const userEmail = order.attributes?.user_email;

        const variantId = order.attributes?.first_order_item.variant_id;
        const priceId = order.attributes?.first_order_item.price_id;
        const status = order.attributes?.status;
        const plan = PricingPlans.find(
          (p) => p.variantId === variantId.toString()
        );

        if (!customerId) {
          console.error("🚨 No user identifier found in order");
          break;
        }

        let user;
        if (customerId) {
          user = await User.findOne({ lemonsqueezyCustomerId: customerId });
        } else {
          user = await User.findOne({ emailAddress: userEmail });
        }

        if (!user) {
          console.error("🚨 User not found:", customerId || userEmail);
          break;
        }

        // is Credited
        const credit = Credits.plans.find(
          (p) => p.variantId === variantId.toString()
        );

        if (credit) {
          // Handle credit purchase atomically
          await withTransaction(async (session) => {
            await User.updateOne({
              lemonsqueezyCustomerId: customerId,
              $set: {
                credits: user.credits + credit.credits,
              },
            }, { session });

            // Create payment history record for credit purchase
            await createLemonSqueezyPaymentHistory(
              user.id,
              {
                orderId: order.id,
                customerId: customerId,
                amount: order.attributes.total / 100, // Convert from cents
                currency: order.attributes.currency,
                planId: credit.title,
                planName: credit.title,
                planType: "credits",
                planPrice: credit.price,
                isPremium: false,
                creditsAllocated: credit.credits,
                billingEmail: userEmail,
                webhookData: order,
              },
              status === "paid" ? "succeeded" : "pending",
              session
            );
          });

          console.log(`✅ User credited ${credit.credits} credits`);
        } else {
          const plan = await PricingPlans.find(
            (p) => p.variantId === variantId.toString()
          );
          console.log({ plan: plan });

          // Handle plan purchase atomically
          await withTransaction(async (session) => {
            await User.updateOne({
              lemonsqueezyCustomerId: customerId,
              $set: {
                "plan.id": plan?.id,
                "plan.type": plan?.type || "premium",
                "plan.name": plan?.name,
                "plan.price": plan?.price,
                "plan.isPremium": true,
              },
            }, { session });

            // Create payment history record for plan purchase
            if (plan) {
              await createLemonSqueezyPaymentHistory(
                user.id,
                {
                  orderId: order.id,
                  customerId: customerId,
                  amount: order.attributes.total / 100, // Convert from cents
                  currency: order.attributes.currency,
                  planId: plan.id,
                  planName: plan.name,
                  planType: plan.type,
                  planPrice: plan.price,
                  isPremium: plan.popular || false,
                  creditsAllocated: plan.isFreeCredits || 0,
                  billingEmail: userEmail,
                  subscriptionInterval: plan.billingCycle,
                  subscriptionStatus: status === "paid" ? "active" : "pending",
                  webhookData: order,
                },
                status === "paid" ? "succeeded" : "pending",
                session
              );
            }
          });
        }

        break;
      }

      case "subscription_updated": {
        // Handle subscription updates (plan changes)
        const subscription = data;
        const userId = subscription.attributes.custom_data?.user_id;

        if (!userId) {
          console.error("🚨 No user identifier found in subscription update");
          break;
        }

        let user;
        if (userId) {
          user = await User.findOne({ id: userId });
        }

        if (!user) {
          console.error("🚨 User not found:", userId);
          break;
        }

        // Find the plan based on variant ID
        price_id = subscription.attributes.first_subscription_item.price_id;
        const plan = PricingPlans.find((p) => p.priceId === price_id!);

        if (plan) {
          // Update user's plan and add any free credits
          await User.updateOne(
            { id: user.id },
            {
              $set: {
                "plan.id": plan.id,
                "plan.type": plan.type || "premium",
                "plan.name": plan.name,
                "plan.price": plan.price,
                "plan.isPremium": true,
              },
              $inc: {
                credits: plan.isFreeCredits || 0,
              },
            }
          );

          console.log(
            `✅ Updated plan for user: ${user.id}, New Plan: ${plan.name}`
          );
        }
        break;
      }

      case "subscription_payment_success": {
        // Handle new subscription
        const subscription = data;
        const customerId = subscription.attributes?.customer_id;

        if (!customerId) {
          console.error("🚨 No user identifier found in subscription");
          break;
        }

        let user;
        if (customerId) {
          user = await User.findOne({ lemonsqueezyCustomerId: customerId });
        }

        if (!user) {
          console.error("🚨 User not found:", customerId);
          break;
        }

        // Find the plan based on variant ID from subscription data
        const variantId =
          subscription.attributes.first_subscription_item.variant_id;
        const plan = PricingPlans.find(
          (p) => p.variantId === variantId?.toString()
        );

        if (plan) {
          // Update user's plan fields and add any free credits with transaction and external API call
          await withTransactionAndExternal(
            // Database operations
            async (session) => {
              await User.updateOne(
                { id: user.id },
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

              return { user, plan };
            },
            // External API operations
            async (dbResult) => {
              // Update Clerk user metadata with plan information
              await (
                await clerkClient()
              ).users.updateUser(dbResult.user.id, {
                privateMetadata: {
                  plan: dbResult.plan?.name,
                },
                publicMetadata: {
                  plan: dbResult.plan?.name,
                },
              });
            }
          );

          console.log(`✅ User upgraded to plan: ${plan?.name}`);
        }
        break;
      }

      case "subscription_cancelled": {
        // Handle subscription cancellations
        const subscription = data;
        const userId = subscription.attributes.custom_data?.user_id;
        const userEmail = subscription.attributes.custom_data?.user_email;

        if (!userId && !userEmail) {
          console.error(
            "🚨 No user identifier found in subscription cancellation"
          );
          break;
        }

        let user;
        if (userId) {
          user = await User.findOne({ id: userId });
        } else {
          user = await User.findOne({ emailAddress: userEmail });
        }

        if (!user) {
          console.error("🚨 User not found:", userId || userEmail);
          break;
        }

        // Reset user's plan to free tier with transaction and external API call
        await withTransactionAndExternal(
          // Database operations
          async (session) => {
            await User.updateOne(
              { id: user.id },
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

        console.log(`✅ Subscription canceled, user downgraded to free plan`);
        break;
      }

      case "subscription_created": {
        const subscription = data;
        const customerId = subscription.attributes.customer_id;
        const status = subscription.attributes.status;
        const variantId =
          subscription.attributes.first_subscription_item.variant_id;

        if (!customerId) {
          console.error("🚨 No user identifier found in subscription creation");
          break;
        }

        let user;
        if (customerId) {
          user = await User.findOne({ lemonsqueezyCustomerId: customerId });
        }

        if (!user) {
          console.error("🚨 User not found:", customerId);
          break;
        }

        const plan = PricingPlans.find(
          (p) => p.variantId === variantId?.toString()
        );

        if (status === "active" && plan) {
          await User.updateOne({
            lemonsqueezyCustomerId: customerId,
            $set: {
              "plan.id": plan.id,
              "plan.type": plan.type || "premium",
              "plan.name": plan.name,
              "plan.price": plan.price,
              "plan.isPremium": plan.popular || false,
            },
          });
        }

        break;
      }

      default:
        console.warn(`⚠️ Unhandled event type: ${eventType}`);
        break;
    }
  } catch (err: any) {
    console.error(`🚨 Error processing event ${eventType}: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
});
