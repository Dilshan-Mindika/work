# Lemon Squeezy Integration Setup

This project now supports both Stripe and Lemon Squeezy as payment providers. Users can choose their preferred payment method.

## Required Environment Variables

Add these variables to your `.env` file:

```env
# Lemon Squeezy API Key (get from Lemon Squeezy dashboard)
LEMON_SQUEEZY_API_KEY=your_api_key_here

# Lemon Squeezy Store ID (get from Lemon Squeezy dashboard)
LEMON_SQUEEZY_STORE_ID=your_store_id_here

# Lemon Squeezy Webhook Secret (get from Lemon Squeezy dashboard)
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Configuration Steps

### 1. Lemon Squeezy Dashboard Setup

1. Go to your [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com/)
2. Create products for your pricing plans:
   - **Monthly Subscription**: $5/month
   - **Yearly Subscription**: $45/year
   - **50 Credits Package**: $4.99
   - **100 Credits Package**: $7.99
   - **250 Credits Package**: $11.99
3. For each product, note down the **Variant ID** (this is a numeric ID)
4. Update the `variantId` fields in `lib/config/pricing.ts`

### 2. Update Pricing Configuration

In `lib/config/pricing.ts`, replace the placeholder variant IDs with your actual Lemon Squeezy variant IDs:

```typescript
export const PricingPlans: PricingPlanTypes[] = [
  {
    // ... other fields
    priceId: "price_monthly", // Stripe price ID
    variantId: "123456", // Replace with actual Lemon Squeezy variant ID
    // ... other fields
  },
  // ... other plans
];

export const Credits = {
  // ... other fields
  plans: [
    {
      // ... other fields
      priceId: "price_1R1lYvBHZrPbyfpw61VxXbqq", // Stripe price ID
      variantId: "789012", // Replace with actual Lemon Squeezy variant ID
      // ... other fields
    },
    // ... other credit plans
  ],
};
```

### 3. Webhook Configuration

1. In your Lemon Squeezy dashboard, go to Settings > Webhooks
2. Add a new webhook with the URL: `https://yourdomain.com/api/webhook/lemonsqueezy`
3. Select these events:
   - `order_created`
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
4. Copy the webhook secret and add it to your `.env` file

### 4. Testing

1. Start your development server: `npm run dev`
2. Go to the pricing page
3. Toggle between Stripe and Lemon Squeezy payment methods
4. Test the checkout flow for both providers

## How to Get Variant IDs

1. **Log into Lemon Squeezy Dashboard**
2. **Go to Products** in the left sidebar
3. **Click on a product** to view its details
4. **Look for the Variant ID** - it's usually a 6-digit number
5. **Copy this ID** and replace the placeholder in `lib/config/pricing.ts`

## How to Get Webhook Secret

1. **Go to Settings > Webhooks** in Lemon Squeezy dashboard
2. **Create a new webhook** with your endpoint URL
3. **Copy the webhook secret** that's generated
4. **Add it to your `.env` file**

## Features

- **Dual Payment Support**: Users can choose between Stripe and Lemon Squeezy
- **Unified Checkout**: Same checkout button works for both providers
- **Webhook Processing**: Automatic credit/plan updates via webhooks
- **User Authentication**: Integrated with Clerk authentication
- **Database Integration**: Updates user data in MongoDB

## File Structure

```
├── components/
│   ├── buttons/checkout-button.tsx          # Unified checkout button
│   ├── credit-top-up-dialog.tsx             # Credit purchase dialog
│   └── landing/pricing/pricing-1.tsx        # Pricing page
├── app/api/
│   ├── payments/lemonsqueezy/create-checkout/route.ts  # Checkout API
│   └── webhook/lemonsqueezy/route.ts        # Webhook handler
├── lib/
│   ├── config/pricing.ts                    # Pricing configuration
│   └── lemonsqueezy.ts                      # Lemon Squeezy setup
└── .env                                     # Environment variables
```

## Troubleshooting

### Common Issues and Solutions

1. **"Variant ID is required" error**

   - **Solution**: Make sure you've replaced all placeholder variant IDs in `lib/config/pricing.ts` with actual variant IDs from your Lemon Squeezy dashboard

2. **"User not authenticated" error**

   - **Solution**: Make sure you're logged in through Clerk authentication before testing checkout

3. **"Lemon Squeezy API key not configured" error**

   - **Solution**: Check that `LEMON_SQUEEZY_API_KEY` is properly set in your `.env` file

4. **"Invalid variant ID format" error**

   - **Solution**: Ensure variant IDs are numeric strings (e.g., "123456") not descriptive strings

5. **Webhook not working**

   - **Solution**:
     - Check that the webhook URL is correct and accessible
     - Verify the webhook secret matches between dashboard and `.env` file
     - Ensure your domain is publicly accessible for webhook delivery

6. **Checkout fails with API error**
   - **Solution**:
     - Verify your API key is valid and has proper permissions
     - Check that the store ID is correct
     - Ensure the variant ID exists in your Lemon Squeezy store

### Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Variant IDs are replaced with real IDs from Lemon Squeezy dashboard
- [ ] Webhook is configured with correct URL and secret
- [ ] User authentication is working
- [ ] Database connection is established
- [ ] Products exist in Lemon Squeezy dashboard with correct pricing

### Debug Endpoints

You can use these endpoints to debug configuration:

- `GET /api/test-env` - Check environment variables
- `GET /api/payment-status` - Check payment provider configuration
- `POST /api/payments/lemonsqueezy/create-checkout` - Test checkout creation

## Notes

- Both payment providers work independently
- Users can switch between providers on the pricing page
- All payment processing is handled server-side for security
- Webhooks ensure automatic updates when payments are processed
- Make sure to test in both development and production environments
