import { connectDB } from "@/lib/db";
import Feedback from "@/models/feedback";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

export const GET = withRateLimit(RATE_LIMIT_CONFIGS.PUBLIC)(async (req: NextRequest) => {
  await connectDB();

  const searchParams = req.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit")!) || 10; // Default limit to 10
  const pagination = parseInt(searchParams.get("pagination")!) || 0; // Default to first page
  const orderby = searchParams.get("orderBy") || "createdAt"; // Default order by 'createdAt'
  const query = searchParams.get("query") || ""; // Default query to empty string

  try {
    // Build the query object
    const queryObject = query
      ? { content: { $regex: query, $options: "i" } }
      : {};

    // Fetch feedbacks with pagination, limiting, and sorting
    const feedbacks = await Feedback.find(queryObject)
      .sort({ [orderby]: 1 }) // 1 for ascending order
      .skip(pagination * limit) // Skip the documents for pagination
      .limit(limit); // Limit the number of documents returned

    // Fetch users associated with the feedbacks
    const userIds = feedbacks.map((feedback) => feedback.userId); // Assuming feedback has a userId field
    const users = await User.find({ id: { $in: userIds } }); // Fetch users whose IDs are in userIds

    // Create a mapping of user IDs to user objects
    const userMap: any = {};
    users.forEach((user) => {
      userMap[user.id.toString()] = user; // Convert ObjectId to string for easy access
    });

    // Attach user data to feedbacks
    const feedbackWithUsers = feedbacks.map((feedback) => ({
      ...feedback.toObject(), // Convert feedback to plain object
      user: userMap[feedback.userId.toString()] || null, // Attach user or null if not found
    }));

    return NextResponse.json(feedbackWithUsers, { status: 200 });
  } catch (er) {
    console.error(er);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
});
