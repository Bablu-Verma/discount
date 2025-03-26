import {
  createExpiryTime,
  createHashPassword,
  generateJwtToken,
  generateOTP,
} from "@/helpers/server/server_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";

import dbConnect from "@/lib/dbConnect";
import UserUPIModel from "@/model/UserUPIModel"; // Corrected model import

import { NextResponse } from "next/server";

// Verify valid user
export async function POST(request: Request) {
  await dbConnect();

  const { authenticated,usertype, user, message } =
    await authenticateAndValidateUser(request);

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


  if (usertype !== "admin") {
    return NextResponse.json(
      { success: false, message: "Access denied: Only admin can delete users" },
      { status: 403 }
    );
  }

  try {
    const requestData = await request.json();
    const {
      user_email,
      upi_id,
      upi_holder_name_aspr_upi,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 10,
    } = requestData;

    const query: any = {};

    if (user_email) query.user_email = { $regex: user_email, $options: "i" };
    
    if (upi_id) query.upi_id = upi_id;
    
    if (upi_holder_name_aspr_upi)
      query.upi_holder_name_aspr_upi = { $regex: upi_holder_name_aspr_upi, $options: "i" };
    
    if (status) query.status = status;

  
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    
    const skip = (page - 1) * limit;

    // Fetch UPI document with filters and pagination
    const upi_documents = await UserUPIModel.find(query).populate('user_id', 'name profile')
      .skip(skip)
      .limit(limit);

    if (!upi_documents.length) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "No UPI details found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "UPI details fetched successfully", data: upi_documents }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fatching upi:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fatch upi",
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
