import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignQueryModel from "@/model/CampaignQueryModel";
import { authenticateUser } from "@/lib/authenticate"; 
import { isAdmin } from "@/lib/checkUserRole";

export async function GET(req: Request) {
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
          message: "You are not authorized to view the users list.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const campaignQueries = await CampaignQueryModel.find()
      .populate("campaign_id", "name slug image active status") 
      .lean(); 

    
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign queries fetched successfully.",
        data: campaignQueries,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching campaign queries:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch campaign queries.",
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
