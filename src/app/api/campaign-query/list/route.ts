import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignQueryModel from "@/model/CampaignQueryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Extract filter and pagination parameters
    const requestData = await req.json();
    const {
      user_id,
      subject,
      campaign_id,
      whatsapp_number,
      startDate,
      endDate,
      solvequery, // New field added for filtering
      page = 1,
      limit = 10,
    } = requestData;

    const query: any = {};

    if (user_id) query.user_id = user_id;
    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (campaign_id) query.campaign_id = campaign_id;
    if (whatsapp_number) query.whatsapp_number = whatsapp_number;

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // ✅ Solve Query Filter
    if (solvequery === "DONE") {
      query.solvequery = true; // Fetch only solved queries
    } else if (solvequery === "NOT_DONE") {
      query.solvequery = false; // Fetch only unsolved queries
    }
    // If "ALL", do nothing (fetch both solved and unsolved queries)

    // Pagination calculations
    const skip = (page - 1) * limit;

    const campaignQueries = await CampaignQueryModel.find(query)
      .populate("campaign_id", "name slug image active status")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDocuments = await CampaignQueryModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign queries fetched successfully.",
        data: campaignQueries,
        pagination: {
          currentPage: page,
          totalPages,
          totalDocuments,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching campaign queries:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch campaign queries.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
