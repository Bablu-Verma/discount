import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";
import { authenticateUser } from "@/lib/authenticate"; // Authentication middleware

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Step 1: Authenticate the user
    const { authenticated, user, message } = await authenticateUser(req);

    // If the user is not authenticated, return a 401 response
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

    // Step 2: Parse request body
    const requestData = await req.json();
    const { user_id } = requestData;

    // Step 3: Validate `user_id`
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

    // Step 4: Fetch the user's wishlist
    const userWishlist = await WishlistModel.findOne({ user_id }).populate("campaigns");

    if (!userWishlist) {
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

  
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User wishlist retrieved successfully.",
        data: userWishlist,
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
      console.error("Error retrieving user wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve user wishlist.",
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
