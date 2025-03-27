import { NextResponse } from "next/server";

import { ObjectId } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormModel from "@/model/ClaimForm";
import RecordModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(
      req
    );

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const {
      transaction_id,
      order_id,
      reason,
      supporting_documents,
      partner_site_orderid,
      partner_site_order_status,
    } = await req.json();

    // Validate required fields
    if (
      !transaction_id ||
      !reason || !order_id ||
      !supporting_documents ||
      supporting_documents.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All required fields must be provided, including supporting documents.",
        },
        { status: 400 }
      );
    }


    const existingRecord = await RecordModel.findOne({ transaction_id });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid transaction_id. No matching record found.",
        },
        { status: 404 }
      );
    }

    // Create new claim form
    const newClaim = new ClaimFormModel({
      user_id: user?._id,
      transaction_id: transaction_id,
      reason,
      order_id,
      supporting_documents,
      partner_site_orderid,
      partner_site_order_status,
      status: "PENDING",
    });

    // Save to DB
    await newClaim.save();

    return NextResponse.json(
      {
        success: true,
        message: "Claim submitted successfully.",
        data: newClaim,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting claim:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
