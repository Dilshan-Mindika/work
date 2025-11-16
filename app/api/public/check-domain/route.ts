import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

/**
 * API endpoint to check if a domain has valid MX records
 * @param req NextRequest object containing the domain query parameter
 * @returns JSON response indicating if the domain is valid and has MX records
 */
export const GET = withRateLimit(RATE_LIMIT_CONFIGS.DOMAIN_CHECK)(async (req: NextRequest) => {
  // Extract domain from query parameters
  const domain = req.nextUrl.searchParams.get("domain");

  // Return error if domain parameter is missing
  if (!domain) {
    return NextResponse.json(
      { valid: false, message: "Domain is required" },
      { status: 400 }
    );
  }

  try {
    // Attempt to resolve MX records for the domain
    const records = await dns.resolveMx(domain);
    // Return success if MX records exist
    return NextResponse.json({ valid: records.length > 0 });
  } catch (error) {
    // Return error if domain is invalid or MX lookup fails
    return NextResponse.json(
      { valid: false, message: "Invalid domain" },
      { status: 400 }
    );
  }
});
