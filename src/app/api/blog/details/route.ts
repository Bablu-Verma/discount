import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { slug } = requestData;

    // Check if the slug is provided
    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Blog slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch the blog by slug from the database
    const blog = await BlogModel.findOne({ slug });
   
    
    if (!blog) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Blog not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


  if (blog.views === undefined) {
    blog.views = 1; 
  } else {
    blog.views += 1; 
  }

  
  await blog.save();

    // Return the blog details
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog post fetched successfully.",
        data: blog,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
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
