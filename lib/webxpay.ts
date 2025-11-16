/**
 * WebXPay Payment Gateway Integration
 * Sri Lankan local payment gateway
 * Documentation: https://developers.webxpay.com/
 */

interface WebXPayConfig {
  merchantId: string;
  secretKey: string;
  apiUrl: string;
  returnUrl: string;
  cancelUrl: string;
}

interface WebXPayPaymentRequest {
  merchant_id: string;
  order_id: string;
  amount: number;
  currency: string;
  description: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  hash: string;
}

interface WebXPayPaymentResponse {
  status: string;
  payment_url?: string;
  transaction_id?: string;
  message?: string;
}

/**
 * Initialize WebXPay configuration
 */
export function getWebXPayConfig(): WebXPayConfig | null {
  const merchantId = process.env.WEBXPAY_MERCHANT_ID;
  const secretKey = process.env.WEBXPAY_SECRET_KEY;
  const apiUrl = process.env.WEBXPAY_API_URL || "https://api.webxpay.com";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!merchantId || !secretKey) {
    return null;
  }

  return {
    merchantId,
    secretKey,
    apiUrl,
    returnUrl: `${baseUrl}/app/billing/success-payment`,
    cancelUrl: `${baseUrl}/app/billing`,
  };
}

/**
 * Generate hash for WebXPay payment request
 * WebXPay uses MD5 hash for request signing
 */
export function generateWebXPayHash(
  params: Record<string, string | number>,
  secretKey: string
): string {
  const crypto = require("crypto");
  
  // Sort parameters alphabetically and create hash string
  const sortedKeys = Object.keys(params).sort();
  const hashString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  
  const fullHashString = `${hashString}&key=${secretKey}`;
  
  // Generate MD5 hash
  return crypto.createHash("md5").update(fullHashString).digest("hex").toUpperCase();
}

/**
 * Create a payment request for WebXPay
 */
export async function createWebXPayPayment(
  orderId: string,
  amount: number,
  currency: string = "LKR",
  description: string,
  customerName?: string,
  customerEmail?: string,
  customerPhone?: string
): Promise<WebXPayPaymentResponse> {
  const config = getWebXPayConfig();
  
  if (!config) {
    throw new Error(
      "WebXPay is not configured. Please set WEBXPAY_MERCHANT_ID and WEBXPAY_SECRET_KEY environment variables."
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const notifyUrl = `${baseUrl}/api/webhook/webxpay`;

  // Prepare payment parameters
  const paymentParams: Record<string, string | number> = {
    merchant_id: config.merchantId,
    order_id: orderId,
    amount: amount.toFixed(2),
    currency: currency,
    description: description,
    return_url: config.returnUrl,
    cancel_url: config.cancelUrl,
    notify_url: notifyUrl,
  };

  // Add optional customer information
  if (customerName) {
    paymentParams.customer_name = customerName;
  }
  if (customerEmail) {
    paymentParams.customer_email = customerEmail;
  }
  if (customerPhone) {
    paymentParams.customer_phone = customerPhone;
  }

  // Generate hash
  const hash = generateWebXPayHash(paymentParams, config.secretKey);
  paymentParams.hash = hash;

  try {
    // Make API request to WebXPay
    const response = await fetch(`${config.apiUrl}/api/v1/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(paymentParams),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create WebXPay payment");
    }

    return {
      status: data.status || "success",
      payment_url: data.payment_url || data.url,
      transaction_id: data.transaction_id || data.order_id,
      message: data.message,
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to create WebXPay payment request"
    );
  }
}

/**
 * Verify WebXPay webhook signature
 */
export function verifyWebXPayWebhook(
  params: Record<string, string>,
  secretKey: string
): boolean {
  const receivedHash = params.hash;
  if (!receivedHash) {
    return false;
  }

  // Remove hash from params for verification
  const { hash, ...paramsToVerify } = params;

  // Generate expected hash
  const expectedHash = generateWebXPayHash(paramsToVerify, secretKey);

  return receivedHash.toUpperCase() === expectedHash.toUpperCase();
}

/**
 * Get payment status from WebXPay
 */
export async function getWebXPayPaymentStatus(
  transactionId: string
): Promise<any> {
  const config = getWebXPayConfig();
  
  if (!config) {
    throw new Error("WebXPay is not configured");
  }

  const params: Record<string, string> = {
    merchant_id: config.merchantId,
    transaction_id: transactionId,
  };

  const hash = generateWebXPayHash(params, config.secretKey);
  params.hash = hash;

  try {
    const response = await fetch(`${config.apiUrl}/api/v1/payment/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get payment status");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to get WebXPay payment status"
    );
  }
}

/**
 * Check if WebXPay is configured
 */
export function isWebXPayConfigured(): boolean {
  return !!(
    process.env.WEBXPAY_MERCHANT_ID && process.env.WEBXPAY_SECRET_KEY
  );
}

