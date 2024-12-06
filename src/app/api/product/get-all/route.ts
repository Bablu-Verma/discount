import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel"; 

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json(); 

    const {
      page = 1,
      limit = 20,
      category,
      active,
      hot,
      newCampaign,
      cashback,
      minPrice,
      maxPrice,
    } = requestData;

    const filterConditions: Record<string, any> = {};

    if (category) filterConditions.category = category;
    if (active !== undefined) filterConditions.active = active;
    if (hot !== undefined) filterConditions.hot = hot;
    if (newCampaign !== undefined) filterConditions.newCampaign = newCampaign;
    if (cashback !== undefined) filterConditions.cashback = cashback;
    if (minPrice !== undefined && maxPrice !== undefined) {
      filterConditions.price = { $gte: minPrice, $lte: maxPrice };
    }

    
    const skip = (page - 1) * limit;

   
    const campaigns = await CampaignModel.find(filterConditions)
      .skip(skip)
      .limit(limit);

    
    const totalCount = await CampaignModel.countDocuments(filterConditions);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaigns retrieved successfully",
        data: campaigns,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
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
      console.error("Failed to retrieve campaigns:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve campaigns",
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


// seand data 



{
  //   "page": 1,
  //   "limit": 20,
  //   "category": "Electronics",
  //   "active": true
  //   "hot": true,
  //   "newCampaign": false,
  //   "cashback": true,
  //   "minPrice": 100,
  //   "maxPrice": 500
 }