import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";


export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);
    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract data from request
    const {
    
    } = await req.json();

 

    
 

    // Create new order
    const newOrder = new RecordModel({
     
    });

    const save_order = await newOrder.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Order created successfully",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create order:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to create order.",
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
