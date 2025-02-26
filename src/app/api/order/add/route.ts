import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";
import RecordModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, user, message } = await authenticateAndValidateUser(req);
    if (!authenticated || !user) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }



    // Parse request data
    const { product_id } = await req.json();
    if (!product_id) {
      return new NextResponse(JSON.stringify({ success: false, message: "Product ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch product details
    const product = await CampaignModel.findOne({campaign_id:product_id}) 
    if (!product) {
      return new NextResponse(JSON.stringify({ success: false, message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }


    // console.log("user=>",user)
    // console.log("product=>",product)

    // Create order with initial status "Redirected"
    const newOrder = new RecordModel({
      user_id: user._id,
      product_id: product.campaign_id,
      product_url: product.client_url,
      cashback_amount: product.offer_price,
      order_status: "Redirected",
      payment_status: null,
      order_history: [],
      payment_history: [],
    });

  const save_order =  await newOrder.save();

  // console.log("save_order",save_order)
  // ${product.client_url}/?utm_source=${save_order.transaction_id}
  return  new NextResponse(
    JSON.stringify({
      success: true,
      message: "Order created successfully",
      order: {
        url: `${product.client_url}/?utm_source=${save_order.transaction_id}`,
      },
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
