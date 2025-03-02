import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { slug, status } = requestData;

    if (!slug) {
      return NextResponse.json({ success: false, message: "Blog slug is required." }, { status: 400 });
    }

    // Define the filter object
    const filter: any = { slug };

    // Apply status filter if it's not "ALL"
    if (status && status !== "ALL") {
      if (!["ACTIVE", "INACTIVE", "REMOVED"].includes(status)) {
        return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
      }
      filter.status = status;
    }

    // Fetch the blog with the applied filter
    const blog = await BlogModel.findOne(filter);

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found." }, { status: 404 });
    }

    blog.views = +1

   await blog.save()

    return NextResponse.json({
      success: true,
      message: "Blog post fetched successfully.",
      data: blog,
    }, { status: 200 });

  }  catch (error) {
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
