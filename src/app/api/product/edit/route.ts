import { generateSlug } from "@/helpers/client/client_function";
import { upload_image } from "@/helpers/server/upload_image";
import { authenticateUser } from "@/lib/authenticate";
import { isAdmin } from "@/lib/checkUserRole";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
    const { authenticated, user, message } = await authenticateUser(req);

    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const email_check = user?.email || "";
    const is_admin = await isAdmin(email_check);

    if (!is_admin) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied. Only admins can edit campaigns.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request data
    const requestData = await req.formData();
    const campaignId = requestData.get("campaignId") as string;

    if (!campaignId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid request data. campaignId is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const campaign = await CampaignModel.findOne({campaign_id:Number(campaignId)});

    if (!campaign) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Campaign not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

  
    const imgFiles = requestData.getAll("images") as File[];
    const banner_file = requestData.get("banner_img") as File;
    const description = requestData.get("description");
    const calculation_type = requestData.get("calculation_type");
    const product_name = requestData.get("title") as string;
    const brand_name = requestData.get("brand_name");
    const price = requestData.get("price");
    const cashback = requestData.get("cashback");
    const product_status = requestData.get("active");
    const banner_status = requestData.get("banner");
    const category = requestData.get("category");
    const terms = requestData.get("tc");
    const meta_title = requestData.get("meta_title");
    const meta_description = requestData.get("meta_description");
    const meta_keywords = requestData.get("meta_keywords");
    const tags = requestData.get("tags");
    const new_p = requestData.get("new");
    const featured_p = requestData.get("featured");
    const hot_p = requestData.get("hot");
    const add_poster = requestData.get("add_poster");
    const arrival = requestData.get("arrival");
    const flash_time = requestData.get("expire_time");






    if (imgFiles && Array.isArray(imgFiles) && imgFiles.every((img) => img instanceof File)) {
      const imageUrls = await Promise.all(
        imgFiles.map(async (img) => {
          const { success, message, url } = await upload_image(img, "site_product");
          if (success && url) return url;
          console.error("Image upload failed:", message);
          return null;
        })
      ).then((urls) => urls.filter((url) => url !== null));
    
      if (imageUrls.length > 0) {
        campaign.img = imageUrls;
      }
    } 

  
    if(banner_file && banner_file instanceof File) {
      const { success, message, url } = await upload_image(
        banner_file,
        "site_banner"
      );
      if (success && url) {
        campaign.banner_img = url;
        console.log("banner uploaded successfully:", url);
      } else {
        console.error("banner upload failed:", message);
      }
    }
   
    if (product_name) {
      const newSlug = generateSlug(product_name);

      if (newSlug !== campaign.slug) {
        const existingCampaign = await CampaignModel.findOne({ slug: newSlug });
        if (existingCampaign) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: `The slug "${newSlug}" is already in use. Please use a different product name.`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        campaign.slug = newSlug;
      }
    }

    let offer_price: number = 0;
    if (calculation_type === "Subtract") {
      offer_price = Number(price) - Number(cashback);
    } else if (calculation_type === "Division") {
      offer_price = Number(price) * (1 - Number(cashback) / 100);
    }

    console.log(imgFiles,banner_file,calculation_type,product_name,brand_name,price,cashback,product_status,banner_status,category,terms,meta_title,meta_description,meta_keywords,tags,new_p,featured_p,hot_p,add_poster,arrival,flash_time,'==>',)
    // description






    campaign.cashback = Number(price) - offer_price
    campaign.title = product_name;
    campaign.calculation_type = calculation_type;
    campaign.price = Number(price);
    campaign.description = description;
    campaign.offer_price = offer_price;
    campaign.brand = brand_name;
    campaign.category = category;
    campaign.active = product_status === "active" ? true : false;
    campaign.tc = terms;
    campaign.banner = banner_status === "active" ? true : false;
    campaign.hot = hot_p == "true" ? true : false;
    campaign.featured = featured_p == "true" ? true : false;
    campaign.new = new_p == "true" ? true : false;
    campaign.meta_title = meta_title;
    campaign.meta_description = meta_description;
    campaign.meta_keywords = meta_keywords;
    campaign.tags = tags;
    campaign.add_poster = add_poster == "true" ? true : false;
    campaign.arrival = arrival == "true" ? true : false;
    campaign.expire_time = flash_time;

   

    await campaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign edited successfully.",
        campaign,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to edit campaign:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to edit campaign.", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({ success: false, message: "An unexpected error occurred." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
