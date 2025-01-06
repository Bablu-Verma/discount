import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";
import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { slug } = await req.json();

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

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Slug is required to delete the blog.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Attempt to delete the blog post with the given slug
    const deletedBlog = await BlogModel.findOneAndDelete({ slug });

    if (!deletedBlog) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: `No blog found with slug: ${slug}`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Blog with slug "${slug}" deleted successfully.`,
        data: deletedBlog,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while deleting the blog.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
