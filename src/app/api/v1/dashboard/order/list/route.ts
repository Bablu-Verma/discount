import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import OrderModel from "@/model/OrderModel";



export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Authenticate user
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const {
      payment_status ,
      user_id,
      store_id,
      transaction_id,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = await req.json();

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));

    const query: any = {};


    
    if (payment_status && payment_status !== "ALL") {
      query.payment_status = payment_status;
    }
    if (store_id) {
      query.store_id = store_id;
    }
    
    if (user_id) {
      query.user_id = user_id;
    }
    
    if (transaction_id) {
      query.transaction_id = transaction_id;
    }
    
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
    
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    // ✅ Fetch orders with pagination
    const orders = await OrderModel.find(query)
    .populate({
      path: "user_id",
      select: "name email",
    })
    .populate({
      path: "user_id",
      select: "name email",
    })
    .lean()
      .sort({ createdAt: -1 }) 
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // ✅ Count total matching records
    const totalOrders = await OrderModel.countDocuments(query);

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
