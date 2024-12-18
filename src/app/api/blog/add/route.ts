import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateUser } from "@/lib/authenticate"; 
import BlogModel from "@/model/BlogModal";
import { isAdmin } from "@/lib/checkUserRole";


const validateField = (field: string, fieldName: string) => {
  if (!field) {
    return {
      success: false,
      message: `${fieldName} is required.`,
    };
  }
  return null;
};

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
          message: "You are not authorized to create blogs.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const { title, short_desc, category, blogType, isPublished, image, readTime } = await req.json();

    const fields = [
      { field: title, name: "title" },
      { field: short_desc, name: "short_desc" },
      { field: category, name: "category" },
      { field: blogType, name: "blogType" },
      { field: isPublished, name: "isPublished" },
      { field: image, name: "image" },
      { field: readTime, name: "readTime" },
    ];

    for (const { field, name } of fields) {
      const validationError = validateField(field, name);
      if (validationError) {
        return new NextResponse(
          JSON.stringify(validationError),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const slug = Array.isArray(title) ? title.join('-').toLowerCase().replace(/\s+/g, '-') : title.toString().toLowerCase().replace(/\s+/g, '-');

    const existingBlog = await BlogModel.findOne({ slug });

    if (existingBlog) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "A blog with this slug already exists.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newBlogQuery = new BlogModel({
      title,
      slug:"hgfhgfhg",
      short_desc,
      category,
      blogType,
      isPublished,
      image,
      readTime,
    });

    await newBlogQuery.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Your blog was added successfully.",
        data: newBlogQuery,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating blog:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add blog.",
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
