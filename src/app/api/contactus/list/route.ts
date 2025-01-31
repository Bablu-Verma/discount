import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactUsModel from "@/model/ContactUsModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";



export async function POST(req: Request) {
  await dbConnect();

  try {
     const { authenticated, user, usertype, message } =
         await authenticateAndValidateUser(req);
   
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
   
       if (usertype !== "admin") {
         return new NextResponse(
           JSON.stringify({
             success: false,
             message: "Access denied: You do not have the required role",
           }),
           {
             status: 403,
             headers: {
               "Content-Type": "application/json",
             },
           }
         );
       }

    // Fetch all Contact Us records
    const contactUsRecords = await ContactUsModel.find()

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Contact Us records retrieved successfully.",
        data: contactUsRecords,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching Contact Us records:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch Contact Us records.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
