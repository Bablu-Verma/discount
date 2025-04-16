import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";


export async function POST(req: Request) {
  await dbConnect();

  try {
    // Extracting slug and access_type from request body
    const { slug } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Slug is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const query: any = { slug };

    query.store_status = "ACTIVE";

    const store = await StoreModel.findOne(query).select("-store_status").populate('category', 'name slug');

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const relatedProducts = await CampaignModel.find({ store: store._id })
      .select(
        "store category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id"
      )
      .lean()
      .populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug")
      .limit(10)
      .lean();

    const relatedCoupons = await CouponModel.find({ store: store._id })
    .select('-description -status')
      .populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug")
      .limit(10)
      .lean();


    
    const relatedStores = await StoreModel.find({
      category: store.category?._id,
      slug: { $ne: store.slug },
      store_status: "ACTIVE",
    })
      .select("name slug store_img")
      .populate("category", "name slug")
      .limit(10)
      .lean();


    const topStores = await StoreModel.find({
      store_status: "ACTIVE",
    })
      .select("name slug store_img")
      .populate("category", "name slug")
      .sort({ createdAt: -1 }) 
      .limit(5)
      .lean();



    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store fetched successfully.",
        data: {
          store: store,
          related_product: relatedProducts,
          related_coupons: relatedCoupons,
          related_stores:relatedStores,
          top_stores:topStores
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
