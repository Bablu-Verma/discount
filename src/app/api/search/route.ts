import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import CampaignModel from "@/model/CampaignModel";  

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Extract search query from request body
    const requestData = await req.json();
    const { query } = requestData;

    if (!query || query.trim() === "") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Search query is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   
    const categories = await CategoryModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },  
      ],
    });

    const campaigns = await CampaignModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },  
        { description: { $regex: query, $options: "i" } }
      ],
    });

    // Return the search results
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Search results retrieved successfully.",
        data: {
          categories,
          campaigns,
        },
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
      console.error("Search failed:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to perform search.",
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
