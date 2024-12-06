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

    // Step 2: Extract data from the request body
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

    
    const existingWishlist = await WishlistModel.findOne({ user_id: user_id });

    if (existingWishlist) {
   
      const campaignIndex = existingWishlist.campaigns.indexOf(campaignId);

      if (campaignIndex !== -1) {
       
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
      } else {
        
        existingWishlist.campaigns.push(campaignId);
        await existingWishlist.save();
        return new NextResponse(
          JSON.stringify({
            success: true,
            message: "Campaign added to your wishlist.",
            data: existingWishlist,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
     
      const newWishlist = new WishlistModel({
        user_id: user_id,
        campaigns: [campaignId],
      });

      await newWishlist.save();
      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "New wishlist created and campaign added.",
          data: newWishlist,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding/removing campaign from wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add/remove campaign from wishlist.",
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
