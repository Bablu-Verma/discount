import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";

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

    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to search users.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { query } = await req.json(); 

    if (!query || typeof query !== "string") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid search query.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   
   
    // Search users by name, email, or phone using the query parameter
    const users = await UserModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: query, $options: "i" } }, // Case-insensitive search for email
        { phone: { $regex: query, $options: "i" } }, // Case-insensitive search for phone
      ],
    });

    if (users.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No users found matching the search criteria.",
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
        message: "Users retrieved successfully.",
        data: users,
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
      console.error("Failed to retrieve users:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve users.",
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
