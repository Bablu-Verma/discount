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
          message:message || "Authentication failed.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }




    let user_:loginpayload = user
     const user_id = user_.user_id

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

   
    let wishlist = await WishlistModel.findOne({ user_id });

    if (wishlist) {
     
      if (wishlist.campaigns.includes(campaign_id)) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Campaign is already in the wishlist.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

     
      wishlist.campaigns.push(campaign_id);
    } else {
      
      wishlist = new WishlistModel({
        user_id,
        campaigns: [campaign_id],
      });
    }

  
    await wishlist.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign added to wishlist successfully.",
        data: wishlist,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add to wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add to wishlist.",
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
