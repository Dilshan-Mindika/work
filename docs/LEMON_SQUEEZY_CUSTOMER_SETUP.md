# Lemon Squeezy Customer Creation & Non-Editable Email Setup

This document explains the implementation of automatic Lemon Squeezy customer creation and non-editable email functionality in the checkout process.

## Overview

The system now automatically:

1. **Creates Lemon Squeezy customers** when users sign up or make their first purchase
2. **Makes customer emails non-editable** in the checkout form
3. **Saves customer IDs** to the database for future reference
4. **Reuses existing customers** for subsequent purchases

## Implementation Details

### 1. Customer Creation Process

#### During User Registration (Clerk Webhook)

- When a new user is created via Clerk, the system automatically creates a Lemon Squeezy customer
- The customer ID is saved to both Clerk's private metadata and the MongoDB user document
- This happens in `app/api/webhook/clerk/route.ts`

#### During Checkout (Fallback)

- If a user doesn't have a Lemon Squeezy customer ID, one is created during checkout
- This ensures all users have customer records before making purchases
- Implemented in `app/api/payments/lemonsqueezy/create-checkout/route.ts`

### 2. Non-Editable Email Implementation

The email field is made non-editable by:

- Pre-filling the customer email in the checkout data
- Using the `customerId` parameter in checkout options
- Lemon Squeezy automatically locks the email field when a customer ID is provided

### 3. Database Schema

The User model includes a `lemonsqueezyCustomerId` field:

```typescript
const UserSchema = new Schema({
  // ... other fields
  lemonsqueezyCustomerId: { type: String },
  // ... other fields
});
```

## Key Functions

### `getOrCreateLemonSqueezyCustomer()`

This function handles customer creation and retrieval:

```typescript
async function getOrCreateLemonSqueezyCustomer(
  userId: string,
  userEmail: string,
  userFirstName?: string,
  userLastName?: string
) {
  // Check if user already has a customer ID
  let user = await User.findOne({ id: userId });

  if (user?.lemonsqueezyCustomerId) {
    return user.lemonsqueezyCustomerId;
  }

  // Create new customer in Lemon Squeezy
  const { data: customerData, error } = await createCustomer(storeId, {
    name: `${userFirstName} ${userLastName}`,
    email: userEmail,
    city: null,
    region: null,
    country: null,
  });

  // Save customer ID to database
  await User.updateOne(
    { id: userId },
    { lemonsqueezyCustomerId: customerData.data.id }
  );

  return customerData.data.id;
}
```

### `createCheckoutOptions()`

Updated to include customer ID for non-editable email:

```typescript
function createCheckoutOptions(
  // ... other parameters
  customerId?: string
) {
  const checkoutOptions: any = {
    // ... other options
  };

  // Make email non-editable by setting customer ID
  if (customerId) {
    checkoutOptions.customerId = customerId;
  }

  return checkoutOptions;
}
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Testing

### 1. Test Customer Creation

Run the test script to verify customer creation:

```bash
node test-lemonsqueezy-customer.js
```

### 2. Manual Testing Steps

1. **Create a new user account**

   - Check that a Lemon Squeezy customer is created automatically
   - Verify the customer ID is saved to the database

2. **Make a purchase**

   - Go through the checkout process
   - Verify the email field is non-editable
   - Confirm the purchase completes successfully

3. **Check existing customers**
   - Try making another purchase with the same user
   - Verify the existing customer ID is reused
   - Confirm no duplicate customers are created

## Benefits

### For Users

- **Consistent experience**: Email is pre-filled and locked
- **Faster checkout**: No need to re-enter email information
- **Account continuity**: All purchases linked to the same customer record

### For Business

- **Better data integrity**: No duplicate customer records
- **Improved analytics**: All user activity linked to single customer ID
- **Easier support**: Clear customer history in Lemon Squeezy dashboard

## Troubleshooting

### Common Issues

1. **Customer creation fails**

   - Check API key permissions
   - Verify store ID is correct
   - Ensure environment variables are set

2. **Email still editable**

   - Verify customer ID is being passed to checkout
   - Check Lemon Squeezy dashboard for customer creation
   - Ensure checkout options include `customerId`

3. **Duplicate customers**
   - Check database for existing `lemonsqueezyCustomerId`
   - Verify the `getOrCreateLemonSqueezyCustomer` function logic
   - Review webhook processing for user creation events

### Debug Logging

The system includes comprehensive logging:

```typescript
console.log(
  "✅ User already has Lemon Squeezy customer ID:",
  user.lemonsqueezyCustomerId
);
console.log("🔄 Creating new Lemon Squeezy customer for user:", userId);
console.log("✅ Lemon Squeezy customer created:", customerId);
```

## Future Enhancements

Potential improvements to consider:

1. **Customer data sync**: Periodically sync customer data between systems
2. **Bulk customer import**: Import existing customers from other systems
3. **Customer segmentation**: Use customer data for targeted marketing
4. **Advanced analytics**: Track customer behavior and purchase patterns

## Support

For issues or questions:

1. Check the debug logs in your application
2. Verify Lemon Squeezy dashboard for customer records
3. Review the database for customer ID storage
4. Test with the provided test script
