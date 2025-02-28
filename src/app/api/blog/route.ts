import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

// Helper function to handle pagination params
const getPaginationParams = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);
  return { page, limit };
};

const getFilterParams = async (req: Request) => {
  const filter_ = await req.json();

  const filters: any = {};
  const sortOptions: any = { createdAt: -1 }; 

  if (filter_.category) {
    filters.category = filter_.category;
  }

  if (filter_.title) {
    filters.title = { $regex: filter_.title, $options: "i" }; 
  }

  if (filter_.blogType) {
    filters.blogType = filter_.blogType;
  }

  if (filter_.writer_email) {
    filters.writer_email = filter_.writer_email;
  }

  if (filter_.views) {
    filters.views = { $gte: filter_.views }; 
  }

  // Handle isPublished filter
  if (filter_.isPublished === "ALL") {
    // No filter applied
  } else if (filter_.isPublished === "PUBLISHED") {
    filters.isPublished = true;
  } else if (filter_.isPublished === "PUBLISHED_FALSE") {
    filters.isPublished = false;
  } else {
    filters.isPublished = true; 
  }

  // Date Range Filtering (Created At)
  if (filter_.startDate && filter_.endDate) {
    filters.createdAt = { $gte: new Date(filter_.startDate), $lte: new Date(filter_.endDate) };
  } else if (filter_.startDate) {
    filters.createdAt = { $gte: new Date(filter_.startDate) };
  } else if (filter_.endDate) {
    filters.createdAt = { $lte: new Date(filter_.endDate) };
  }

  // Sorting Option (If provided)
  if (filter_.sortBy === "views") {
    sortOptions.views = -1; // Highest views first
  } else if (filter_.sortBy === "createdAt") {
    sortOptions.createdAt = -1; // Newest first
  }

  return { filters, sortOptions };
};

// API Handler
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { page, limit } = getPaginationParams(req);
    const { filters, sortOptions } = await getFilterParams(req);

    const skip = (page - 1) * limit;

    // Fetch blogs with filters, sorting, and pagination
    const blogs = await BlogModel.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalBlogs = await BlogModel.countDocuments(filters);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Blog posts fetched successfully.",
        data: blogs,
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
