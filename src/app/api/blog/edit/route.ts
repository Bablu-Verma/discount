import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import BlogModel from "@/model/BlogModal";

import { generateSlug } from "@/helpers/client/client_function";
import { upload_image } from "@/helpers/server/upload_image";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, user, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!(usertype === "admin" || usertype === "blog_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request data
    const requestData = await req.json();
      // console.log("requestData",requestData)
    const {
      blog_id,
      title,
      short_desc,
      desc,
      blog_category,
      blog_type,
      image,
      tags,
      reading_time,
      keywords,
      publish_schedule,
      word_count,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      canonical_url,
      og_image,
      og_title,
      og_description,
      twitter_card,
      schema_markup,
    } = requestData;

    if (!blog_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "blog_id is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the blog
    const blogToUpdate = await BlogModel.findById(blog_id);
    if (!blogToUpdate) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Blog not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    


    // Update slug only if title is provided
    if (title) {
      const newSlug = generateSlug(title);
      if (newSlug !== blogToUpdate.slug) {
        const existingBlog = await BlogModel.findOne({ slug: newSlug });
        if (existingBlog) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "This slug already exists. Use a different title.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        blogToUpdate.slug = newSlug;
      }
      blogToUpdate.title = title;
    }

    // Update only the fields that are provided
    if (short_desc) blogToUpdate.short_desc = short_desc;
    if (desc) blogToUpdate.desc = desc;
    if (blog_category) blogToUpdate.blog_category = blog_category;
    if (blog_type) blogToUpdate.blog_type = blog_type;
    if (image.length > 0) blogToUpdate.image = image.map((img:string) => img.trim());
    if (tags) {
      if (Array.isArray(tags)) {
        blogToUpdate.tags = tags.map((tag) => tag.trim()); // Already an array
      } else if (typeof tags === "string") {
        blogToUpdate.tags = tags.split(",").map((tag) => tag.trim()); // Convert string to array
      }
    }
    if (reading_time) blogToUpdate.reading_time = reading_time;
    if (keywords) {
      if (Array.isArray(keywords)) {
        blogToUpdate.keywords = keywords.map((keyword) => keyword.trim());
      } else if (typeof keywords === "string") {
        blogToUpdate.keywords = keywords.split(",").map((keyword) => keyword.trim()); // Convert string to array
      }
    }
    if (publish_schedule) blogToUpdate.publish_schedule = publish_schedule;
    if (word_count) blogToUpdate.word_count = word_count;
    if (status) blogToUpdate.status = status;
    if (meta_title) blogToUpdate.meta_title = meta_title;
    if (meta_description) blogToUpdate.meta_description = meta_description;
    if (meta_keywords) {
      if (Array.isArray(meta_keywords)) {
        blogToUpdate.meta_keywords = meta_keywords.map((item) => item.trim()); 
      } else if (typeof meta_keywords === "string") {
        blogToUpdate.meta_keywords = meta_keywords.split(",").map((item) => item.trim()); 
      }
    }
    if (canonical_url) blogToUpdate.canonical_url = canonical_url;
    if (og_image) blogToUpdate.og_image = og_image.trim();
    if (og_title) blogToUpdate.og_title = og_title;
    if (og_description) blogToUpdate.og_description = og_description;
    if (twitter_card) blogToUpdate.twitter_card = twitter_card;
    if (schema_markup) blogToUpdate.schema_markup = schema_markup;

    // Save the updated blog
    await blogToUpdate.save();

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
