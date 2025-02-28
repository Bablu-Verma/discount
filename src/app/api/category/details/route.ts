import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Parse request body
    const requestData = await req.json();
    const {
      name,
      slug,
      status = "ALL", // "ALL", "ACTIVE", "OFF"
      deleted_category = "ALL", // "ALL", "DELETE", "ACTIVE"
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = requestData;

    // Construct filter query
    const query: any = {};

    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    if (slug) query.slug = { $regex: slug, $options: "i" };

  
    if (status === "ACTIVE") {
      query.status = true;
    } else if (status === "OFF") {
      query.status = false;
    }

 
    if (deleted_category === "DELETE") {
      query.deleted_category = true;
    } else if (deleted_category === "ACTIVE") {
      query.deleted_category = false;
    }

    // ✅ Date filter
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // Pagination calculations
    const skip = (page - 1) * limit;

    // Fetch data
    const categories = await CategoryModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDocuments = await CategoryModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories fetched successfully.",
        data: categories,
        pagination: {
          currentPage: page,
          totalPages,
          totalDocuments,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
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
