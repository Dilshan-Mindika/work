import Feedback from "@/models/feedback";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

/**
 * POST endpoint to create a new user feedback
 * @param req NextRequest object containing feedback data (rate and feedback text)
 * @returns Response with success/error status and message
 */
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.FEEDBACK)(async (req: NextRequest) => {
  try {
    // Extract rate and feedback from request body
    const { rate, feedback } = await req.json();

    // Get authenticated user ID
    const { userId } = await auth();

    // Validate required fields
    if (!rate || !feedback) {
      return NextResponse.json(
        { error: "Rate and feedback are required" },
        { status: 400 }
      );
    }

    // Create new feedback document in database
    const newFeedback = await Feedback.create({
      star: rate,
      comment: feedback,
      userId,
    });

    // Return error if feedback creation failed
    if (!feedback) {
      return NextResponse.json(
        {
          status: "error",
          message: "Something Wrong",
          code: "NOT_CREATE_FEEDBACK",
        },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        status: "Success",
        message: "Feedback Saved",
        code: "FEEDBACK_CREATED",
      },
      { status: 201 }
    );
  } catch (err) {
    // Log and return server error
    console.error(err);
    return NextResponse.json(
      {
        status: "error",
        message: "Server Error",
        code: "SERVER_ERR",
      },
      { status: 500 }
    );
  }
});
