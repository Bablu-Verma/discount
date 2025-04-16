import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const {
      product_id,
      title,
      actual_price,
      cashback_,
      store,
      category,
      description,
      img_array,
      calculation_mode,
      t_and_c,
      meta_title,
      meta_description,
      meta_keywords,
      product_status,
      product_tags,
      long_poster,
      main_banner,
      premium_product,
      flash_sale,
      slug_type,
      meta_robots,
      canonical_url,
      structured_data,
      og_image,
      og_title,
      og_description,
    } = requestData;

    if (!product_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid request data. product_id is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const campaign = await CampaignModel.findOne({ _id:product_id });

    if (!campaign) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Product not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (title) {
      const newSlug = generateSlug(title);
      if (newSlug !== campaign.product_slug) {
        const existingCampaign = await CampaignModel.findOne({
          product_slug: newSlug,
        });
        if (existingCampaign) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: `The slug "${newSlug}" is already in use. Please use a different product name.`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        campaign.product_slug = newSlug;
      }
    }

    if (description && description.length < 20) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Description must be at least 100 characters long.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (actual_price !== undefined && isNaN(Number(actual_price))) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid actual_price. Must be a number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (cashback_ !== undefined && isNaN(Number(cashback_))) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid cashback_. Must be a number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Ensure actual_price and cashback_ are valid numbers
    const actualPriceNum = Number(actual_price);
    const cashbackNum = Number(cashback_);

    if (isNaN(actualPriceNum) || actualPriceNum < 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid actual_price. Must be a positive number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (isNaN(cashbackNum) || cashbackNum < 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid cashback_. Must be a non-negative number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Calculate cashback and offer price
    let calculated_cashback_ = 0;
    let offer_price_ = actualPriceNum;

    if (actualPriceNum > 0) {
      if (calculation_mode === "FIX") {
        calculated_cashback_ = cashbackNum;
      } else if (calculation_mode === "PERCENTAGE") {
        calculated_cashback_ = (actualPriceNum * cashbackNum) / 100;
      }
      offer_price_ = actualPriceNum - calculated_cashback_;
    }

    // Update fields if provided (avoid overwriting with empty/null/undefined values)
    const updateIfValid = (field: string, value: any) => {
      if (value !== undefined && value !== null && value !== "") {
        campaign[field] = value;
      }
    };

    // Handle normal fields
    updateIfValid("title", title);
    updateIfValid("store", store);
    updateIfValid("category", category);
    updateIfValid("t_and_c", t_and_c);
    updateIfValid("meta_title", meta_title);
    updateIfValid("meta_description", meta_description);
    updateIfValid("meta_robots", meta_robots);
    updateIfValid("canonical_url", canonical_url);
    updateIfValid("structured_data", structured_data);
    updateIfValid("og_image", og_image);
    updateIfValid("og_title", og_title);
    updateIfValid("structured_data", structured_data);
    updateIfValid("og_description", og_description);
    updateIfValid(
      "meta_keywords",
      Array.isArray(meta_keywords) ? meta_keywords : undefined
    );
    updateIfValid("actual_price", actual_price);
    updateIfValid("cashback_", cashback_);
    updateIfValid("calculated_cashback", calculated_cashback_);
    updateIfValid("offer_price", offer_price_);

  
    if (calculation_mode && ["PERCENTAGE", "FIX"].includes(calculation_mode)) {
      campaign.calculation_mode = calculation_mode;
    }
    if (slug_type && ["INTERNAL", "EXTERNAL"].includes(slug_type)) {
      campaign.slug_type = slug_type;
    }
    if (product_status && ["ACTIVE", "PAUSE"].includes(product_status)) {
      campaign.product_status = product_status;
    }

    // Handle Array fields
    if (Array.isArray(img_array) && img_array.length > 0) {
      campaign.img_array = img_array;
    }
    if (Array.isArray(product_tags)) {
      campaign.product_tags = product_tags;
    }

    // Handle Object Array Fields (validate structure before updating)
    const validateImageArray = (value: any) =>
      Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === "object" &&
          (!item.is_active || (item.image && typeof item.image === "string"))
      );

    if (validateImageArray(long_poster)) {
      campaign.long_poster = long_poster;
    }
    if (validateImageArray(main_banner)) {
      campaign.main_banner = main_banner;
    }
    if (validateImageArray(premium_product)) {
      campaign.premium_product = premium_product;
    }
    if (
      Array.isArray(flash_sale) &&
      flash_sale.every(
        (item) =>
          typeof item === "object" &&
          (!item.is_active || (item.image && item.end_time))
      )
    ) {
      campaign.flash_sale = flash_sale;
    }

    await campaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign edited successfully.",
     
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to edit campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to edit campaign.",
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
