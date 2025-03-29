import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";

import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextResponse } from "next/server";

// API Handler
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();

    const { user_id } = requestData;

    const WithdrawalRequest = await WithdrawalRequestModel.find({
      user_id: user_id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "WithdrawalRequest fetched successfully.",
        withdrawalRequest: WithdrawalRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching blog posts.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
