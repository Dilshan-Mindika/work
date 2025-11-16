import User from "@/models/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

/**
 * GET endpoint to retrieve user billing information
 * @param req - Next.js request object
 * @returns Response with user's plan details and credits, or error if user not found
 */
export const GET = async (req: NextRequest) => {
  // Get authenticated user ID from Clerk
  const { userId } = await auth();

  // Return early if no user is authenticated
  if (!userId) return;

  try {
    // Find user document in database
    const user = await User.findOne({ id: userId });

    // Return 404 if user not found
    if (!user) {
      return Response.json(
        {
          status: "error",
          message: "User Not Found",
          code: "USER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Get user's plan type
    const plan = user.plan.planType;

    // Return plan details and credits
    return Response.json(
      { plan, details: user.plan, credits: user.credits || 0 },
      { status: 200 }
    );
  } catch (er) {
    // Log and return server error
    console.error(er);
    return Response.json(
      {
        status: "error",
        message: "Server Error",
        code: "SERVER_ERR",
      },
      { status: 500 }
    );
  }
};
