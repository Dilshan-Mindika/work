import Stripe from "stripe";

// Make Stripe optional - only initialize if the secret key is available
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}

export { stripe };
