import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignQueryModel from "@/model/CampaignQueryModel";
import { authenticateUser } from "@/lib/authenticate"; 
import { Types } from "mongoose";
import { isAdmin } from "@/lib/checkUserRole";

export async function POST(req: Request) {
  await dbConnect();

  try {
  
    const { authenticated, user, message } = await authenticateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }


    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to view.",
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


    const campaignQuery = await CampaignQueryModel.findById(queryId)
      .populate("campaign_id", "name slug image active status")
      .lean();

  
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
        message: "Campaign query retrieved successfully.",
        data: campaignQuery,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching campaign query:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch campaign query.",
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
