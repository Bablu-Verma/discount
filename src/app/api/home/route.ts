import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import CategoryModel from "@/model/CategoryModel";
import BlogModel from "@/model/BlogModal";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  const currentDate = new Date();

  try {
    const { authenticated, user, usertype, message } =
      await authenticateAndValidateUser(req);

    // ✅ Ensure all queries are awaited
    const blog = await BlogModel.find({ status: "ACTIVE" }).limit(10);
    const category = await CategoryModel.find({ status: "ACTIVE" });
    const store = await StoreModel.find({ store_status: "ACTIVE" }).limit(20);
    const coupon = await CouponModel.find({ status: "ACTIVE" }).limit(10).populate('store', 'name store_img').populate('category', 'name');
    const main_banner = await CampaignModel.find({
      product_status: "ACTIVE",
      main_banner: { $elemMatch: { is_active: true } },
    }).limit(6);
    const long_poster = await CampaignModel.find({
      product_status: "ACTIVE",
      long_poster: { $elemMatch: { is_active: true } },
    }).limit(4);
    const premium_product = await CampaignModel.find({
      product_status: "ACTIVE",
      premium_product: { $elemMatch: { is_active: true } },
    });
    const flash_sale = await CampaignModel.find({
      product_status: "ACTIVE",
      flash_sale: {
        $elemMatch: {
          is_active: true,
          end_time: { $gte: currentDate.toISOString() }, 
        },
      },
    });
    const new_product = await CampaignModel.find({
      product_status: "ACTIVE",
      product_tags: "new",
    }).limit(10);
    const hot_product = await CampaignModel.find({
      product_status: "ACTIVE",
      product_tags: "hot",
    }).limit(10);
    const best_product = await CampaignModel.find({
      product_status: "ACTIVE",
      product_tags: "best",
    }).limit(10);
    const offer_deal = await CampaignModel.find({
      product_status: "ACTIVE",
      product_tags: { $in: ["new", "hot", "best"] }, // Ensures at least one tag exists
    }).limit(20);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Home data fetched successfully.",
        data: {
          flash_sale,
          premium_product,
          long_poster,
          main_banner,
          coupon,
          category,
          blog,
          store,
          new_product,
          hot_product,
          best_product,
          offer_deal,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching campaigns:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch campaigns.",
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
