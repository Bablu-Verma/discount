import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { product_slug, product_status } = await req.json(); 

    if (!product_slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Filter condition
    let filters: any = { product_slug };

    if (product_status && product_status !== "ALL") {
      filters.product_status = product_status;
    }

    const product = await CampaignModel.findOne(filters);

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product details retrieved successfully.",
        data: product,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve product details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve product details.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
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
}
