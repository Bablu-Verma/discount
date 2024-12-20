import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

// Helper function to handle pagination params
const getPaginationParams = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get('page')) || 1, 1); 
  const limit = Math.max(Number(searchParams.get('limit')) || 10, 1); 

  return { page, limit };
};

// Helper function to build filters
const buildFilters = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const filters: { [key: string]: any } = {};

  // Filter by blog_type
  const blogType = searchParams.get('blog_type');
  if (blogType) {
    filters.blog_type = { $in: blogType.split(',') };
  }

  // Filter by category
  const category = searchParams.get('category');
  if (category) {
    filters.category = { $in: category.split(',') }; 
  }

  return filters;
};

export async function GET(req: Request) {
  await dbConnect();
  
  const { page, limit } = getPaginationParams(req);

  const filters = buildFilters(req);

  const skip = (page - 1) * limit;

  try {
    // Fetch blog posts with pagination and filters
    const blogQueries = await BlogModel.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    const totalBlogs = await BlogModel.countDocuments(filters);

  
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
  
    console.error("Error fetching blog posts:", error);
    
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
