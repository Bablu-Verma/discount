import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignQueryModel from "@/model/CampaignQueryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

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
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the request body
    const { user_message, subject, campaign_id, whatsapp_number, location } =
      await req.json();

    // Step-by-step validation for each field
    if (!user_message) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Message is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!subject) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Subject is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!campaign_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign ID is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!whatsapp_number) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "WhatsApp number is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!location) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Location is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 2: Create a new campaign query
    const newCampaignQuery = new CampaignQueryModel({
      email: user?.email,
      message: user_message,
      subject,
      campaign_id,
      whatsapp_number,
      location,
    });

    await newCampaignQuery.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Your query added successfully. contact soon.",
        data: newCampaignQuery,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding campaign query:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add campaign query.",
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
