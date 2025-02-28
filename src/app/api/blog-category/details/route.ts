import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";
import BlogModel from "@/model/BlogModal";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { slug, accessType } = requestData;

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category slug is required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const query: any = { slug };

    // 🔹 Apply accessType filtering for category
    if (accessType === "NORMAL_TYPE") {
      query.status = true; // Normal users can only access published categories
    }

    const category = await BlogCategoryModel.findOne(query);

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Blog category not found.",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔹 Fetch related blogs based on category ID
    const blogQuery: any = { categoryId: category._id };

    if (accessType === "NORMAL_TYPE") {
      blogQuery.isPublished = true; // Normal users only see published blogs
    }

    const relatedBlogs = await BlogModel.find(blogQuery).limit(5); // Fetch top 5 related blogs

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog category fetched successfully.",
        data: {
          ...category.toObject(),
          relatedBlogs, // Add related blogs
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch blog category:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch blog category.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
