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
      search,
      cashback_status,
      cashback_type,
      store_id,
      store_status,
      startDate,
      endDate,
    } = await req.json();

    const query: any = {};

    // Filter: Cashback Status
    if (cashback_status && ["ACTIVE_CASHBACK", "INACTIVE_CASHBACK"].includes(cashback_status)) {
      query.cashback_status = cashback_status;
    }

    // Filter: Cashback Type
    if (cashback_type && ["PERCENTAGE", "FLAT_AMOUNT"].includes(cashback_type)) {
      query.cashback_type = cashback_type;
    }

    // Filter: Store Name (Partial Search)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter: Store ID
    if (store_id) {
      query.store_id = store_id;
    }

    // Filter: Store Status (Only apply if not "ALL")
    if (store_status && store_status !== "ALL") {
      if (["ACTIVE", "INACTIVE", "REMOVED"].includes(store_status)) {
        query.store_status = store_status;
      }
    }

    // Filter: Date Range (Created At)
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate); // Start Date (Greater than or equal to)
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate); // End Date (Less than or equal to)
      }
    }

    // Pagination Setup
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch Stores with Filtering, Pagination & Sorting
    const stores = await StoreModel.find(query)
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
        totalStores,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalStores / pageSize),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store list:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch store list.", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({ success: false, message: "An unexpected error occurred." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
