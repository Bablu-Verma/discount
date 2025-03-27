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

    const { upi_id, amount  } = await req.json();

    if (!upi_id ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "UPI ID are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const upi_document = await UserUPIModel.findOne({ user_id: user?._id, status:'ACTIVE', upi_id });


    if(!upi_document){
      return new NextResponse(
        JSON.stringify({ success: false, message: "UPI id not found." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if(!amount){
      return new NextResponse(
        JSON.stringify({ success: false, message: "Amount is require." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if(amount < 100){
      return new NextResponse(
        JSON.stringify({ success: false, message: "Min withdrawal amount is 100 Rupee." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    

    // Create a new withdrawal request
    const withdrawalRequest = new WithdrawalRequestModel({
      user_id: user?._id,
      amount:amount,
      upi_id,
      status: "PENDING",
      requested_at: new Date(),
      processed_at: null,
    });

    


    await withdrawalRequest.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request submitted successfully.",
        data: { status: "PENDING", amount:amount },
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
