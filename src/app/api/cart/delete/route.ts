import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel, { ICartItem } from "@/model/CartModel";
import { authenticateUser } from "@/lib/authenticate"; 


export async function DELETE(req: Request) {
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

    // Parse the request body
    const { campaign_id, user_id } = await req.json();

    if (!campaign_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign ID is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User ID is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user's cart
    const userCart = await CartModel.findOne({ user_id });

    if (!userCart) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Cart not found for this user.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the campaign exists in the cart
    const campaignIndex = userCart.items.findIndex(
      (item:ICartItem) => item.campaign_id.toString() === campaign_id
    );

    if (campaignIndex === -1) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign not found in the cart.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Remove the campaign from the cart
    userCart.items.splice(campaignIndex, 1);
    await userCart.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign removed from the cart.",
        data: userCart,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error removing campaign from cart:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to remove campaign from cart.",
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
