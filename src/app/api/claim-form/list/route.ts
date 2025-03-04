import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormModel from "@/model/ClaimForm";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const {
      transaction_id,
      start_date,
      end_date,
      partner_site_orderid,
      page = 1,
      limit = 10,
    } = await req.json();

    const filters: any = { user_id: user?._id };

    if (transaction_id) filters.order_id = transaction_id;
    if (partner_site_orderid) filters.partner_site_orderid = partner_site_orderid;

    // Handle date range filter
    if (start_date || end_date) {
      const dateFilter: any = {};
      if (start_date && !isNaN(Date.parse(start_date))) dateFilter.$gte = new Date(start_date);
      if (end_date && !isNaN(Date.parse(end_date))) dateFilter.$lte = new Date(end_date);
      if (Object.keys(dateFilter).length) filters.createdAt = dateFilter;
    }

    // Ensure page and limit are numbers
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch claim forms from the database
    const claimForms = await ClaimFormModel.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Get total count for pagination
    const totalRecords = await ClaimFormModel.countDocuments(filters);

    if (claimForms.length === 0) {
      return NextResponse.json(
        { success: true, message: "No claim forms found.", data: [], pagination: { totalRecords, currentPage: pageNumber, totalPages: 0 } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Claim forms retrieved successfully.",
        data: claimForms,
        pagination: {
          totalRecords,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching claim forms:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
