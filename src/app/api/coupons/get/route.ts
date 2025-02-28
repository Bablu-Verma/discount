import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { page = 1, limit = 10 } = await req.json(); 
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));

    // Fetch coupons with related store and category details
    const coupons = await CouponModel.find({ deleted_coupon: false, status: true })
      .populate("store", "name img slug") // Fetch store details
      .populate("category", "name") // Fetch category details
      .sort({ createdAt: -1 }) // Latest coupons first
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Count total active coupons
    const totalCoupons = await CouponModel.countDocuments({ deleted_coupon: false, status: true });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Coupons fetched successfully.",
        data: coupons,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalCoupons / pageSize),
          totalCoupons,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch coupons:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch coupons.", error: error.message }),
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
