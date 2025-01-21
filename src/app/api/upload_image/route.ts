import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole"; // This function checks if the user is an admin
import { upload_image } from "@/helpers/server/upload_image";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
    const { authenticated, user, message } = await authenticateUser(req);

    // If the user is not authenticated, return a 401 response
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

    const requestData = await req.formData();

    let image_ = requestData.get("image");
    let file_name = requestData.get("file_name") as string;

    if (!image_) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Image is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!file_name) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "File name is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    let image_url;
    if (image_ instanceof File) {
      const { success, message, url } = await upload_image(
        image_,
        file_name || "site_image_upload"
      );

      if (success) {
        console.log("Image uploaded successfully:", url);
        image_url = url;
      } else {
        console.error("Image upload failed:", message);
      }
    } else {
      console.error("Invalid image value. Expected a File.");
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "your link create successfully.",
        responce: {
          url: image_url,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to upload image :", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to upload image.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
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
}
