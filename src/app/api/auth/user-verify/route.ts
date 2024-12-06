import {
  createExpiryTime,
  createHashPassword,
  generateJwtToken,
  generateOTP,
} from "@/helpers/smallFunction";
import { authenticateUser } from "@/lib/authenticate";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

import { NextResponse } from "next/server";

// varify valid user

export async function POST(request: Request) {
  await dbConnect();

  const { authenticated, user, message } = await authenticateUser(request);

  if (!authenticated) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message,
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

    if (!(String(otp).length == 4)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter 4 digit OTP",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   const findUser = await UserModel.findOne({email: user?.email});

   console.log(findUser)

   if(otp != findUser.verify_code){
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Enter Valid OTP",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
   }

   findUser.email_verified = true;

  const update_user =  await findUser.save();


  const userData = update_user.toObject();

  delete userData.password;
  delete userData.accept_terms_conditions_privacy_policy;
  delete userData.email_verified;
  delete userData.phone_verified;
  delete userData.verify_code;
  delete userData.__v


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User Verify successfully, Login Now", 
        user: userData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verify user", error);
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
