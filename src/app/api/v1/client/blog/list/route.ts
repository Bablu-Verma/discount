import { blog_type } from "@/constant";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";
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
  const sortOptions: any = { createdAt: -1 }; 

  filters.status = 'ACTIVE'

  if (filter_.search) {
    filters.$or = [
      { title: { $regex: filter_.search, $options: "i" } },
      { slug: filter_.search } 
    ];
  }
  if(filter_.blog_category){
    filters.blog_category = filter_.blog_category;
  }
  if(filter_.blog_type){
    filters.blog_type = filter_.blog_type;
  }

  if (filter_.sortBy === "views") {
    sortOptions.views = -1; 
  } else if (filter_.sortBy === "createdAt") {
    sortOptions.createdAt = -1; 
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


    const blogs = await BlogModel.find(filters).populate("writer_id", "name email profile")
    .populate("blog_category", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalBlogs = await BlogModel.countDocuments(filters);
    const blog_category = await BlogCategoryModel.find({status:'ACTIVE'})

    return NextResponse.json(
      {
        success: true,
        message: "Blog posts fetched successfully.",
        data: {
          blogs, 
          blog_type: blog_type,
          category:blog_category

        },
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
