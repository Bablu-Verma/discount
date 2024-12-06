import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";
import { authenticateUser } from "@/lib/authenticate"; // Authentication middleware

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Step 1: Authenticate the user
    const { authenticated, user, message } = await authenticateUser(req);

    
    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   
    const requestData = await req.json();
    const { campaignId, user_id } = requestData;

    if (!campaignId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!user_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Step 3: Check if the user has an existing wishlist
    const existingWishlist = await WishlistModel.findOne({ user_id: user_id });

    if (!existingWishlist) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No wishlist found for this user.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    
    const campaignIndex = existingWishlist.campaigns.indexOf(campaignId);

    if (campaignIndex === -1) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign not found in your wishlist.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    existingWishlist.campaigns.splice(campaignIndex, 1);
    await existingWishlist.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign removed from your wishlist.",
        data: existingWishlist,
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
      console.error("Error removing campaign from wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to remove campaign from wishlist.",
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
