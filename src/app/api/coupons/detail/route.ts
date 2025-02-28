import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { coupon_id, status = "ALL", deleted_coupon = "ALL" } = await req.json(); // Extract filters

    if (!coupon_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const query: any = { _id: coupon_id };

    // ✅ Filter by status (ACTIVE, OFF, ALL)
    if (status !== "ALL") {
      query.status = status === "ACTIVE";
    }

    // ✅ Filter by deleted_coupon (DELETE, ACTIVE, ALL)
    if (deleted_coupon !== "ALL") {
      query.deleted_coupon = deleted_coupon === "DELETE";
    }

    // ✅ Find coupon with store and category details
    const coupon = await CouponModel.findOne(query)
      .populate("store", "name img slug")
      .populate("category", "name")
      .lean();

    if (!coupon) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "Coupon details fetched successfully.", data: coupon }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch coupon details:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch coupon details.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
