import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";

export async function POST(request: Request) {
  await dbConnect();

  const { authenticated, user, message } = await authenticateAndValidateUser(
    request
  );

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
    const { withdrawal_request_id, otp } = await request.json();

    if (!withdrawal_request_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request ID are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request ID and OTP are required.",
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
          message: "Enter a valid 4-digit OTP.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const withdrawalRequest = await WithdrawalRequestModel.findOne({
      _id: withdrawal_request_id,
      user_id: user._id,
    }).select('+otp');

    if (!withdrawalRequest) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (withdrawalRequest.status !== "WITHDRAWAL_CREATE") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "This withdrawal request is already verified or processed.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const now = new Date();
    const updatedAt = withdrawalRequest.updatedAt;
    const diffInMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);

    if (diffInMinutes > 30) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP expired. Please resend OTP.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (withdrawalRequest.otp !== otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid OTP entered.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    withdrawalRequest.status = "PENDING";
    withdrawalRequest.otp = undefined;
    await withdrawalRequest.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request verified successfully.",
        
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verifying withdrawal request:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to verify withdrawal request.",
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
