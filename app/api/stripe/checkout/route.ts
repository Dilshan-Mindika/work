// Import required dependencies
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/lib/config/settings";
import { stripe } from "@/lib/stripe";

// Get public URL from site settings
const publicUrl = SiteSettings.domainUrl;

/**
 * Creates a new user in MongoDB and Stripe if they don't already exist
 * @param userId - The Clerk user ID
 * @returns The user object from MongoDB
 */
async function createUserIfNotExists(userId: string) {
  await connectDB(); // Ensure DB is connected

  let user = await User.findOne({ id: userId });

  if (!user) {
    // Fetch user details from Clerk
    const clerkUser = await (await clerkClient()).users.getUser(userId);

    // Create Stripe customer with user's details if Stripe is configured
    let stripeCustomerId = null;
    if (stripe) {
      const customer = await stripe.customers.create({
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
    }

    // Save user in MongoDB with Stripe customer ID
    user = await User.create({
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      stripeCustomerId,
    });

    console.log("✅ New user created:", user);
  }

  return user;
}

/**
 * Handles POST requests for creating Stripe checkout sessions
 * @param req - The incoming request object containing priceId and checkout options
 * @returns Checkout session URL or error response
 */
export async function POST(req: Request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    // Extract checkout parameters from request body
    const { priceId, isSubscription, trial } = await req.json();
    console.log("Checkout request received:", { priceId, isSubscription });

    // Verify user authentication
    const { userId } = await auth();
    if (!userId) {
      console.error("User not authenticated");
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in our database
    const user = await createUserIfNotExists(userId);
    console.log("User found:", user);

    let session;
    if (isSubscription) {
      // Handle subscription checkout
      if (trial) {
        // Create checkout session with trial period
        session = await stripe.checkout.sessions.create({
          customer: user.stripeCustomerId,
          line_items: [{ price: priceId, quantity: 1 }],
          mode: "subscription",
          subscription_data: { trial_period_days: trial },
          success_url: `${publicUrl}/app/billing/success-payment`,
          cancel_url: `${publicUrl}/app/billing/cancel-payment`,
        });
      } else {
        // Create regular subscription checkout session
        session = await stripe.checkout.sessions.create({
          customer: user.stripeCustomerId,
          line_items: [{ price: priceId, quantity: 1 }],
          mode: "subscription",
          success_url: `${publicUrl}/app/billing/success-payment`,
          cancel_url: `${publicUrl}/app/billing/cancel-payment`,
        });
      }
    } else {
      // Handle one-time payment checkout
      session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: `${publicUrl}/app/billing/success-payment`,
        cancel_url: `${publicUrl}/app/billing/cancel-payment`,
      });
    }

    console.log("Checkout session created:", session);
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
