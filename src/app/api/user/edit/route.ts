import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateUser } from "@/lib/authenticate";

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
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Extract updated data from request body
    const requestData = await req.json();
    const { name, profile, phone, subscribe_email, address, dob, gender } = requestData;

    // Validate required fields
    if (!name || !address || !dob || !gender) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Name, address, date of birth, and gender are required to update your profile.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Build the update object with only the fields that have been provided
    const updateFields: any = {};

    if (name) updateFields.name = name;
    if (profile) updateFields.profile = profile;
    if (phone) updateFields.phone = phone;
    if (subscribe_email) updateFields.subscribe_email = subscribe_email;
    if (address) updateFields.address = address;
    if (dob) updateFields.dob = dob;
    if (gender) updateFields.gender = gender;

   
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user?.email },  
      updateFields,
      { new: true } 
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update profile.",
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
        message: "Profile updated successfully.",
        data: updatedUser, 
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
      console.error("Failed to update profile:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update profile.",
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
