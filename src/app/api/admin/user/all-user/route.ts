import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
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
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const { email, phone, role, gender, deleted_user, startDate, endDate, page = 1, limit = 10 } = requestData;

    const query: any = {};

    if (deleted_user === "ALL") {
    } else if (deleted_user === "ACTIVE") {
      query.deleted_user = false;
    } else if (deleted_user === "DELETE") {
      query.deleted_user = true;
    } else {
      query.deleted_user = false; 
    }
    
    if (email) {
      query.email = email;
    }

    if (phone) {
      query.phone = phone;
    }

    if (role) {
      query.role = role;
    }

    if (gender) {
      query.gender = gender;
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    
    const skip = (page - 1) * limit;
    const users = await UserModel.find(query).skip(skip).limit(limit);
    const totalUsers = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Users retrieved successfully.",
        data: users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve users:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to retrieve users.", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({ success: false, message: "An unexpected error occurred." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
