"use client";

import { useAppContext } from "@/context/app";
import { useBillingRefresh } from "@/hooks/use-billing-refresh";
import BillingRefreshButton from "@/components/buttons/billing-refresh-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

/**
 * Example 1: Using the custom hook directly
 */
export function Example1_UsingHook() {
  const { refresh, isRefreshing, error } = useBillingRefresh();

  const handleRefresh = async () => {
    await refresh();

    if (error) {
      toast.error("Failed to refresh: " + error);
    } else {
      toast.success("Billing data refreshed successfully!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example 1: Using Hook Directly</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full"
        >
          {isRefreshing ? "Refreshing..." : "Refresh Billing Data"}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}

/**
 * Example 2: Using the refresh button component
 */
export function Example2_UsingButton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example 2: Using Refresh Button</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BillingRefreshButton
          variant="default"
          showText={true}
          onSuccess={() => console.log("Billing refreshed successfully")}
        />

        <BillingRefreshButton variant="outline" size="sm" showText={false} />
      </CardContent>
    </Card>
  );
}

/**
 * Example 3: Using context directly
 */
export function Example3_UsingContext() {
  const { refreshBillingData, billing } = useAppContext();

  const handleRefresh = async () => {
    try {
      await refreshBillingData();
      toast.success("Billing data updated!");
    } catch (error) {
      toast.error("Failed to update billing data");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example 3: Using Context Directly</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleRefresh} className="w-full">
          Refresh from Context
        </Button>

        <div className="bg-muted p-3 rounded">
          <p className="text-sm font-medium">Current Billing Info:</p>
          <p>Plan: {billing?.details.name || "Free"}</p>
          <p>Credits: {billing?.credits || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Example 4: Automatic refresh after payment
 */
export function Example4_AfterPayment() {
  const { refreshBillingData } = useAppContext();

  const simulatePaymentSuccess = async () => {
    // Simulate a payment success scenario
    toast.success("Payment completed! Refreshing billing data...");

    // Wait a bit to simulate webhook processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Refresh billing data
    await refreshBillingData();

    toast.success("Billing data updated after payment!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example 4: After Payment Success</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={simulatePaymentSuccess} className="w-full">
          Simulate Payment Success
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This simulates what happens after a successful payment
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Example 5: Periodic refresh
 */
export function Example5_PeriodicRefresh() {
  const { refreshBillingData } = useAppContext();

  const startPeriodicRefresh = () => {
    // Refresh every 30 seconds (for demo purposes)
    const interval = setInterval(async () => {
      try {
        await refreshBillingData();
        console.log("Periodic billing refresh completed");
      } catch (error) {
        console.error("Periodic refresh failed:", error);
      }
    }, 30000);

    // Cleanup function
    return () => clearInterval(interval);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example 5: Periodic Refresh</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={startPeriodicRefresh} className="w-full">
          Start Periodic Refresh (30s)
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Refreshes billing data every 30 seconds
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Main example component
 */
export default function BillingUpdateExamples() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Billing Update Examples</h1>
      <p className="text-muted-foreground">
        Different ways to update billing data after payment or manually
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Example1_UsingHook />
        <Example2_UsingButton />
        <Example3_UsingContext />
        <Example4_AfterPayment />
        <Example5_PeriodicRefresh />
      </div>
    </div>
  );
}
