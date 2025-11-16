import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

/**
 * GET endpoint to fetch list of registered users
 * Returns limited number of users ordered by creation date
 * @param req NextRequest object containing limit query parameter
 * @returns Response with user list or error message
 */
export const GET = async (req: NextRequest) => {
  // Get query parameters
  const searchParams = req.nextUrl.searchParams;
  let limit = 10; // Default limit

  // Parse limit from query params
  limit = parseInt(searchParams.get("limit")!);

  try {
    // Initialize Clerk client and fetch users
    const client = await clerkClient();
    const _users = await client.users.getUserList({
      orderBy: "created_at", // Sort by newest first
      limit,
    });

    // Transform user data to return only needed fields
    const users = _users.data.map((user) => ({
      imageUrl: user.imageUrl,
      displayName: `${user.firstName} ${user.lastName}`,
    }));

    // Return successful response with users
    return Response.json(users, { status: 200 });
  } catch (err) {
    // Log and return error response
    console.error(err);
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
