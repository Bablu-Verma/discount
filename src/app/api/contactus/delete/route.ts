import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactUsModel from "@/model/ContactUsModel";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";

export async function POST(req: Request) {
  await dbConnect();

  try {

    const { authenticated, user, message } = await authenticateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    

    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to perform this action.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   
    const { id } = await req.json(); 

    if (!id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Contact Us record ID is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Attempt to find and delete the Contact Us record
    const deletedRecord = await ContactUsModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Contact Us record not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Contact Us record deleted successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting Contact Us record:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete Contact Us record.",
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
