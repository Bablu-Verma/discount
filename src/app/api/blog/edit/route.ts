import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import BlogModel from "@/model/BlogModal";

import { generateSlug } from "@/helpers/client/client_function";
import { upload_image } from "@/helpers/server/upload_image";
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
      slug,
      blogType,
      isPublished,
      metaTitle,
      metaDescription,
      description,
      metaKeywords,
      ogImage,
      twitterImage,
      image,
      tags,
    } = requestData;

  

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


    console.log(blogToUpdate.ogImage)
    console.log(isPublished)
   
    if (title) blogToUpdate.title = title;
    if (twitterImage) blogToUpdate.twitterImage = twitterImage.trim();
    if (image) blogToUpdate.image = image.trim();
    if (ogImage) blogToUpdate.ogImage = ogImage.trim();
    if (category) blogToUpdate.category = category;
    if (short_desc) blogToUpdate.short_desc = short_desc;
    if (blogType) blogToUpdate.blogType = blogType;
    if (isPublished !== undefined) blogToUpdate.isPublished = isPublished ;
    if (metaTitle) blogToUpdate.metaTitle = metaTitle;
    if (metaDescription) blogToUpdate.metaDescription = metaDescription;
    if (description) blogToUpdate.desc = description;
    if (metaKeywords) blogToUpdate.metaKeywords = metaKeywords.split(",").map((item:string) => item.trim());
    if (tags) blogToUpdate.tags = tags.split(",").map((item:string) => item.trim());



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
