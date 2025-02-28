import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { name, slug, startDate, endDate, status, page = 1, limit = 10 } = requestData;

    const query: any = {};
    
    if (name) {
      query.name = { $regex: name, $options: "i" }; 
    }

    if (slug) {
      query.slug = slug;
    }

    if (status === "PUBLISH") {
      query.status = true; 
    } else if (status === "PUBLISH_OF") {
      query.status = false; 
    } else if (status === "ALL") {
      query.status = { $in: [true, false] }; 
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    const skip = (page - 1) * limit;
    const categories = await BlogCategoryModel.find(query).skip(skip).limit(limit);
    const totalCategories = await BlogCategoryModel.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories fetched successfully.",
        data: categories,
        pagination: {
          currentPage: page,
          totalPages,
          totalCategories,
          limit,
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
