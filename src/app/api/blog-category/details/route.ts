import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    
    const requestData = await req.json();
    const { slug } = requestData; 

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   
    const category = await BlogCategoryModel.findOne({ slug });

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "blog Category not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "blog Category fetched successfully.",
        data: category, 
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
      console.error("Failed to fetch blog category:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch blog category.",
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
