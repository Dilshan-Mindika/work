import { connectDB } from "@/lib/db";
import Lead from "@/models/leads";
import { NextRequest, NextResponse } from "next/server";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

/**
 * POST endpoint to create a new lead
 * @param req NextRequest object containing the request data
 * @returns Response with appropriate status and message
 */
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.LEAD)(async (req: NextRequest) => {
  try {
    // Connect to database
    await connectDB();

    // Extract email from request body
    const { email } = await req.json();

    // Validate email presence
    if (!email)
      return NextResponse.json(
        {
          status: "error",
          message: "Email are Required!",
          code: "REQUIRED_FIELD",
        },
        { status: 400 }
      );

    // Check if email already exists in database
    const exLead = await Lead.findOne({ email });

    if (exLead?.email) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email already exists",
          code: "EX_EMAIL",
        },
        { status: 200 }
      );
    }

    // Create new lead with email
    await Lead.create({ email });

    // Return success response
    return NextResponse.json(
      { status: "success", message: "Lead Created", code: "CREATED" },
      { status: 201 }
    );
  } catch (er) {
    // Log error and return server error response
    console.error(er);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal Server error, Please check server console",
        code: "SERVER_ERR",
      },
      { status: 500 }
    );
  }
});
