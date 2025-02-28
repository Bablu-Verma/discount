import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { name, slug, status, startDate, endDate, deleted_category, page = 1, limit = 10 } = requestData;

    const query: any = {};

    // Name Filter (Case-Insensitive Search)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Slug Filter
    if (slug) {
      query.slug = slug;
    }

    // Apply status filtering
    if (status === "PUBLISH") {
      query.status = true; 
    } else if (status === "PUBLISH_OF") {
      query.status = false; 
    } else if (status === "ALL") {
      query.status = { $in: [true, false] }; 
    }

    // Date Filter
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // Deleted Category Filter
    if (deleted_category !== undefined) {
      query.deleted_category = deleted_category;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find(query).skip(skip).limit(limit);
    const totalCategories = await CategoryModel.countDocuments(query);
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
