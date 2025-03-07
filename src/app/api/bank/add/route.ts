import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import UserUPIModel from "@/model/UserUPIModel";

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
        JSON.stringify({ success: false, message: "User already has a registered UPI." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  
    const newUserBank = new UserUPIModel({
      user_id,
      user_email,
      upi_link_bank_name,
      upi_holder_name_aspr_upi,
      upi_id,
      status: "INACTIVE", 
      otp: null,
    });

    await newUserBank.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "UPI details added successfully. Verify Now", data: newUserBank }),
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
