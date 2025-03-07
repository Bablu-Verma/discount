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

  const { authenticated, user, message } =
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

  try {
    const { otp } = await request.json();

    if (!otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (String(otp).length !== 4) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter a 4-digit OTP",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch UPI document using the correct model
    const upi_document = await UserUPIModel.findOne({ user_id: user?._id });

    if (!upi_document) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Document not found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if the OTP matches the latest entry in otp_history
    const latest_otp_entry = upi_document.otp_history?.[0]; // Get the latest OTP entry

    if (!latest_otp_entry || otp != latest_otp_entry.otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter a valid OTP",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validate OTP expiry time
    const now_date = new Date();
    const otp_expiry_date = new Date(latest_otp_entry.generated_at);

    if (now_date > otp_expiry_date) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP is only valid for 30 minutes",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // If OTP is valid, update user status to ACTIVE
    upi_document.status = "ACTIVE";
    await upi_document.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "UPI verified successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to verify user",
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
