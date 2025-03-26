import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import StoreModel from "@/model/StoreModel";
import CategoryModel from "@/model/CategoryModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";
import BlogModel from "@/model/BlogModal";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Extract search query from request body
    const requestData = await req.json();
    const { query } = requestData;

    if (!query || query.trim() === "") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Search query is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Common search filter (case-insensitive search + only active items)
    const searchFilter = {
      $regex: query,
      $options: "i", // Case insensitive search
    };

    // Fetching active results with a limit of 10 per category
    const [blogs, stores, categories, coupons, campaigns] = await Promise.all([
      BlogModel.find({ title: searchFilter, status: "ACTIVE" }).limit(10).populate('writer_id', 'name email profile').populate('blog_category', 'name slug'),
      StoreModel.find({ name: searchFilter, store_status: "ACTIVE" }).limit(10),
      CategoryModel.find({ name: searchFilter, status: "ACTIVE" }).limit(10),
      CouponModel.find({ code: searchFilter, status: "ACTIVE" }).limit(10).populate('store', 'name slug store_img').populate('category', 'name slug'),
      CampaignModel.find({ title: searchFilter, product_status: "ACTIVE" }).limit(10).populate('store', 'name slug store_img').populate('category', 'name slug'),
    ]);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Search results retrieved successfully.",
        data: {
          blogs,
          stores,
          categories,
          coupons,
          campaigns,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Search failed:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to perform search.",
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
