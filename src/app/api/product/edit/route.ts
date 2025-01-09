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

    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Campaign not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle image uploads
    const imgFiles = requestData.getAll("images") as File[];
    const imageUrls = await Promise.all(
      imgFiles.map(async (img) => {
        if (img instanceof File) {
          const { success, message, url } = await upload_image(img, "site_product");
          if (success && url) return url;
          console.error("Image upload failed:", message);
          return null;
        }
        console.error("Invalid image value. Expected a File.");
        return null;
      })
    ).then((urls) => urls.filter((url) => url !== null)); // Filter out null values

    const campaignData: Record<string, any> = {};

    const fields = [
      "product_name",
      "price",
      "cashback",
      "description",
      "brand_name",
      "category",
      "product_status",
      "banner_status",
      "hot_p",
      "featured_p",
      "new_p",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "tags",
      "add_poster",
      "arrival",
      "flash_time",
    ];

    fields.forEach((field) => {
      if (requestData.has(field)) {
        const value = requestData.get(field);
        if (["price", "cashback"].includes(field)) {
          campaignData[field] = Number(value);
        } else if (["product_status", "banner_status", "hot_p", "featured_p", "new_p", "add_poster", "arrival"].includes(field)) {
          campaignData[field] = value === "true";
        } else {
          campaignData[field] = value;
        }
      }
    });

    if (campaignData.price && campaignData.cashback) {
      campaignData.offer_price = campaignData.price - campaignData.cashback;
    }

    // Handle slug generation and validation
    if (requestData.has("product_name")) {
      const productName = requestData.get("product_name") as string;
      const newSlug = generateSlug(productName);

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
        campaignData.slug = newSlug;
      }
    }

    if (imageUrls.length > 0) campaignData.img = imageUrls;

    // Update the campaign document
    Object.assign(campaign, campaignData);

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
