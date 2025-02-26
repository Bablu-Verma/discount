import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    
    // Fetch categories based on showDeleted flag
    const categories = await BlogCategoryModel.find({});

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories fetched successfully.",
        data: categories,  
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
      console.error("Failed to fetch categories:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch categories.",
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
