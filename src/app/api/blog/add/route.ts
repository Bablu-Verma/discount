import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateUser } from "@/lib/authenticate";
import BlogModel from "@/model/BlogModal";
import { isAdmin } from "@/lib/checkUserRole";
import { generateSlug } from "@/helpers/client/client_function";

const validateField = (field: any, fieldName: string, isOptional = false) => {
  if (!field && !isOptional) {
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

    const {
      title,
      short_desc,
      desc,
      category,
      blogType,
      isPublished,
      image,
      writer_email,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      twitterImage,
      tags,

    } = await req.json();

    const fields = [
      { field: title, name: "Title" },
      { field: short_desc, name: "Short Description" },
      { field: desc, name: "Description" },
      { field: category, name: "Category" },
      { field: blogType, name: "Blog Type" },
      { field: writer_email, name: "Writer Email" },
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

    const slug = generateSlug(title);

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

    const newBlog = new BlogModel({
      title,
      slug,
      short_desc,
      desc,
      category,
      blogType,
      isPublished,
      image,
      writer_email,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      twitterImage,
      tags,
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog created successfully.",
        data: newBlog,
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
