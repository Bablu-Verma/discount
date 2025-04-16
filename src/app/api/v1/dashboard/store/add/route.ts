import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import { upload_image } from "@/helpers/server/upload_image";
import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CategoryModel from "@/model/CategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate User
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    
    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Requires admin role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract Request Data
    const requestData = await req.json();
    const { name, description, store_img,category,tc, tracking, cashback_status, store_link, cashback_type, cashback_rate, store_status } = requestData;

    // console.log(requestData)



    // Validate Required Fields
    if (!name || !description || !store_img || !store_link || !cashback_type || !category || !tc || !tracking) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing required fields: name, description, store_img, store_link, cashback_type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const slug = generateSlug(name);

    const existingStore = await StoreModel.findOne({ $or: [{ name }, { slug }] });
    if (existingStore) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store with this name or slug already exists." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }


    const findCategory = await CategoryModel.findById(category)

    if (!findCategory) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Add valid category id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create Store
    const newStore = new StoreModel({
      name,
      category,
      tc,
      tracking,
      description,
      slug,
      store_img,
      cashback_status,
      store_link,
      cashback_type,
      cashback_rate,
      store_status,
    });

    await newStore.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Store added successfully." }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }  catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add store:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to add store.", error: error.message }),
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
