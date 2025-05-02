import { generateJwtToken, verifyHashPassword } from "@/helpers/server/server_function";
import dbConnect from "@/lib/dbConnect";
import ConformAmountModel from "@/model/ConformAmountModel";
import UserModel from "@/model/UserModel";
import UserUPIModel from "@/model/UserUPIModel";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextRequest, NextResponse } from "next/server";

interface IRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect();

  try {
    const body: IRequestBody = await req.json();
    const { email, password } = body;


    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const findUser = await UserModel.findOne({
      email,
    });

    if (!findUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email not found, please register now",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (findUser.email_verified == false) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Your Email not Verify, please register again",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const check_match = await verifyHashPassword(password, findUser.password)

    if (!check_match) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Credential not match, Check again",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (findUser.user_status == 'REMOVED') {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "you are not valid user, contact to support",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    let Payload = {
      email,
      role: findUser.role,
      _id: findUser._id,
    };

    const JwtToken = await generateJwtToken(Payload, "15d");



    const userData = findUser.toObject();


    delete userData.password;
    delete userData.accept_terms_conditions_privacy_policy;
    delete userData.email_verified;
    delete userData.phone_verified;
    delete userData.verify_code;
    delete userData.verify_code_expiry;
    delete userData.user_status;
    delete userData.subscribe_email;
    delete userData.__v


    const conformAmount = await ConformAmountModel.findOne({ user_id: findUser._id }).select('-createdAt -updatedAt');
    const withdrawalRequests = await WithdrawalRequestModel.find({ user_id: findUser._id }).select('-upi_id -requested_at -processed_at -createdAt -updatedAt');

   
    const conform_cb = conformAmount?.amount || 0;
    const total_hold = conformAmount?.hold_amount || 0;

    let withdrawal_pending = 0;
    let total_withdrawal = 0;


    withdrawalRequests.forEach((request) => {
      if (request.status === "PENDING") {
        withdrawal_pending += request.amount;
      }
      if (request.status === "APPROVED") {
        total_withdrawal += request.amount;
      }
    });

    const total_cb = conform_cb + withdrawal_pending + total_withdrawal;


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        summary: {
          conform_cb,
          total_cb: total_cb,
          total_hold: total_hold,
          withdrawal_pending: withdrawal_pending,
          total_withdrawal: total_withdrawal
        },
        user: userData,
        token: JwtToken
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during authentication:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
