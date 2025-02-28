import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Only admin can edit store" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const { storeId, name, description, img, cashback_status, store_link, cashback, status } = requestData;

    if (!storeId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const store = await StoreModel.findById(storeId);

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (name) store.name = name;
    if (description) store.description = description;
    if (img) store.img = img;
    if (cashback_status !== undefined) store.cashback_status = cashback_status;
    if (store_link) store.store_link = store_link;
    if (cashback) store.cashback = cashback;
    if (status !== undefined) store.status = status;

    await store.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Store updated successfully.", data: store }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to update store:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to update store.", error: error.message }),
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
