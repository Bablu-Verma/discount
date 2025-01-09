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

    // Check if the user is an admin
    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to edit a category.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const requestData = await req.formData();
    const description = requestData.get("description") as string;
    const slug = requestData.get("slug") as string;
    const img = requestData.get("img") as File;
    const font_awesome_class = requestData.get("font_awesome_class") as string;
    const status = requestData.get("status") === "true";

    // Validate required fields
    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const category = await CategoryModel.findOne({slug});
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedFields: any = {};

    if (description) updatedFields.description = description;

    if (img) {
      if (img instanceof File) {
        const { success, message, url } = await upload_image(
          img,
          "site_category"
        );

        if (success) {
          console.log("Image uploaded successfully:", url);
          updatedFields.img = url;
        } else {
          console.error("Image upload failed:", message);
        }
      } else {
        console.error("Invalid image value. Expected a File.");
      }
    }

    if (font_awesome_class)
      updatedFields.font_awesome_class = font_awesome_class;
    if (status !== undefined) updatedFields.status = status;

    Object.assign(category, updatedFields);

    await category.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Category updated successfully.",
        data: category,
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
      console.error("Failed to update category:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update category.",
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
