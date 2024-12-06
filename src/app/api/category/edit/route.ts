import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";  // This function checks if the user is an admin

export async function PUT(req: Request) {
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

    // Extract category data and category ID from the request body
    const requestData = await req.json();
    const { categoryId, name, description, slug, img, font_awesome_class, status } = requestData;

    // Validate required fields
    if (!categoryId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if the category exists
    const category = await CategoryModel.findById(categoryId);
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

    // Check if category with the same name or slug already exists (but not the current category)
    const existingCategory = await CategoryModel.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: categoryId }, 
    });

    if (existingCategory) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "A category with this name or slug already exists.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Update the category fields dynamically based on provided data
    const updatedFields: any = {};

    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (slug) updatedFields.slug = slug;
    if (img) updatedFields.img = img;
    if (font_awesome_class) updatedFields.font_awesome_class = font_awesome_class;
    if (status !== undefined) updatedFields.status = status;

    // Update the category with the provided data
    Object.assign(category, updatedFields);

    // Save the updated category to the database
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
