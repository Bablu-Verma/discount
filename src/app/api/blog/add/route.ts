import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import BlogModel from "@/model/BlogModal";

import { generateSlug } from "@/helpers/client/client_function";
import { upload_image } from "@/helpers/server/upload_image";
import { validateField } from "@/helpers/server/g_validation";
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
        if (!(usertype === "admin" || usertype === "blog_editor")) {
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
    
    // Parse form data
    const requestData = await req.json();

    const {
      title,
      category,
      short_desc,
      blogType,
      isPublished,
      image,
      metaTitle,
      metaDescription,
      description,
      metaKeywords,
      ogImage,
      twitterImage,
      tags,
    } = requestData;

    const titleValidation = validateField(title, "Title", {
      type: "string",
      minLength: 5,
      maxLength: 100,
    });

    if (titleValidation)
      return new NextResponse(JSON.stringify(titleValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const categoryValidation = validateField(category, "Category", {
      type: "string",
      minLength: 3,
    });
    if (categoryValidation)
      return new NextResponse(JSON.stringify(categoryValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const shortDescValidation = validateField(short_desc, "Short Description", {
      type: "string",
    });
    if (shortDescValidation)
      return new NextResponse(JSON.stringify(shortDescValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const blogTypeValidation = validateField(blogType, "Blog Type", {
      type: "string",
    });
    if (blogTypeValidation)
      return new NextResponse(JSON.stringify(blogTypeValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const imageValidation = validateField(image, "Image", {
      type: "string",
      regex: /\.(jpg|jpeg|png|gif)$/i,
    });
    if (imageValidation)
      return new NextResponse(JSON.stringify(imageValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const metaTitleValidation = validateField(metaTitle, "Meta Title", {
      type: "string",
      maxLength: 150,
    });
    if (metaTitleValidation)
      return new NextResponse(JSON.stringify(metaTitleValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const metaDescriptionValidation = validateField(
      metaDescription,
      "Meta Description",
      { type: "string", maxLength: 160 }
    );
    if (metaDescriptionValidation)
      return new NextResponse(JSON.stringify(metaDescriptionValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const tagsValidation = validateField(tags, "Tags", {
      type: "string",
      isOptional: true,
    });
    if (tagsValidation)
      return new NextResponse(JSON.stringify(tagsValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const descriptionValidation = validateField(description, "Description", {
      type: "string",
      minLength: 10,
    });
    if (descriptionValidation)
      return new NextResponse(JSON.stringify(descriptionValidation), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

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

    const parsedTags = tags ? tags.split(",").map((item:string) => item.trim()) : [];
    const parsedMetaKeywords = metaKeywords
      ? metaKeywords.split(",").map((item:string) => item.trim())
      : [];

    
    const newBlog = new BlogModel({
      title,
      slug,
      category,
      short_desc,
      blogType,
      isPublished,
      image,
      metaTitle,
      metaDescription,
      desc: description,
      metaKeywords: parsedMetaKeywords,
      ogImage,
      twitterImage,
      tags: parsedTags,
      writer_email: user?.email,
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
