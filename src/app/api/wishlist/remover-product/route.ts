import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";
import { authenticateUser } from "@/lib/authenticate";
import { loginpayload } from "@/common_type";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
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

    let user_: loginpayload = user;
    const user_id = user_.user_id;

    const { campaign_id } = await req.json();

    if (!campaign_id) {
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

    // Find the user's wishlist
    const wishlist = await WishlistModel.findOne({ user_id });

    if (!wishlist || !wishlist.campaigns.includes(campaign_id)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign not found in the wishlist.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    wishlist.campaigns = wishlist.campaigns.filter((id:number) => id !== campaign_id);

   
    await wishlist.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign removed from wishlist successfully.",
        data: wishlist,
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
      console.error("Failed to remove from wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to remove from wishlist.",
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
