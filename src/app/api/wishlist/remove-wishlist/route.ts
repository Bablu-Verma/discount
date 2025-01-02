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

    // Find the user's wishlist
    const wishlist = await WishlistModel.findOne({ user_id });

    if (!wishlist) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Wishlist not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Clear the campaigns array
    wishlist.campaigns = [];

    // Save the updated wishlist
    await wishlist.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Wishlist cleared successfully.",
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
      console.error("Failed to clear wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to clear wishlist.",
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
