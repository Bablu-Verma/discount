import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { v4 as uuidv4 } from "uuid"; // Generate unique transaction ID
import RecordModel from "@/model/OrderModel";
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

    const { upi_id, transaction_id } = await req.json();

    if (!upi_id ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "UPI ID are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!transaction_id ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "transaction_id are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }


    const order = await RecordModel.findOne({transaction_id});
    const upi_document = await UserUPIModel.findOne({ user_id: user?._id, status:'ACTIVE', upi_id });


    if(!order){
      return new NextResponse(
        JSON.stringify({ success: false, message: "transaction_id not found." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if(!upi_document){
      return new NextResponse(
        JSON.stringify({ success: false, message: "UPI id not found." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    

    // Create a new withdrawal request
    const withdrawalRequest = new WithdrawalRequestModel({
      user_id: user?._id,
      transaction_id,
      upi_id,
      amount:order.calculated_cashback,
      status: "PENDING",
      requested_at: new Date(),
      processed_at: null,
    });

    await withdrawalRequest.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request submitted successfully.",
        data: { transaction_id, status: "PENDING" },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error submitting withdrawal request:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Failed to process withdrawal request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
