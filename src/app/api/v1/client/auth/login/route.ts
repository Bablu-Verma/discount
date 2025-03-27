import { generateJwtToken, verifyHashPassword } from "@/helpers/server/server_function";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
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

    const check_match = await verifyHashPassword(password,findUser.password)

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

    if(findUser.user_status == 'REMOVED'){
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "you are not va;i user, contact to support",
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

  


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        user:userData,
        token:JwtToken
      }),
      { 
        status: 200 ,
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
