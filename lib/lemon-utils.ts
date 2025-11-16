import crypto from "crypto";

/**
 * Verify Lemon Squeezy webhook signature
 * @param rawBody - The raw request body as a string
 * @param signature - The X-Signature header from Lemon Squeezy
 * @param secret - Your Lemon Squeezy webhook secret
 * @returns {boolean} - Returns true if the signature is valid, false otherwise
 */
export function verifyLemonSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!secret || !signature || !rawBody) {
    console.error("🚨 Missing required parameters for signature verification.");
    return false;
  }

  try {
    // Create HMAC SHA256 hash
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    // Compare the generated hash with the provided signature
    return crypto.timingSafeEqual(
      Buffer.from(hmac, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch (error) {
    console.error("🚨 Signature verification failed:", error);
    return false;
  }
}
