import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { status, deleted_store, page = 1, limit = 10, search } = await req.json();

    const query: any = { deleted_store: false }; 

    if (status !== undefined) query.status = status;
    if (deleted_store !== undefined) query.deleted_store = deleted_store;
    if (search) query.name = { $regex: search, $options: "i" };

    const stores = await StoreModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalStores = await StoreModel.countDocuments(query);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store list fetched successfully.",
        data: stores,
        totalStores,
        currentPage: page,
        totalPages: Math.ceil(totalStores / limit),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store list:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch store list.", error: error.message }),
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
