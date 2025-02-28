import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { slug, accessType } = requestData;

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Blog slug is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Define the filter based on accessType
    const filter: any = { slug };

    if (accessType === "normal") {
      // Normal users can only access published blogs
      filter.isPublished = true;
    }

    // Fetch the blog by slug with applied filter
    const blog = await BlogModel.findOne(filter);

    if (!blog) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Blog not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Increment view count only if accessType is "normal"
    if (accessType === "normal") {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog post fetched successfully.",
        data: blog,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching blog post.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
