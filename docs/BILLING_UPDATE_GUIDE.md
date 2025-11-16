# Billing Update Guide

This guide explains how to update billing information in your React context after payments or other billing changes.

## Overview

Your app uses a React context (`AppContext`) to manage billing state. After a payment is processed, you need to refresh this data to reflect the updated plan, credits, and other billing information.

## How It Works

1. **Webhook Processing**: When a payment is completed, webhooks (Stripe/Lemon Squeezy) update the database
2. **Context Refresh**: Your React context needs to be updated to reflect these changes
3. **UI Update**: Components automatically re-render with the new billing data

## Available Methods

### 1. Using the Context Directly

```tsx
import { useAppContext } from "@/context/app";

function MyComponent() {
  const { refreshBillingData, billing } = useAppContext();

  const handlePaymentSuccess = async () => {
    try {
      await refreshBillingData();
      console.log("Billing data updated!");
    } catch (error) {
      console.error("Failed to update billing data:", error);
    }
  };

  return (
    <div>
      <p>Current Plan: {billing?.details.name}</p>
      <p>Credits: {billing?.credits}</p>
      <button onClick={handlePaymentSuccess}>Refresh Billing Data</button>
    </div>
  );
}
```

### 2. Using the Custom Hook

```tsx
import { useBillingRefresh } from "@/hooks/use-billing-refresh";

function MyComponent() {
  const { refresh, isRefreshing, error } = useBillingRefresh();

  const handleRefresh = async () => {
    await refresh();

    if (error) {
      console.error("Refresh failed:", error);
    } else {
      console.log("Refresh successful!");
    }
  };

  return (
    <button onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? "Refreshing..." : "Refresh Billing"}
    </button>
  );
}
```

### 3. Using the Refresh Button Component

```tsx
import BillingRefreshButton from "@/components/billing-refresh-button";

function MyComponent() {
  return (
    <BillingRefreshButton
      variant="outline"
      size="lg"
      showText={true}
      onSuccess={() => console.log("Success!")}
      onError={(error) => console.error("Error:", error)}
    />
  );
}
```

## Common Use Cases

### After Payment Success

The success payment page automatically refreshes billing data:

```tsx
// app/[locale]/(platform)/app/billing/success-payment/page.tsx
useEffect(() => {
  const handleSuccessPayment = async () => {
    // Wait for webhook to process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Refresh billing data
    await refreshBillingData();
  };

  handleSuccessPayment();
}, [refreshBillingData]);
```

### Manual Refresh

Users can manually refresh their billing data:

```tsx
import BillingRefreshButton from "@/components/billing-refresh-button";

// In your billing page or component
<BillingRefreshButton variant="outline" size="lg" showText={false} />;
```

### Periodic Refresh

For real-time updates (optional):

```tsx
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      await refreshBillingData();
    } catch (error) {
      console.error("Periodic refresh failed:", error);
    }
  }, 60000); // Refresh every minute

  return () => clearInterval(interval);
}, [refreshBillingData]);
```

## API Endpoint

The billing data is fetched from `/api/app` which returns:

```json
{
  "billing": {
    "plan": "premium",
    "details": {
      "planType": "premium",
      "features": ["feature1", "feature2"],
      "popular": true,
      "billingCycle": "monthly",
      "currencySymbol": "$",
      "link": "/billing",
      "name": "Pro Plan",
      "price": "$29",
      "priceId": "price_123"
    },
    "credits": 100
  },
  "user": {
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "myFeedback": {
    "submited": false,
    "feedback": {
      "avatar": "",
      "star": 0,
      "comment": ""
    }
  }
}
```

## Error Handling

All methods include error handling:

```tsx
const { refresh, isRefreshing, error } = useBillingRefresh();

if (error) {
  // Handle error (show toast, retry, etc.)
  toast.error("Failed to refresh billing data");
}
```

## Best Practices

1. **Wait for Webhooks**: Always wait a few seconds after payment before refreshing to ensure webhooks have processed
2. **Show Loading States**: Use the `isRefreshing` state to show loading indicators
3. **Handle Errors**: Always handle potential errors during refresh
4. **Cache Control**: The refresh function uses `cache: "no-store"` to ensure fresh data
5. **User Feedback**: Provide clear feedback when billing data is updated

## Troubleshooting

### Billing data not updating?

1. Check if webhooks are working properly
2. Verify the `/api/app` endpoint is returning correct data
3. Ensure you're waiting long enough for webhook processing
4. Check browser console for errors

### Refresh not working?

1. Verify the context is properly wrapped around your component
2. Check if the API endpoint is accessible
3. Ensure authentication is working
4. Check network tab for failed requests

## Examples

See `examples/billing-update-examples.tsx` for comprehensive examples of all usage patterns.
