import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";


export async function POST(req: Request) {
  await dbConnect();

  try {
    const { slug } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store slug is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find store by slug
    const store = await StoreModel.findOne({ slug });

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const coupons = await CouponModel.find({ store: store._id, status: true })
      .sort({ createdAt: -1 });

   
    const deals = await CampaignModel.find({ store: store._id, status: true })
      .sort({ createdAt: -1 });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store details fetched successfully.",
        data: {
          store,
          coupons,
          deals,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store details:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch store details.", error: error.message }),
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
