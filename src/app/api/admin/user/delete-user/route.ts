import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";

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

    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to delete a user.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const requestData = await req.json();
    const { email } = requestData;

    if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required to delete a user.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find the user and update deleted_user field to true
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { deleted_user: true },
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User not found or already marked as deleted.",
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
        message: "User marked as deleted successfully.",
        data: updatedUser, // You can return the updated user details if needed
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
      console.error("Failed to delete user:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete user.",
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
