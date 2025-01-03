import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateUser } from "@/lib/authenticate";
import BlogModel from "@/model/BlogModal";
import { isAdmin } from "@/lib/checkUserRole";
import { generateSlug } from "@/helpers/client/client_function";
import { upload_image } from "@/helpers/server/upload_image";

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
    // Authenticate the user
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

    // Check if the user is an admin
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

    // Parse form data
    const requestData = await req.formData();
    const title = requestData.get("title") as string;
    const category = requestData.get("category") as string;
    const short_desc = requestData.get("short_desc") as string;
    const blogType = requestData.get("blogType") as string;
    const isPublished = requestData.get("isPublished") === "true"; 
    const image_get = requestData.get("image") as File; 
    const metaTitle = requestData.get("metaTitle") as string;
    const metaDescription = requestData.get("metaDescription") as string;
    const description = requestData.get("description") as string;
    const metaKeywords = requestData.get("metaKeywords") as string;
    const ogImage_get = requestData.get("ogImage") as File; 
    const twitterImage_get = requestData.get("twitterImage") as File; 
    const tags = requestData.get("tags") as string;

    // Validation
    const titleValidation = validateField(title, "Title");
    if (titleValidation) return new NextResponse(JSON.stringify(titleValidation), { status: 400, headers: { "Content-Type": "application/json" } });

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

    // Upload Images if they exist
    let image;
    if (image_get &&  image_get instanceof File) {
      const { success, message, url } = await upload_image(image_get, "blog_image");
      if (success && url) {
        image = url;
        console.log("Image uploaded successfully:", url);
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: `Image upload failed: ${message}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    let ogImage;
    if (ogImage_get && ogImage_get instanceof File) {
      const { success, message, url } = await upload_image(ogImage_get, "blog_image");
      if (success && url) {
        ogImage = url;
        console.log("ogImage uploaded successfully:", url);
      } else {
        console.error("ogImage upload failed:", message);
      }
    }

    let twitterImage;
    if ( twitterImage_get && twitterImage_get instanceof File) {
      const { success, message, url } = await upload_image(twitterImage_get, "blog_image");
      if (success && url) {
        twitterImage = url;
        console.log("twitterImage uploaded successfully:", url);
      } else {
        console.error("twitterImage upload failed:", message);
      }
    }

    // Handle tags and metaKeywords conversion
    const parsedTags = tags ? tags.split(",").map((item) => item.trim()) : [];
    const parsedMetaKeywords = metaKeywords ? metaKeywords.split(",").map((item) => item.trim()) : [];

    // Create a new blog entry
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
      desc:description,
      metaKeywords: parsedMetaKeywords,
      ogImage,
      twitterImage,
      tags: parsedTags,
      writer_email: email_check,
    });

    // Save the new blog
    await newBlog.save();

    // Return success response
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
