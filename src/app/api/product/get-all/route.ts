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
      limit = 20,
      filterData,
      search = "",
    } = requestData;

    console.log(filterData);

    // ✅ Construct Filter Conditions
    const filterConditions: Record<string, any> = {};

    // 🔹 Search by title, user_email, brand, category
    if (search) {
      filterConditions.$or = [
        { title: { $regex: search, $options: "i" } },
        { user_email: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 🔹 Filter by campaign_id
    if (filterData?.campaign_id) {
      filterConditions.campaign_id = filterData.campaign_id;
    }

    // 🔹 Active status filter (ACTIVE | ALL | DE_ACTIVE)
    if (filterData?.active && filterData.active !== "ALL") {
      filterConditions.active = filterData.active === "ACTIVE";
    }

    // 🔹 Deleted campaign filter (DELETE | ALL | ACTIVE)
    if (filterData?.deleted_campaign && filterData.deleted_campaign !== "ALL") {
      filterConditions.deleted_campaign = filterData.deleted_campaign === "DELETE";
    }

    // 🔹 Boolean filters (banner, hot, featured, new)
    if (filterData?.banner === true) filterConditions.banner = true;
    if (filterData?.hot === true) filterConditions.hot = true;
    if (filterData?.featured === true) filterConditions.featured = true;
    if (filterData?.new === true) filterConditions.new = true;

    // 🔹 Category filter
    if (filterData?.categories?.length > 0) {
      filterConditions.category = { $in: filterData.categories };
    }

    // 🔹 Date Filter (Created within X days)
    if (filterData?.day) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - filterData.day);
      filterConditions.createdAt = { $gte: daysAgo };
    }

    // 🔹 Price Range Filter
    if (filterData?.amount?.length === 2) {
      const [minPrice, maxPrice] = filterData.amount;
      filterConditions.price = { $gte: minPrice, $lte: maxPrice };
    }

    console.log("Final Filter Conditions:", filterConditions);

    const sortOrder: TSortOrder = {};

    if (filterData?.price === "low_high") {
      sortOrder.price = 1;
    } else if (filterData?.price === "high_low") {
      sortOrder.price = -1;
    } else {
      sortOrder.createdAt = -1; // Default sorting by latest created campaigns
    }
    console.log("Sort order:", sortOrder);

    // ✅ Pagination Setup
    const skip = (page - 1) * limit;

    // ✅ Fetch Campaigns
    const campaigns = await CampaignModel.find(filterConditions)
      .skip(skip)
      .limit(limit)
      .sort(sortOrder);

    console.log("Retrieved campaigns:", campaigns);

    // ✅ Get Total Count
    const totalCount = await CampaignModel.countDocuments(filterConditions);

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
