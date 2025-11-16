import { useState } from "react";

interface WebXPayCheckoutProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess: (payment: any) => void;
  onError: (error: Error) => void;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export function WebXPayCheckout({
  amount,
  currency = "LKR",
  description,
  onSuccess,
  onError,
  customerName,
  customerEmail,
  customerPhone,
}: WebXPayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payments/webxpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Payment failed");
      }

      // Redirect to WebXPay payment page
      if (data.payment_url) {
        window.location.href = data.payment_url;
        onSuccess(data);
      } else {
        throw new Error("Payment URL not received");
      }
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
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ${currency === "LKR" ? "Rs." : ""} ${amount.toFixed(2)}`
        )}
      </button>
      <p className="mt-2 text-sm text-gray-600 text-center">
        You will be redirected to WebXPay secure payment page
      </p>
    </div>
  );
}

