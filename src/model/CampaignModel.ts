import mongoose, { Schema } from "mongoose";
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose); 


// Define the interface for the Campaign model
interface ICampaign  {
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
  hot: boolean;
  active: boolean;
  tc: string; 
  created_at: Date;
  review: number;
  start_date: Date; 
  end_date: Date; 
  slug: string; 
  discount_percentage: number; 
  tags: Array<string>; 
  meta_title: string; 
  meta_description: string; 
  meta_keywords: string; 
  deleted_campaign:boolean
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
    offer_price: {
      type: String,
      required: [true, "Offer price is required"],
    },
    cashback: {
      type: String,
      required: [true, "Cashback is required"],
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
    featured: {
      type: Boolean,
      default: false,
    },
    hot: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
      required: [true, "Active status is required"],
    },
    tc: {
      type: String,
      required: [true, "Terms and conditions are required"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    review: {
      type: Number,
      default: 0,
    },
    start_date: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end_date: {
      type: Date,
      required: [true, "End date is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    discount_percentage: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
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
    campaign_id: { type: Number },
    deleted_campaign: { 
      default: false,
      type: Boolean 
    }
  },
  { timestamps: true }
);


CampaignSchema.plugin(AutoIncrement, { inc_field: "campaign_id",start_seq: 100 });

const CampaignModel =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default CampaignModel;
