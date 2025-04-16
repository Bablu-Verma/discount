import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";
import CouponModel from "@/model/CouponModel";
import StoreModel from "@/model/StoreModel";

export async function POST(req: Request) {
  await dbConnect();

  try {

      const { authenticated, usertype, message } = await authenticateAndValidateUser(req);
    // Parse request body
    const requestData = await req.json();
    const {
      slug,
      status, 
    } = requestData;

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Slug is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construct filter query
    const query: any = { slug };

    query.status ='ACTIVE'
    

    // Fetch data
    const category_details = await CategoryModel.findOne(query).select('-status').lean()

    if (!category_details) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "category not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }


    const relatedProducts = await CampaignModel.find({ category: category_details._id }).select('-user_id -description  -product_tags -long_poster -main_banner -premium_product -flash_sale -t_and_c -meta_title -meta_keywords -meta_description -meta_robots -canonical_url -structured_data -og_image -og_title -og_description -product_status -createdAt -updatedAt')
    .populate("store", "name cashback_type cashback_rate store_link store_img")
    .populate("category", "name slug")
    .limit(10)
    .lean();

  const relatedCoupons = await CouponModel.find({ category: category_details._id })
    .select('-description -expiry_date -category -status')
    .populate("store", "name cashback_type cashback_rate store_link store_img")
    .populate("category", "name slug")
    .limit(10)
    .lean();

    const relatedStore = await StoreModel.find({ category: category_details._id })
    .limit(10).select('-tc -store_status -description').lean()
      
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories details fetched successfully.",
        data: {
          category_details:category_details,
          relatedProducts,
          relatedCoupons,
          relatedStore
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch categories.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}