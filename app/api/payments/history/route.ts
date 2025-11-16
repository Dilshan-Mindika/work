import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { getUserPaymentHistory } from "@/lib/payment-utils";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");
    const provider = searchParams.get("provider") as
      | "stripe"
      | "lemonsqueezy"
      | "webxpay"
      | undefined;
    const status = searchParams.get("status") || undefined;

    // Get payment history
    const payments = await getUserPaymentHistory(userId, {
      limit,
      skip,
      provider,
      status,
    });

    return NextResponse.json({
      success: true,
      data: payments,
      pagination: {
        limit,
        skip,
        hasMore: payments.length === limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}
