import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {

    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Extracting slug and access_type from request body
    const { slug, store_status } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Slug is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const query: any = { slug };

    if (store_status === "ALL") {
      query.store_status = { $in: ["ACTIVE", "INACTIVE", "REMOVED"] };
    } else if (["ACTIVE", "INACTIVE", "REMOVED"].includes(store_status)) {
      query.store_status = store_status;
    }

    const store = await StoreModel.findOne(query);

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const relatedProducts = await CampaignModel.find({ store: store._id })
      .populate("store", "name slug store_img")
      .populate("category", "name slug")
      .limit(10)
      .lean();

    const relatedCoupons = await CouponModel.find({ store: store._id })
      .populate("store", "name slug store_img")
      .populate("category", "name slug")
      .limit(10)
      .lean();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store fetched successfully.",
        data: {
          store: store,
          related_product: relatedProducts,
          related_coupons: relatedCoupons,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch store details.",
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
