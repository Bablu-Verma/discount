import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel"; 

import { NextResponse } from "next/server";


const validateCampaignData = (data: any) => {
  const requiredFields = [
    "title", "price", "offer_price", "cashback",
    "category", "description", "img", 
    "active", "tc", "start_date", "end_date", "slug", "meta_title", 
    "meta_description", "meta_keywords",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `Missing required field: ${field}`;
    }
  }
 
  if (data.price && isNaN(Number(data.price))) {
    return "Price should be a valid number.";
  }

  if (data.offer_price && isNaN(Number(data.offer_price))) {
    return "Offer price should be a valid number.";
  }

  return null;
};

// POST handler to create a new campaign
export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json(); 

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
          message:"Access denied. Only admins can add campaigns.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const validationError = validateCampaignData(requestData);
    if (validationError) {
      return new NextResponse(
        JSON.stringify({ success: false, message: validationError }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

   
    const campaign = new CampaignModel(requestData);

   
    await campaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign added successfully",
        data: campaign, 
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) { 
    if (error instanceof Error) { 
      console.error("Failed to create campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to create campaign",
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
          message: "An unexpected error occurred",
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
