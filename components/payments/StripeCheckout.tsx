import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Only load Stripe if the publishable key is available
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: Error) => void;
}

export function StripeCheckout({
  amount,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  // Check if Stripe is configured
  if (!stripePromise) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
          <p className="text-yellow-800">
            Stripe is not configured. Please set
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.
          </p>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payments/stripe/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

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
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount / 100}`}
      </button>
    </div>
  );
}
