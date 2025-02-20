import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/OrderModel";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";

export async function POST(req:Request) {
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
    const product = await CampaignModel.findById(product_id);
    if (!product) {
      return new NextResponse(JSON.stringify({ success: false, message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create order with initial status "Redirected"
    const newOrder = new OrderModel({
      user_id: user._id,
      product_id: product._id,
      affiliate_url: product.affiliate_url,
      cashback_amount: product.cashback_amount,
      status: "Redirected",
      history: [{
        status: "Redirected",
        date: new Date(),
        details: "User clicked on Shop Now",
      }],
    });

    await newOrder.save();

    return new NextResponse(JSON.stringify({ success: true, message: "Order created", data: newOrder }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
        console.error("Failed to edit campaign:", error.message);
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Failed to edit campaign.",
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
