import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import RecordModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Authenticate user
    const { authenticated, user, message } = await authenticateAndValidateUser(req);
    if (!authenticated || !user) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Extract filters from request body
    const {
      order_status ,
      payment_status ,
      user_id,
      product_id,
      transaction_id,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = await req.json();

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));

    const query: any = {};

    // ✅ Only add fields if they are non-empty
    if (order_status && order_status !== "ALL") {
      query.order_status = order_status;
    }
    
    if (payment_status && payment_status !== "ALL") {
      query.payment_status = payment_status;
    }
    
    if (user_id) {
      query.user_id = user_id;
    }
    
    if (product_id) {
      query.product_id = product_id;
    }
    
    if (transaction_id) {
      query.transaction_id = transaction_id;
    }
    
    // ✅ Filter by date range only if both startDate & endDate are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
    
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    // ✅ Fetch orders with pagination
    const orders = await RecordModel.find(query)
      .populate("product_id")
      .sort({ createdAt: -1 }) // Latest orders first
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // ✅ Count total matching records
    const totalOrders = await RecordModel.countDocuments(query);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Orders fetched successfully.",
        data: orders,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalOrders / pageSize),
          totalOrders,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch orders.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
