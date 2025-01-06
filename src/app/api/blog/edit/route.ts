import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateUser } from "@/lib/authenticate";
import BlogModel from "@/model/BlogModal";
import { isAdmin } from "@/lib/checkUserRole";
import { generateSlug } from "@/helpers/client/client_function";
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
          message: "You are not authorized to edit blogs.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse form data
    const requestData = await req.formData();
    const slug = requestData.get("slug") as string;
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

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Slug is required to identify the blog.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

 
    // Find the blog by slug
    const blogToUpdate = await BlogModel.findOne({ slug });
    if (!blogToUpdate) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Blog not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const update_slug = generateSlug(title);


    if(update_slug != slug) {
      const blogcheck = await BlogModel.findOne({ slug:update_slug });
      if (blogcheck) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "This slug already exists use diffrent Title",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      blogToUpdate.slug = update_slug;
    }
   
    if (title) blogToUpdate.title = title;
    if (category) blogToUpdate.category = category;
    if (short_desc) blogToUpdate.short_desc = short_desc;
    if (blogType) blogToUpdate.blogType = blogType;
    if (isPublished !== undefined) blogToUpdate.isPublished = isPublished;
    if (metaTitle) blogToUpdate.metaTitle = metaTitle;
    if (metaDescription) blogToUpdate.metaDescription = metaDescription;
    if (description) blogToUpdate.desc = description;
    if (metaKeywords) blogToUpdate.metaKeywords = metaKeywords.split(",").map((item) => item.trim());
    if (tags) blogToUpdate.tags = tags.split(",").map((item) => item.trim());

  
    if (image_get && image_get instanceof File) {
      const { success, message, url } = await upload_image(image_get, "blog_image");
      if (success && url) {
        blogToUpdate.image = url;
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

    if (ogImage_get && ogImage_get instanceof File) {
      const { success, message, url } = await upload_image(ogImage_get, "blog_image");
      if (success && url) {
        blogToUpdate.ogImage = url;
        console.log("ogImage uploaded successfully:", url);
      } else {
        console.error("ogImage upload failed:", message);
      }
    }

    if (twitterImage_get && twitterImage_get instanceof File) {
      const { success, message, url } = await upload_image(twitterImage_get, "blog_image");
      if (success && url) {
        blogToUpdate.twitterImage = url;
        console.log("twitterImage uploaded successfully:", url);
      } else {
        console.error("twitterImage upload failed:", message);
      }
    }

    // Save the updated blog
    await blogToUpdate.save();

    // Return success response
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog updated successfully.",
        data: blogToUpdate,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating blog:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update blog.",
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
