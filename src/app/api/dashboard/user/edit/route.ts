import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { upload_image } from "@/helpers/server/upload_image";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Admin role required" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.formData();
    let email = requestData.get("email");
    let name = requestData.get("name");
    let profile = requestData.get("profile");
    let phone = requestData.get("phone");
    let dob = requestData.get("dob");
    let gender = requestData.get("gender");

    if (!email || typeof email !== "string") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Email is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updateFields: any = {};

    if (name && typeof name === "string" && name.length > 2) {
      updateFields.name = name;
    }

    if (phone && typeof phone === "string" && phone.trim().length === 10) {
      updateFields.phone = phone;
    }

    if (profile instanceof File) {
      const { success, message, url } = await upload_image(profile, "user_profile");
      if (success) {
        updateFields.profile = url;
      } else {
        console.error("Image upload failed:", message);
      }
    }

    if (dob) updateFields.dob = dob;
    if (gender) updateFields.gender = gender;

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to update user profile." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "User profile updated successfully.", data: updatedUser }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to update user profile:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to update user profile.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}