import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import RecordModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Authenticate user
    const { authenticated, user, message, usertype } = await authenticateAndValidateUser(req);
    if (!authenticated || !user) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (usertype !== "admin") {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

    // ✅ Extract data from request body
    const { record_id, order_status, payment_status } = await req.json();

    if (!record_id) {
      return new NextResponse(JSON.stringify({ success: false, message: "Record ID is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Find the record
    const record = await RecordModel.findById(record_id);
    if (!record) {
      return new NextResponse(JSON.stringify({ success: false, message: "Record not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Update editable fields if provided
    if (order_status) {
      record.order_status = order_status;
    }
    if (payment_status) {
      record.payment_status = payment_status;
    }
  

    // ✅ Save the updated record
    await record.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Order updated successfully.", data: record }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to update order:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to update order.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
