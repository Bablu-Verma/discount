import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/CartModel";
import { authenticateUser } from "@/lib/authenticate"; 
import { ICartItem } from "@/model/CartModel";

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

    // Check if the user's cart exists
    let userCart = await CartModel.findOne({ user_id });

    if (userCart) {
      // Check if the campaign is already in the cart
      const isCampaignInCart = userCart.items.some(
        (item: ICartItem) => item.campaign_id.toString() === campaign_id
      );

      if (isCampaignInCart) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "This campaign is already in your cart.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Add the campaign to the cart
      userCart.items.push({ campaign_id });
      await userCart.save();

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Campaign added to cart.",
          data: userCart,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Create a new cart for the user
      const newCart = new CartModel({
        user_id,
        items: [{ campaign_id }],
      });

      await newCart.save();

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "New cart created, and campaign added.",
          data: newCart,
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding to cart:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add campaign to cart.",
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
