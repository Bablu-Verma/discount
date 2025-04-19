import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PinbackResponseModel from "@/model/PinbackResponseModel";
import OrderModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { raw_data } = await req.json();

    if (!raw_data) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "raw_data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { click_id, transaction_id, status, amount, commission, source } = {
      ...raw_data,
      amount: Number(raw_data.amount),
      commission: Number(raw_data.commission),
    };

    if (!click_id || isNaN(amount) || isNaN(commission)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Required fields missing: click_id, amount, commission",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const pinbackResponse = new PinbackResponseModel({
      click_id,
      transaction_id,
      status,
      amount,
      commission,
      source,
      raw_data,
    });

    try {
      await pinbackResponse.save();
    } catch (error: any) {
      // Duplicate entry handle
      if (error.code === 11000) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Click id repated",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } else {
        throw error;
      }
    }

    const findOrder = await OrderModel.findOne({
      transaction_id: click_id,
    }).select("-redirect_url");

    if (findOrder) {

      console.log("findOrder.upto_amount:", findOrder.upto_amount);
      console.log("Order amount:", amount);

      let applicableAmount = 0;

      if (findOrder.upto_amount) {
        if (findOrder.upto_amount >= amount ) {
          applicableAmount = amount;
        } else {
          applicableAmount = findOrder.upto_amount;
        }
      } else {
        applicableAmount = amount;
      }

      console.log("Applicable Amount for Cashback:", applicableAmount);

      let finalCashback = 0;

      if (findOrder.cashback_type === "PERCENTAGE") {
        finalCashback = (applicableAmount * findOrder.cashback_rate) / 100;
      } else if (findOrder.cashback_type === "FLAT_AMOUNT") {
        finalCashback = findOrder.cashback_rate;
      }


      findOrder.order_value = amount;
      findOrder.cashback = finalCashback;

      if (status && status.toLowerCase() === "pending") {
        findOrder.payment_status = "Pending";
        findOrder.payment_history.push({
          status: "Pending",
          date: new Date(),
          details: "Payment updated to status Pending",
        });
      }

      findOrder.order_status = "Order";
      findOrder.order_history.push({
        status: "Order",
        date: new Date(),
        details: "Order updated to status Product Order",
      });
      await findOrder.save();
    } else {
      console.log("No matching order found for click_id:", click_id);
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Pinback response saved successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving pinback details:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to save pinback details",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// http://localhost:3000/pinback?click_id=d1c3ff0f-b794-4db3-96ef-01de223fe56e-1vvVQHgJ&transaction_id=txn789&status=pending&amount=5000&commission=4000&source=vcommission
