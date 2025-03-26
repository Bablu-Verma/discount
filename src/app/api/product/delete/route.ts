import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";


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
      
          if (!(usertype === "admin" || usertype === "data_editor")) {
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
   
    const { id } = await req.json();

    if (!id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find the campaign by ID
    const campaign_ = await CampaignModel.findById(id);

    if (!campaign_) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Campaign not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    campaign_.product_status = "DELETE";
    await campaign_.save();


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign soft deleted successfully.",
        // data: campaign_,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to delete campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete campaign.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
