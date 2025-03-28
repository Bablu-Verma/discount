import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Extract Query Parameters from Request Body
    const {
      page = 1,
      limit = 10,
      search
    } = await req.json();

    const query: any = {};

    // Filter: Store Name (Partial Search)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    query.store_status = "ACTIVE";

    // Pagination Setup
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch Stores with Filtering, Pagination & Sorting
    const stores = await StoreModel.find(query)
    .select('-description -store_status')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    // Count Total Matching Stores
    const totalStores = await StoreModel.countDocuments(query);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store list fetched successfully.",
        data: stores,
        pagination: {
          totalStores,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalStores / pageSize),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store list:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch store list.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
