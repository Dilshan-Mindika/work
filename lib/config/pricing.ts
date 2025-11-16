/**
 * PAYMENT PROVIDER CONFIGURATION
 * Choose your preferred payment provider: "stripe", "lemonsqueezy", or "webxpay"
 * Make sure to configure the corresponding environment variables
 */
export const paymentProvider: "stripe" | "lemonsqueezy" | "webxpay" = "lemonsqueezy";

/**
 * CURRENCY CONFIGURATION
 * Default currency for all pricing plans
 */
export const DEFAULT_CURRENCY = "usd";
export const DEFAULT_CURRENCY_SYMBOL = "$";

/**
 * Interface defining the structure for pricing plans
 * This interface ensures consistency across all pricing plans
 */
export interface PricingPlanTypes {
  /** Unique identifier for the plan */
  id: string;
  /** Display name of the pricing plan */
  name: string;
  /** Type of payment: one-time payment or recurring subscription */
  type: "payment" | "subscription";
  /** Price in decimal format (e.g., "9.99") for display */
  price: string;
  /** Currency code (e.g., "usd", "eur") */
  currency: string;
  /** Currency symbol for display (e.g., "$", "€") */
  currencySymbol?: string;
  /** Billing frequency for subscriptions (e.g., "monthly", "yearly") */
  billingCycle?: string;
  /** Stripe price ID from your Stripe dashboard */
  priceId: string;
  /** Lemon Squeezy variant ID from your Lemon Squeezy dashboard */
  variantId?: string;
  /** List of features included in this plan */
  features: {
    /** Whether this feature is included/active */
    active: boolean;
    /** Description of the feature */
    title: string;
  }[];
  /** Whether this plan should be highlighted as popular */
  popular?: boolean;
  /** Optional external link for the plan */
  link?: string;
  /** Short description of the plan */
  description?: string;
  /** Trial period in days (for subscriptions) */
  trial?: number;
  /** Number of free credits included with this plan */
  isFreeCredits?: number;
  /** Custom text for the checkout button */
  displayButtonName?: string;
}

/**
 * PRICING PLANS CONFIGURATION
 * 
 * ⚠️  IMPORTANT: Update these values with your actual pricing plan details
 * 
 * How to configure:
 * 1. Update 'priceId' with your Stripe price IDs from Stripe Dashboard
 * 2. Update 'variantId' with your Lemon Squeezy variant IDs
 * 3. Modify features, pricing, and descriptions to match your product
 * 4. Set the 'popular' flag to highlight your recommended plan
 */
export const PricingPlans: PricingPlanTypes[] = [
  {
    id: "coffee",
    trial: 14,
    description:
      "Perfect for trying out our service with all features included",
    name: "Coffee Plan",
    type: "subscription",
    price: "4.99",
    currency: "usd",
    currencySymbol: "$",
    billingCycle: "monthly",
    priceId: "", // Replace with actual Stripe price ID
    variantId: "", // Replace with actual Lemon Squeezy variant ID
    features: [
      {
        active: true,
        title: "Effortless Contract Creation (NDA, Service Agreements, etc.)",
      },
      {
        active: true,
        title: "Instant Agreement Sharing",
      },
      {
        active: true,
        title: "Legally Binding E-Signatures ✍️",
      },
      {
        active: true,
        title: "Seamless Payment Link Generation",
      },
      {
        active: true,
        title: "On-Demand Invoicing (Pay-as-you-go)",
      },
      {
        active: true,
        title: "One-Click AI-Powered Contract Generation 🤖",
      },
      {
        active: true,
        title: "50 Free Credits to kickstart your journey",
      },
    ],
    popular: false,
    isFreeCredits: 0,
    displayButtonName: "Start Monthly",
  },
  {
    id: "one-time",
    description: "Save money with our annual plan while keeping all features",
    name: "Save Money Plan",
    type: "payment",
    price: "670",
    currency: "usd",
    currencySymbol: "$",
    billingCycle: "one-time",
    priceId: "", // Replace with actual Stripe price ID
    variantId: "", // Replace with actual Lemon Squeezy variant ID
    features: [
      {
        active: true,
        title: "Effortless Contract Creation (NDA, Service Agreements, etc.)",
      },
      {
        active: true,
        title: "Instant Agreement Sharing",
      },
      {
        active: true,
        title: "Legally Binding E-Signatures ✍️",
      },
      {
        active: true,
        title: "Seamless Payment Link Generation",
      },
      {
        active: true,
        title: "On-Demand Invoicing (Pay-as-you-go)",
      },
      {
        active: true,
        title: "One-Click AI-Powered Contract Generation 🤖",
      },
      {
        active: true,
        title: "50 Free Credits to kickstart your journey",
      },
    ],
    popular: true,
    isFreeCredits: 50,
    displayButtonName: "Lifetime Deal",
  },
];

/**
 * CREDITS SYSTEM CONFIGURATION
 * 
 * Configure your credit-based pricing if your app uses a credit system
 * ⚠️  Update these values with your actual credit pricing
 */
export const Credits = {
  /** Number of free credits given to new users */
  freeCredits: 10,
  /** Price per individual credit (for reference/calculations) */
  perCreditPrice: "0.12",
  /** Available credit packages for purchase */
  plans: [
    {
      title: "50 Credits",
      price: "4.99",
      priceId: "", // Replace with actual Stripe price ID
      variantId: "", // Replace with actual Lemon Squeezy variant ID
      credits: 50,
    },
    {
      title: "100 Credits",
      price: "8.99",
      priceId: "", // Replace with actual Stripe price ID
      variantId: "", // Replace with actual Lemon Squeezy variant ID
      credits: 100,
    },
  ],
};

/**
 * FEATURE FLAGS
 */

/** 
 * Whether your application uses a credit-based system
 * Set to true if users need to spend credits for actions
 */
export const isUsedCredits = false;
