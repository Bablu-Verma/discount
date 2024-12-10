import { user_verify_email } from "@/email/user_verify";
import {
    createExpiryTime,
    createHashPassword,
    generateJwtToken,
    generateOTP,
  } from "@/helpers/server/server_function";
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
     
    const findUser = await UserModel.findOne({email: user?.email});

    let Payload = {
        email:findUser.email,
      };

      const userData = findUser.toObject();

      delete userData.password;
      delete userData.accept_terms_conditions_privacy_policy;
      delete userData.email_verified;
      delete userData.phone_verified;
      delete userData.verify_code;
      delete userData.__v

      const JwtToken = await generateJwtToken(Payload, "30m");
      user_verify_email(findUser.verify_code, findUser.email)
  
      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "otp re-send sucessfull",
          token:JwtToken,
          user :userData
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
          message: "Failed to resend otp",
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
  