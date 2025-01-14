import mongoose, { Schema } from "mongoose";
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose);

// Define the interface for the Campaign model
export interface ICampaign {
  _id: string;
  user_email: string;
  title: string;
  price: string;
  offer_price: string;
  cashback: string;
  campaign_id: number;
  category: string;
  description: string;
  img: Array<string>;
  new: boolean;
  featured: boolean;
  add_poster: boolean;
  arrival: boolean;
  hot: boolean;
  active: boolean;
  tc: string; 
  created_at: Date;
  review: number;
  start_date: Date; 
  end_date: Date; 
  slug: string; 
  discount_percentage: number; 
  tags: string; 
  meta_title: string; 
  meta_description: string; 
  meta_keywords: string; 
  deleted_campaign: boolean;
  brand: string;
  banner: boolean;
  banner_img:string
  expire_time: Date | null;
  createdAt:string,
  calculation_type:string
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    cashback: {
      type: String,
      required: [true, "Cashback is required"],
    },
    user_email:{
      type: String,
      required: [true, "email is required"],
    },
    offer_price: {
      type: String,
      required: [true, "Offer price is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    img: {
      type: [String],
      required: [true, "Images are required"],
    },
    new: {
      type: Boolean,
      default: false,
    },
    add_poster: {
      type: Boolean,
      default: false,
    },
    banner_img:{
      type: String,
    },
    arrival: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    calculation_type:{
      type: String,
      required: [true, "Calculation type is required"],
    },
    hot: {
      type: Boolean,
      default: false,
    },
    tc: {
      type: String,
      required: [true, "Terms and conditions are required"],
    },     
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    tags: {
      type: String,
    },
    meta_title: {
      type: String,
      required: [true, "Meta title is required"],
    },
    meta_description: {
      type: String,
      required: [true, "Meta description is required"],
    },
    meta_keywords: {
      type: String,
      required: [true, "Meta keywords are required"],
    },
    campaign_id: { 
      type: Number 
    },
    banner: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
      required: [true, "Active status is required"],
    },
    deleted_campaign: {
      type: Boolean,
      default: false,
    },
    expire_time: { 
      type: Date, 
      default: null 
    },
    
  },
  { timestamps: true }
);

CampaignSchema.plugin(AutoIncrement, { inc_field: "campaign_id", start_seq: 100 });

const CampaignModel = mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default CampaignModel;
