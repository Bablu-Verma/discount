import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

// Helper function to handle pagination params
const getPaginationParams = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get('page')) || 1, 1); // Ensure page is at least 1
  const limit = Math.max(Number(searchParams.get('limit')) || 10, 1); // Ensure limit is at least 1

  return { page, limit };
};

// Helper function to build filters
const buildFilters = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const filters: { [key: string]: any } = {};

  // Filter by blog_type
  const blogType = searchParams.get('blog_type');
  if (blogType) {
    filters.blog_type = { $in: blogType.split(',') }; // Support for multiple values (comma-separated)
  }

  // Filter by category
  const category = searchParams.get('category');
  if (category) {
    filters.category = { $in: category.split(',') }; // Support for multiple values (comma-separated)
  }

  return filters;
};

export async function GET(req: Request) {
  await dbConnect();
  
  // Get pagination params
  const { page, limit } = getPaginationParams(req);

  // Get filter params
  const filters = buildFilters(req);

  const skip = (page - 1) * limit;

  try {
    // Fetch blog posts with pagination and filters
    const blogQueries = await BlogModel.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by createdAt descending

    // Fetching the total number of blogs for pagination (with filters)
    const totalBlogs = await BlogModel.countDocuments(filters);

    // Return successful response with pagination info
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog posts fetched successfully.",
        data: blogQueries,
        pagination: {
          total: totalBlogs,
          page,
          limit,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Error handling block
    console.error("Error fetching blog posts:", error);
    
    // Return generic error response for failures
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching blog posts.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
