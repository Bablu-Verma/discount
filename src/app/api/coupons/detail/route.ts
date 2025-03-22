import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { coupon_id, status} = await req.json(); 

    if (!coupon_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const query: any = { _id: coupon_id };

    if (status && status !== "ALL") {
      query.status = status; 
    }
  

    // ✅ Find coupon with store and category details
    const coupon = await CouponModel.findOne(query)
      .populate("store", "name slug store_img store_link")
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
