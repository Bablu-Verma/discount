import { generateSlug } from "@/helpers/client/client_function";
import { upload_image } from "@/helpers/server/upload_image";
import { authenticateAndValidateUser } from "@/lib/authenticate";

import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
     const { authenticated, user, usertype, message } =
         await authenticateAndValidateUser(req);
   
       if (!authenticated) {
         return new NextResponse(
           JSON.stringify({
             success: false,
             message: message || "User is not authenticated",
           }),
           {
             status: 401,
             headers: {
               "Content-Type": "application/json",
             },
           }
         );
       }
   
       if (!(usertype === "admin" || usertype === "data_editor")) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Access denied: You do not have the required role",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }


    const requestData = await req.formData();
    // console.log("Form Data Received:", Object.fromEntries(requestData.entries()));

    const imgFiles = requestData.getAll("images") as string[];
    const banner_file = requestData.get("banner") as string;
    const description = requestData.get("description");
    const calculation_type = requestData.get("calculation_type");
    const product_name = requestData.get("product_name");
    const brand_name = requestData.get("brand_name");
    const price = requestData.get("price");
    const cashback = requestData.get("cashback");
    const product_status = requestData.get("product_status");
    const banner_status = requestData.get("banner_status");
    const category = requestData.get("category");
    const terms = requestData.get("terms");
    const meta_title = requestData.get("meta_title");
    const meta_description = requestData.get("meta_description");
    const meta_keywords = requestData.get("meta_keywords");
    const tags = requestData.get("tags");
    const new_p = requestData.get("new_p");
    const featured_p = requestData.get("featured_p");
    const hot_p = requestData.get("hot_p");
    const add_poster = requestData.get("add_poster");
    const arrival = requestData.get("arrival");
    const flash_time = requestData.get("flash_time");
    const client_url = requestData.get("client_url");

    if (!imgFiles.length) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "At least one image is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const slug = generateSlug(
      typeof product_name === "string" ? product_name : ""
    );

   const find_product = await CampaignModel.findOne({slug:slug})

    if (find_product) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product with this name already exists.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if(add_poster == "true"? true:false){
      const find_arrival_count = await CampaignModel.find({arrival:true})

      if (find_arrival_count.length > 4) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "You can also add $ product in arrival mode.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
    }

  
    // Construct campaign data object
    const campaignData: Record<string, any> = {};

    let offer_price: number = 0;

    if (calculation_type === "Subtract") {
      offer_price = Number(price) - Number(cashback);
    } else if (calculation_type === "Division") {
      offer_price = Number(price) * (1 - Number(cashback) / 100);
    }

    campaignData.title = product_name;
    campaignData.client_url = client_url;
    campaignData.calculation_type = calculation_type;
    campaignData.price = Number(price);
    campaignData.description = description;
    campaignData.offer_price = offer_price;
    campaignData.brand = brand_name;
    campaignData.category = category;
    campaignData.img = imgFiles;
    campaignData.active = product_status === "active" ? true : false;
    campaignData.tc = terms;
    campaignData.cashback = Number(price) - offer_price;
    campaignData.banner = banner_status === "active" ? true : false;
    campaignData.hot = hot_p == "true" ? true : false;
    campaignData.featured = featured_p == "true" ? true : false;
    campaignData.new = new_p == "true" ? true : false;
    campaignData.slug = slug;
    campaignData.meta_title = meta_title;
    campaignData.meta_description = meta_description;
    campaignData.meta_keywords = meta_keywords;
    campaignData.tags = tags;
    campaignData.add_poster = add_poster == "true" ? true : false;
    campaignData.arrival = arrival == "true" ? true : false;
    if(flash_time){
      campaignData.expire_time = flash_time;
    }
    campaignData.user_email = user?.email;
    campaignData.banner_img = banner_file;

    const campaign = new CampaignModel(campaignData);
    await campaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign added successfully",
        data: campaign,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to create campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to create campaign",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
