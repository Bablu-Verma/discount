import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { name, page = 1, limit = 10 } = requestData;

    const query: any = {};

    // Name Filter (Case-Insensitive Search)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    query.status = 'ACTIVE'
   
    // Pagination
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find(query).select('-status -description').skip(skip).limit(limit).lean();
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
