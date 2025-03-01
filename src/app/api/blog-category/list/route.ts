import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { name, status, startDate, endDate, page = 1, limit = 10 } = requestData;

    const query: any = {};

    // Name Filter (Case-Insensitive Search)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Apply status filtering
    if (status && ["ACTIVE", "INACTIVE", "REMOVED"].includes(status)) {
      query.status = status;
    } else {
      query.status = { $in: ["ACTIVE", "INACTIVE", "REMOVED"] };
    }

    // Date Filter
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

   

    // Pagination
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
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch categories.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
