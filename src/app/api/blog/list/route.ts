import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

// Helper function to extract pagination parameters
const getPaginationParams = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);
  return { page, limit };
};

// Function to process filter parameters
const getFilterParams = async (req: Request) => {
  const filter_ = await req.json();

  const filters: any = {};
  const sortOptions: any = { createdAt: -1 }; // Default sorting (newest first)

  // Filtering by status
  if (filter_.status && filter_.status !== "ALL") {
    if (!["ACTIVE", "INACTIVE", "REMOVED"].includes(filter_.status)) {
      throw new Error("Invalid status value.");
    }
    filters.status = filter_.status;
  }

  if (filter_.search) {
    filters.$or = [
      { title: { $regex: filter_.search, $options: "i" } }, // Case-insensitive title search
      { slug: filter_.search } // Exact match for slug
    ];
  }

  // Filtering by writer email
  if (filter_.writer_email) {
    filters.writer_email = filter_.writer_email;
  }

  // Filtering by date range
  if (filter_.startDate && filter_.endDate) {
    filters.createdAt = { $gte: new Date(filter_.startDate), $lte: new Date(filter_.endDate) };
  } else if (filter_.startDate) {
    filters.createdAt = { $gte: new Date(filter_.startDate) };
  } else if (filter_.endDate) {
    filters.createdAt = { $lte: new Date(filter_.endDate) };
  }

  // Sorting Options (if provided)
  if (filter_.sortBy === "views") {
    sortOptions.views = -1; // Sort by most viewed
  } else if (filter_.sortBy === "createdAt") {
    sortOptions.createdAt = -1; // Sort by newest first
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

    return NextResponse.json(
      {
        success: true,
        message: "Blog posts fetched successfully.",
        data: blogs,
        pagination: {
          total: totalBlogs,
          page,
          limit,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching blog posts.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
