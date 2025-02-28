import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Extract filter and pagination parameters
    const requestData = await req.json();
    const {
      page = 1,
      limit = 10,
      status = "ALL",
      deleted_coupon = "ALL",
      category,
      store,
      startDate,
      endDate,
      code,
    } = requestData;

    const query: any = {};

    // ✅ Filter by status (ACTIVE, OFF, ALL)
    if (status !== "ALL") {
      query.status = status === "ACTIVE";
    }

    // ✅ Filter by deleted_coupon (DELETE, ACTIVE, ALL)
    if (deleted_coupon !== "ALL") {
      query.deleted_coupon = deleted_coupon === "DELETE";
    }

    // ✅ Filter by category
    if (category) {
      query.category = category;
    }

    // ✅ Filter by store
    if (store) {
      query.store = store;
    }

    // ✅ Filter by code (Partial search)
    if (code) {
      query.code = { $regex: code, $options: "i" };
    }

    // ✅ Date range filtering
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // ✅ Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    // ✅ Fetch data with filtering, pagination & sorting (Latest first)
    const coupons = await CouponModel.find(query)
      .populate("store", "name img slug") // Fetch store details
      .populate("category", "name") // Fetch category details
      .sort({ createdAt: -1 }) // Latest coupons first
      .skip(skip)
      .limit(pageSize)
      .lean();

    // ✅ Get total count for pagination
    const totalCoupons = await CouponModel.countDocuments(query);
    const totalPages = Math.ceil(totalCoupons / pageSize);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Coupons fetched successfully.",
        data: coupons,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCoupons,
          limit: pageSize,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch coupons:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch coupons.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
