import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import CategoryModel from "@/model/CategoryModel";
import BlogModel from "@/model/BlogModal";

export async function POST(req: Request) {
  await dbConnect();

  try {
    
    const banner = await CampaignModel.find({banner:true}).limit(5);
    const newCampaigns = await CampaignModel.find({new:true}).limit(10);
    const hotCampaigns = await CampaignModel.find({hot:true}).limit(10);
    const featuredCampaigns = await CampaignModel.find({featured:true}).limit(10);
    const category = await CategoryModel.find({})
    const newBlogs = await BlogModel.find({}).limit(4).sort({ createdAt: -1 });
    const poster = await CampaignModel.find({add_poster:true}).limit(2);
    const arrival = await CampaignModel.find({arrival:true}).limit(4);

   
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Home data fatch successfully.",
        data: {
          category:category,
          banner:banner,
          new: newCampaigns,
          hot: hotCampaigns,
          featured: featuredCampaigns,
          blogs: newBlogs,
          poster:poster,
          arrival:arrival
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching campaigns:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch campaigns.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
