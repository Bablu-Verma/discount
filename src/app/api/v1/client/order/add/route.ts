import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";
import { v4 as uuidv4 } from 'uuid';
import OrderModel from "@/model/OrderModel";



export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);
    if (!authenticated || !user) {
      return NextResponse.json({ success: false, message }, { status: 401 });
    }
    

 

  
    

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
    
    }, { status: 201 });

  }catch (error) {
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
