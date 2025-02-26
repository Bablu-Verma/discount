import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";


import { upload_image } from "@/helpers/server/upload_image";
import { generateSlug } from "@/helpers/client/client_function";
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
 
     if (usertype !== 'admin') {
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
    const { name, description, img ,status } = requestData; 

    console.log(requestData)


    // Validate required fields
    if (!name || !description || !img ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Name, description, image, and Font Awesome class are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const slug = generateSlug(name)
 
    const existingCategory = await BlogCategoryModel.findOne({
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



    // Create a new category
    const newCategory = new BlogCategoryModel({
      name,
      description,
      slug,
      img,
      status,
    });

    // Save the category to the database
    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog Category added successfully.",
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
      console.error("Failed to add blog category:", error.message);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Failed to add blog category.",
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
