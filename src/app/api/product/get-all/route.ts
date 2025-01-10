import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

type TSortOrder = Record<number, 1 | -1>;

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();

    const {
      page = 1,
      limit = 20,
      filterData,
    } = requestData;

    console.log(filterData);

    const filterConditions: Record<string, any> = {};
    const filterConditions1: Record<string, any> = {};

    if (filterData?.categories?.length > 0) {
      filterConditions1.category = { $in: filterData.categories };
    }

    if (filterData?.trends?.length > 0) {
      filterData.trends.forEach((trend: string) => {
        if (trend === "hot") filterConditions1.hot = true;  
        if (trend === "new") filterConditions1.new = true;
        if (trend === "featured") filterConditions1.featured = true;
      });
    }

    if (filterData?.day) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - filterData.day);
      filterConditions1.createdAt = { $gte: daysAgo };
    }

    if (filterData?.amount?.length === 2) {
      const [minPrice, maxPrice] = filterData.amount;
      filterConditions.price = { $gte: minPrice, $lte: maxPrice };
    }

    console.log("Filter conditions1:", filterConditions1);

    const sortOrder: TSortOrder = (() => {
      if (filterData?.price === "low_high") return { price: 1 };
      if (filterData?.price === "high_low") return { price: -1 };
      return { createdAt: -1 }; 
    })();

    console.log("Sort order:", sortOrder);

    // Pagination setup
    const skip = (page - 1) * limit;

    // Query campaigns
    const campaigns = await CampaignModel.find(filterConditions1)
      .skip(skip)
      .limit(limit)
      .sort(sortOrder);


    console.log("Retrieved campaigns:", campaigns);

    // Total count
    const totalCount = await CampaignModel.countDocuments(filterConditions1);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaigns retrieved successfully",
        data: campaigns,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
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
