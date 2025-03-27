import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

type TSortOrder = Record<string, 1 | -1>;

export async function POST(req: Request) {
  await dbConnect();

  try {

    const requestData = await req.json();


    const { 
      page = 1, 
      limit = 10, 
      title, 
      calculation_mode, 
      user_id, 
      store, 
      category, 
      product_tags, 
      long_poster, 
      main_banner, 
      premium_product, 
      flash_sale, 
      slug_type, 
      product_id, 
      product_status, 
      startDate, 
      endDate 
    } = requestData;



    const filters: any = {};

  
    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }
    if (store) filters.store = store;
    if (category) filters.category = category;
    
    // Product Tags
    if (product_tags?.length) {
      filters.product_tags = { $in: product_tags };
    }

    filters.product_status = 'ACTIVE'


    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch Products with Pagination
    const products = await CampaignModel.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .populate('store', 'name slug store_img')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    // Get Total Count
    const total = await CampaignModel.countDocuments(filters);

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        data: products, 
        pagination: { total, page, limit } 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error retrieving campaigns:", error);
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to retrieve campaigns",
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
