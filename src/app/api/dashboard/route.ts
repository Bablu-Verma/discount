import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel, { ICategory } from "@/model/CategoryModel";


import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogModel from "@/model/BlogModal";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";
import UserModel from "@/model/UserModel";
import RecordModel from "@/model/OrderModel";
import ContactUsModel from "@/model/ContactUsModel";
import ClaimFormModel from "@/model/ClaimForm";
import CampaignQueryModel from "@/model/CampaignQueryModel";


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
 
    // Only allow 'admin', 'data_editor', or 'blog_editor'
    const allowedRoles = ["admin", "data_editor", "blog_editor"] ;
    if (!allowedRoles.includes(usertype)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: Does not have the required role",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    if(usertype === 'admin') {
      const user = await UserModel.find();
      const order=  await RecordModel.find();
      const contactus = await ContactUsModel.find();
      const clain_form = await ClaimFormModel.find()
      const campaign_query_form = await CampaignQueryModel.find();
      const blog = await BlogModel.find();
      const category = await CategoryModel.find();
      const store = await StoreModel.find()
      const coupon = await CouponModel.find();
      const product = await CampaignModel.find({})
    
    
     
  

    } else if(usertype === 'blog_editor') {
      
    } else if(usertype === 'data_editor') {

    } else{
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: Does not have the required role",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
 
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to get dashboard data ", error.message);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Failed to get dashboard data.",
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
          message: "An unexpected error occurred.",
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
