import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { coupon_id } = await req.json(); // Extract coupon_id from request body

    if (!coupon_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find coupon with related store and category details
    const coupon = await CouponModel.findOne({ _id: coupon_id, deleted_coupon: false })

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
    if (error instanceof Error) {
      console.error("Failed to fetch coupon details:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch coupon details.", error: error.message }),
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
