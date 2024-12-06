import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/CartModel";
import { authenticateUser } from "@/lib/authenticate"; // Middleware for authentication

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
    const { authenticated, user, message } = await authenticateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body to get the user_id
    const { user_id } = await req.json();

    if (!user_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User ID is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch the cart for the provided user_id
    const userCart = await CartModel.findOne({ user_id }).populate({
      path: "items.campaign_id", // Populate campaign details
      select: "name description price imageUrl", 
    });

    if (!userCart) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No cart found for this user.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Cart retrieved successfully.",
        data: userCart,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error retrieving cart:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve cart.",
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
