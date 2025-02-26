import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { upload_image } from "@/helpers/server/upload_image";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogCategoryModel from "@/model/BlogCategoryModel";

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
          message: '"Access denied: Does not have the required role"',
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const requestData = await req.json();

    const { description, slug, img, status } = requestData;

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

    const category = await BlogCategoryModel.findOne({ slug });
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
      updatedFields.img = img;
    }

    if (status !== undefined) updatedFields.status = status;

    Object.assign(category, updatedFields);

    await category.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "blog Category updated successfully.",
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
          message: "Failed to update blog category.",
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
