import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";  // This function checks if the user is an admin
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

    // Check if the user is an admin
    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to add a category.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Extract category data from the request body
    const requestData = await req.formData();

    let name = requestData.get("name");
    let description = requestData.get("description");
    let slug = requestData.get("slug");
    let img = requestData.get("img");
    let font_awesome_class = requestData.get("font_awesome_class");
    let status = requestData.get("status");

    // Validate required fields
    if (!name || !description || !slug || !img || !font_awesome_class) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Name, description, slug, image, and Font Awesome class are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if category with the same name or slug already exists
    const existingCategory = await CategoryModel.findOne({
      $or: [{ name }, { slug }],
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

    let image_url;
      if (img instanceof File) {
          const { success, message, url } = await upload_image(
            img,
            "site_category"
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

    // Create a new category
    const newCategory = new CategoryModel({
      name,
      description,
      slug,
      img:image_url,
      font_awesome_class,
      status,
    });

    // Save the category to the database
    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Category added successfully.",
        data: newCategory,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add category:", error.message);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Failed to add category.",
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
