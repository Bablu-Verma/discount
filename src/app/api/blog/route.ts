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

// Helper function to apply filters based on query params
const getFilterParams = async (req: Request) => {
  const filter_ = await req.json()


  console.log(filter_)

  

  const filters: any = {};
  const sortOptions: any = {};
 

 if(filter_.isPublished !== null){
  if (filter_.isPublished == 'true') {
    filters.isPublished = true;
  }
  if(filter_.isPublished == "false"){
    filters.isPublished = false
   }
 }




  // const category = searchParams.get("category");
  // if (category) {
  //   filters.category = category;
  // }

  const today = filter_.today;
  const last7Days = filter_.last7Days;
  const last30Days = filter_.last30Days;

  // const currentDate = new Date();
  // if (today === "true") {
  //   const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  //   filters.createdAt = { $gte: startOfDay };
  // } else if (last7Days === "true") {
  //   const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
  //   filters.createdAt = { $gte: sevenDaysAgo };
  // } else if (last30Days === "true") {
  //   const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
  //   filters.createdAt = { $gte: thirtyDaysAgo };
  // }

  // const sort = searchParams.get("sort");
  // if (sort === "A-Z") {
  //   sortOptions.title = 1; 
  // } else if (sort === "Z-A") {
  //   sortOptions.title = -1; 
  // } else {
  //   sortOptions.createdAt = -1; 
  // }

  return { filters, sortOptions };
};

export async function POST(req: Request) {
  await dbConnect();


  // console.log(req.json())

  const { page, limit } = getPaginationParams(req);
  const { filters, sortOptions } = await getFilterParams(req);

  const skip = (page - 1) * limit;

  try {
   
    const blogQueries = await BlogModel.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

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
