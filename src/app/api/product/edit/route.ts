import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

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
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const email_check = user?.email || '';
    const is_admin = await isAdmin(email_check); 

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message:"Access denied. Only admins can edit campaigns.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Parse the request body
    const requestData = await req.json();
    const { campaignId, updates } = requestData;

    if (!campaignId || !updates || typeof updates !== "object") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid request data. 'campaignId' and 'updates' are required.",
        }),
        {
          status: 400, 
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign not found.",
        }),
        {
          status: 404, 
          headers: { "Content-Type": "application/json" },
        }
      );
    }

  
    Object.keys(updates).forEach((key) => {
      if (campaign[key] !== undefined) {
        campaign[key] = updates[key];
      }
    });

   
    await campaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign edited successfully.",
        campaign,
      }),
      {
        status: 200, 
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to edit campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to edit campaign.",
          error: error.message,
        }),
        {
          status: 500, 
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        {
          status: 500, 
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
