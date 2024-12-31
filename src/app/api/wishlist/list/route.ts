import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";

import { authenticateUser } from "@/lib/authenticate";
import { loginpayload } from "@/common_type";
import CampaignModel from "@/model/CampaignModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, user, message } = await authenticateUser(req);

    if (!authenticated || !user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "Authentication failed.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user_: loginpayload = user;
    const user_id = user_.user_id;


    const watchlist = await WishlistModel.findOne({ user_id });

    if (!watchlist || !watchlist.campaigns || watchlist.campaigns.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No products found in the watchlist.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const products = await CampaignModel.find({ _id: { $in: watchlist.campaigns } });

    if (!products || products.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No product details found for the given watchlist.",
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
        message: "Watchlist retrieved successfully.",
        data: products,
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
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve watchlist.",
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
