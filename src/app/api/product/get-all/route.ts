import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

type TSortOrder = Record<string, 1 | -1>;

export async function POST(req: Request) {
  await dbConnect();

  try {

    const requestData = await req.json();
 
    console.log(requestData)


    const { 
      page = 1, 
      limit = 10, 
      title, 
      calculation_mode, 
      user_email, 
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


    // console.log( title, 
    //   calculation_mode, 
    //   user_email, 
    //   store, 
    //   category, 
    //   product_tags, 
    //   long_poster, 
    //   main_banner, 
    //   premium_product, 
    //   flash_sale, 
    //   slug_type, 
    //   product_id, 
    //   product_status, 
    //   startDate, 
    //   endDate )

    const filters: any = {};

  
    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }

    if (calculation_mode) {
      filters.calculation_mode = calculation_mode; 
    }

    // Direct Match Filters
    if (user_email) filters.user_email = user_email;
    if (store) filters.store = store;
    if (category) filters.category = category;
    if (slug_type) filters.slug_type = slug_type;
    if (product_id) filters._id = product_id;

    // Product Tags
    if (product_tags?.length) {
      filters.product_tags = { $in: product_tags };
    }

    // Boolean Filters
    if (long_poster === true) filters.long_poster = { $exists: true, $ne: [] };
    if (main_banner === true) filters.main_banner = { $exists: true, $ne: [] };
    if (premium_product === true) filters.premium_product = { $exists: true, $ne: [] };
    if (flash_sale === true) filters.flash_sale = { $exists: true, $ne: [] };

    // Product Status Handling
    if (product_status && product_status !== "ALL") {
      filters.product_status = product_status;
    }

    // Time Range Filter
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch Products with Pagination
    const products = await CampaignModel.find(filters)
      .skip(skip)
      .limit(Number(limit))
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
