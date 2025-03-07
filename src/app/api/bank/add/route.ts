import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import UserUPIModel from "@/model/UserUPIModel";
import {
  generateOTP,
} from "@/helpers/server/server_function";
import { upi_verify_email } from "@/email/user_upi_verify";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user_id = user?._id;
    const user_email = user?.email;

    if (!user_email) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User email is missing." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { upi_link_bank_name, upi_holder_name_aspr_upi, upi_id } = await req.json();

    // Validation: Ensure required fields exist
    if (!upi_link_bank_name || !upi_holder_name_aspr_upi || !upi_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user already has a bank entry
    const existingEntry = await UserUPIModel.findOne({ user_id });

    if (existingEntry) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "already has a registered UPI." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate OTP
    const create_otp = generateOTP();
    const otp_generated_at = new Date();
     otp_generated_at.setMinutes(otp_generated_at.getMinutes() + 30);

     
    // Create new UPI entry
    const newUserBank = new UserUPIModel({
      user_id,
      user_email,
      upi_link_bank_name,
      upi_holder_name_aspr_upi,
      upi_id,
      status: "INACTIVE",
      otp_history: [{ otp: create_otp, generated_at: otp_generated_at }],
    });

    await newUserBank.save();

    // Send verification email (async handling)
    await upi_verify_email(create_otp, user_email);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "UPI details added successfully. Please verify your UPI.",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error adding UPI details:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Failed to add UPI details.", error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
