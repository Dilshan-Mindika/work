import { NextResponse } from "next/server";
import {
  createCheckout,
  lemonSqueezySetup,
  createCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";
import { auth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import { lemonSqueezyStoreId, SiteSettings } from "@/lib/config/settings";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

// Get public URL from site settings
const publicUrl = SiteSettings.domainUrl;

/**
 * Creates a new user in MongoDB if they don't already exist
 * @param userId - The Clerk user ID
 * @returns The user object from MongoDB
 */
async function createUserIfNotExists(userId: string) {
  await connectDB();

  let user = await User.findOne({ id: userId });

  return user;
}

/**
 * Creates or retrieves a Lemon Squeezy customer
 * @param userId - The Clerk user ID
 * @param userEmail - The user's email
 * @param userFirstName - The user's first name
 * @param userLastName - The user's last name
 * @returns The Lemon Squeezy customer ID
 */
async function getOrCreateLemonSqueezyCustomer(
  userId: string,
  userEmail: string,
  userFirstName?: string,
  userLastName?: string
) {
  await connectDB();

  // Check if user already has a Lemon Squeezy customer ID
  let user = await User.findOne({ id: userId });

  if (user?.lemonsqueezyCustomerId) {
    console.log(
      "✅ User already has Lemon Squeezy customer ID:",
      user.lemonsqueezyCustomerId
    );
    return user.lemonsqueezyCustomerId;
  }

  // Create new customer in Lemon Squeezy
  console.log("🔄 Creating new Lemon Squeezy customer for user:", userId);

  const storeId = lemonSqueezyStoreId;
  if (isNaN(storeId)) {
    throw new Error("Invalid store ID format");
  }

  const { data: customerData, error } = await createCustomer(storeId, {
    name:
      userFirstName && userLastName
        ? `${userFirstName} ${userLastName}`
        : userEmail,
    email: userEmail,
    city: null,
    region: null,
    country: null,
  });

  if (error) {
    console.error("❌ Error creating Lemon Squeezy customer:", error);
    throw new Error(
      `Failed to create Lemon Squeezy customer: ${error.message}`
    );
  }

  const customerId = customerData.data.id;
  console.log("✅ Lemon Squeezy customer created:", customerId);

  // Save customer ID to database
  if (user) {
    await User.updateOne(
      { id: userId },
      { lemonsqueezyCustomerId: customerId }
    );
  } else {
    // If user doesn't exist in our database, create them
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    await User.create({
      id: userId,
      emailAddress: [userEmail],
      firstName: userFirstName || clerkUser.firstName,
      lastName: userLastName || clerkUser.lastName,
      lemonsqueezyCustomerId: customerId,
    });
  }

  return customerId;
}

/**
 * Validates environment variables
 */
function validateEnvironment() {
  const requiredEnvVars = {
    LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
    LEMON_SQUEEZY_STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Validate API key format
  if (!process.env.LEMON_SQUEEZY_API_KEY?.startsWith("eyJ")) {
    throw new Error("Invalid API key format");
  }
}

/**
 * Validates request parameters
 */
function validateRequest(
  variantId: any,
  isSubscription: boolean,
  trial?: number
) {
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  const parsedVariantId = parseInt(variantId.toString());
  if (isNaN(parsedVariantId)) {
    throw new Error("Invalid variant ID format");
  }

  if (trial && (!isSubscription || trial <= 0)) {
    throw new Error(
      "Trial days can only be set for subscriptions and must be greater than 0"
    );
  }

  return parsedVariantId;
}

/**
 * Creates checkout options for Lemon Squeezy
 */
function createCheckoutOptions(
  userId: string,
  userEmail: string,
  isSubscription: boolean,
  userFirstName?: string,
  userLastName?: string,
  trial?: number,
  variantId?: number,
  customerId?: string
) {
  const checkoutOptions: any = {
    checkoutData: {
      custom: {
        userId: userId,
        userEmail: userEmail,
        priceId: variantId,
      },
      email: userEmail,
      name:
        userFirstName && userLastName
          ? `${userFirstName} ${userLastName}`
          : undefined,
      billing_address: {
        country: "US",
      },
    },
    customer: {
      email: userEmail,
      name:
        userFirstName && userLastName
          ? `${userFirstName} ${userLastName}`
          : undefined,
    },
  };

  if (customerId) {
    checkoutOptions.customerId = customerId;
  }

  if (isSubscription) {
    checkoutOptions.productOptions = {
      redirectUrl: `${publicUrl}/app/billing/success-payment`,
    };
    if (trial) {
      checkoutOptions.productOptions.trialDays = trial;
    }
  } else {
    // For one-time payments, only add redirectUrl at the root level
    checkoutOptions.redirectUrl = `${publicUrl}/app/billing/success-payment`;
    // Do NOT add productOptions or trialDays
  }

  return checkoutOptions;
}

export const POST = withRateLimit(RATE_LIMIT_CONFIGS.PAYMENT)(async (req: Request) => {
  try {
    await connectDB();

    const { variantId, isSubscription, trial } = await req.json();

    // Validate environment variables
    validateEnvironment();

    // Setup Lemon Squeezy
    const config = lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
    });

    // Validate request parameters
    const parsedVariantId = validateRequest(variantId, isSubscription, trial);

    // Verify user authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure user exists in our database
    const user = await createUserIfNotExists(userId);

    // Get user data from Clerk if not in our database
    let userEmail = user?.emailAddress?.[0];
    let userFirstName = user?.firstName;
    let userLastName = user?.lastName;

    if (!userEmail || !userFirstName || !userLastName) {
      const clerkUser = await (await clerkClient()).users.getUser(userId);
      userEmail = userEmail || clerkUser.emailAddresses[0]?.emailAddress;
      userFirstName = userFirstName || clerkUser.firstName;
      userLastName = userLastName || clerkUser.lastName;
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Create or get Lemon Squeezy customer
    const customerId = await getOrCreateLemonSqueezyCustomer(
      userId,
      userEmail,
      userFirstName,
      userLastName
    );

    // Debug logging
    console.log("🔍 Customer data for checkout:", {
      userId,
      userEmail,
      userFirstName,
      userLastName,
      customerId,
      isSubscription,
      trial,
    });

    // Parse store ID
    const storeId = lemonSqueezyStoreId;
    if (isNaN(storeId)) {
      throw new Error("Invalid store ID format");
    }

    // Create checkout options
    const checkoutOptions = createCheckoutOptions(
      userId,
      userEmail,
      isSubscription,
      userFirstName,
      userLastName,
      trial,
      variantId,
      customerId
    );

    console.log(
      "🔍 Checkout options:",
      JSON.stringify(checkoutOptions, null, 2)
    );

    // Create checkout session
    const { data, error } = await createCheckout(
      storeId,
      parsedVariantId,
      checkoutOptions
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      url: data.data.attributes.url,
      checkoutId: data.data.id,
    });
  } catch (error: any) {
    console.error("Lemon Squeezy checkout error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create checkout session",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
});
