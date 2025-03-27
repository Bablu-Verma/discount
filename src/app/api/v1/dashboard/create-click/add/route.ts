import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";
import RecordModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);
    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract data from request
    const {
      product_id,
      user_id,
      actual_price,
      offer_price,
      calculated_cashback,
      calculation_mode,
      cashback_,
      createdAt,
      updatedAt,
      custom_date,
    } = await req.json();

    
    if (!product_id || !user_id || !actual_price || !offer_price || !calculated_cashback || !calculation_mode || !cashback_) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  
    if (typeof product_id !== "string") {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid product_id format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof user_id !== "string") {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid user_id format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof actual_price !== "number" || actual_price <= 0) {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid actual_price" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof offer_price !== "number" || offer_price <= 0) {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid offer_price" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof calculated_cashback !== "number" || calculated_cashback < 0) {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid calculated_cashback" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof cashback_ !== "number" || cashback_ < 0) {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid cashback_" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!["PERCENTAGE", "FIX"].includes(calculation_mode)) {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid calculation_mode" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate `custom_date` format (if provided)
    let parsedCustomDate: Date | null = null;
    if (custom_date) {
      parsedCustomDate = new Date(custom_date);
      if (isNaN(parsedCustomDate.getTime())) {
        return new NextResponse(JSON.stringify({ success: false, message: "Invalid custom_date format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Validate product existence
    const product = await CampaignModel.findOne({ product_id });
    if (!product) {
      return new NextResponse(JSON.stringify({ success: false, message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create new order
    const newOrder = new RecordModel({
      user_id: user_id,
      product_id: product.product_id,
      product_url: product.redirect_url,
      price: actual_price,
      offer_price: offer_price,
      calculated_cashback: calculated_cashback,
      calculation_mode: calculation_mode,
      cashback_: cashback_,
      order_status: "Redirected",
      payment_status: null,
      order_history: [],
      payment_history: [],
      custom_date: parsedCustomDate, // Store validated custom_date
      createdAt,
      updatedAt,
    });

    const save_order = await newOrder.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Order created successfully",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create order:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to create order.",
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
