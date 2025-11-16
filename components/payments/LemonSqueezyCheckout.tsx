import { useState } from "react";

interface LemonSqueezyCheckoutProps {
  variantId: string;
  onSuccess: (checkout: any) => void;
  onError: (error: Error) => void;
}

export function LemonSqueezyCheckout({
  variantId,
  onSuccess,
  onError,
}: LemonSqueezyCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/payments/lemonsqueezy/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ variantId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      // Redirect to Lemon Squeezy checkout
      window.location.href = data.url;
      onSuccess(data);
    } catch (error) {
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Checkout with Lemon Squeezy"}
      </button>
    </div>
  );
}
