import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
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

    // Extract updated address data from request body
    const requestData = await req.json();

    // Dynamically construct the update object
    const addressUpdate: Record<string, any> = {};
    const fields = [
      "house_no",
      "landmark",
      "street",
      "area",
      "city_village",
      "state",
      "pincode",
      "country",
    ];

    fields.forEach((field) => {
      if (requestData[field] !== undefined) {
        addressUpdate[`address.${field}`] = requestData[field];
      }
    });

    if (Object.keys(addressUpdate).length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No address fields provided for update.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user?.email },
      { $set: addressUpdate },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User not found or failed to update address.",
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
        message: "Address updated successfully.",
        data: updatedUser.address, 
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
      console.error("Failed to update address:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update address.",
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
