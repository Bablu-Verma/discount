import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";
import OrderModel from "@/model/CashbackOrderModel";
import { v4 as uuidv4 } from 'uuid';



export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);
    if (!authenticated || !user) {
      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    const { product_id } = await req.json();
    if (!product_id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const product = await CampaignModel.findOne({
      _id: product_id,
      product_status: "ACTIVE",
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const calculated_cashback =
      product.calculation_mode === "PERCENTAGE"
        ? (product.offer_price * product.cashback_) / 100
        : product.cashback_;

    const transaction_id = uuidv4();

    const order = new OrderModel({
      user_id: user._id,
      store_id: product.store_id, // store ref (if exists in CampaignModel)
      product_id: product._id,
      product_url: product.redirect_url,
      price: product.actual_price,
      offer_price: product.offer_price,
      cashback_snapshot: product.cashback_,
      calculation_mode: product.calculation_mode,
      calculated_cashback,
      transaction_id,
      source_type: "click", // default if created from redirect
      order_status: "Redirected",
      payment_status: null,
      order_history: [{
        status: "Redirected",
        date: new Date(),
        details: "User redirected to product via cashback link",
      }],
      payment_history: [],
    });

    const saved = await order.save();

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        url: `${product.redirect_url}/?utm_source=${transaction_id}`,
        transaction_id,
      },
    }, { status: 201 });

  }catch (error) {
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
