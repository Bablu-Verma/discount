import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

import { upload_image } from "@/helpers/server/upload_image";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
   const { authenticated, user, usertype, message } =
         await authenticateAndValidateUser(req);
   
       if (!authenticated) {
         return new NextResponse(
           JSON.stringify({
             success: false,
             message: message || "User is not authenticated",
           }),
           {
             status: 401,
             headers: {
               "Content-Type": "application/json",
             },
           }
         );
       }

   
    const requestData = await req.formData();

    let name = requestData.get("name");
    let profile = requestData.get("profile");
    let phone = requestData.get("phone");
    let dob = requestData.get("dob");
    let gender = requestData.get("gender");

    const updateFields: any = {};

    if (name) {
      if (typeof name === "string" && name.length <= 2) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Enter a valid name",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        updateFields.name = name;
      }
    }
    if (phone) {
      if (typeof phone === "string" && phone.trim().length == 10) {
        updateFields.phone = phone;
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Enter a valid phone number",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (profile instanceof File) {
      const { success, message, url } = await upload_image(
        profile,
        "user_profile"
      );

      if (success) {
        console.log("Image uploaded successfully:", url);
        updateFields.profile = url;
      } else {
        console.error("Image upload failed:", message);
      }
    } else {
      console.error("Invalid profile value. Expected a File.");
    }

    if (dob) updateFields.dob = dob;
    if (gender) updateFields.gender = gender;

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user?.email },
      updateFields,
      { new: true }
    ).select('-user_status -address -verify_code -password');

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
