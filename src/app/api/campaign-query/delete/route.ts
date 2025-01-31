import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignQueryModel from "@/model/CampaignQueryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate"; // Authentication middleware
import { Types } from "mongoose";

export async function DELETE(req: Request) {
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
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { queryId } = await req.json();

    if (!queryId || !Types.ObjectId.isValid(queryId)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid or missing query ID.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const campaignQuery = await CampaignQueryModel.findByIdAndDelete(queryId);

    if (!campaignQuery) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign query not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign query deleted successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting campaign query:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete campaign query.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
