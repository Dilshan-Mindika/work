import { connectDB } from "@/lib/db";
import Feedback from "@/models/feedback";
import User from "@/models/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

/**
 * GET endpoint to retrieve user data including billing, feedback and account info
 * @param req - Next.js request object
 * @returns Response with user's complete profile data or error if user not found
 */
export const GET = async (req: NextRequest) => {
  try {
    // Connect to database
    await connectDB();

    // Get authenticated user ID from Clerk
    const { userId } = await auth();

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
        { status: 401 }
      );
    }

    // Get user's plan type
    const plan = user.plan.planType;

    // Get user's feedback details if any exist
    const feedback = await Feedback.findOne({ userId });

    // Return combined user profile data
    return Response.json(
      {
        billing: {
          plan,
          details: user.plan,
          credits: user.credits || 0,
        },
        myFeedback: {
          submited: feedback?.id ? true : false,
          feedback: {
            avatar: feedback?.avatar,
            star: feedback?.star,
            comment: feedback?.comment,
          },
        },
        user: {
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    // Log and return server error
    console.error(err);
    return Response.json(
      {
        status: "error",
        message: "Server Error!",
        code: "SERVER_ERR",
      },
      { status: 500 }
    );
  }
};
