import mongoose, { Schema } from "mongoose";
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose);

interface ICampaign {
  title: string;
  actual_price: string;
  offer_price: string;
  cashback_between: string;
  user_email: string;
  store: string;
  category: string;
  description: string;
  redirect_url: string;
  img_array: string[];
  product_tags?: ("new" | "hot" | "best" | "fast selling")[];
  log_poster: { is_active: boolean; image: string }[];
  main_banner: { is_active: boolean; image: string }[];
  premium_product: { is_active: boolean; image: string }[];
  flash_sale: { is_active: boolean; image: string; end_time: string }[];
  calculation_mode: "PERCENTAGE" | "FIX";
  t_and_c: string;
  product_slug: string;
  slug_type: "INTERNAL" | "EXTERNAL";
  tags?: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  meta_robots?: "index, follow" | "noindex, nofollow";
  canonical_url?: string;
  structured_data?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  product_id?: number;
  product_status: "ACTIVE" | "PAUSE" | "DELETE";
  createdAt?: Date;
  updatedAt?: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: [true, "Title is required"] },
    actual_price: { type: String, required: [true, "Price is required"] },
    offer_price: { type: String, required: [true, "Offer price is required"] },
    cashback_between: {
      type: String,
      required: [true, "Cashback is required"],
    },
    user_email: { type: String, required: [true, "Email is required"] },
    store: { type: String, required: [true, "Store is required"] },
    category: { type: String, required: [true, "Category is required"] },
    description: { type: String, required: [true, "Description is required"] },
    redirect_url: { type: String, required: [true, "Client URL is required"] },
    img_array: { type: [String], required: [true, "Images are required"] },

    product_tags: {
      type: [String],
      enum: ["new", "hot", "best", "fast selling"],
      default: [],
    },

    log_poster: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String },
        },
      ],
      default: [],
      validate: {
        validator: function (value: { is_active: boolean; image: string }[]) {
          return value.every((item) => !item.is_active || !!item.image);
        },
        message: "Image is required when log_poster is active",
      },
    },

    main_banner: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String },
        },
      ],
      default: [],
      validate: {
        validator: function (value: { is_active: boolean; image: string }[]) {
          return value.every((item) => !item.is_active || !!item.image);
        },
        message: "Image is required when main_banner is active",
      },
    },

    premium_product: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String },
        },
      ],
      default: [],
      validate: {
        validator: function (value: { is_active: boolean; image: string }[]) {
          return value.every((item) => !item.is_active || !!item.image);
        },
        message: "Image is required when premium_product is active",
      },
    },

    flash_sale: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String },
          end_time: { type: String },
        },
      ],
      default: [],
      validate: {
        validator: function (
          value: { is_active: boolean; image: string; end_time: string }[]
        ) {
          return value.every(
            (item) =>
              !item.is_active || (!!item.image && !!item.end_time)
          );
        },
        message:
          "Image and end_time are required when flash_sale is active",
      },
    },

    calculation_mode: {
      type: String,
      enum: ["PERCENTAGE", "FIX"],
      required: [true, "Calculation mode is required"],
    },

    t_and_c: {
      type: String,
      required: [true, "Terms and conditions are required"],
    },

    product_slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },

    slug_type: {
      type: String,
      enum: ["INTERNAL", "EXTERNAL"],
      default: "INTERNAL",
    },

    meta_title: { type: String, required: [true, "Meta title is required"] },

    meta_description: {
      type: String,
      required: [true, "Meta description is required"],
    },

    meta_keywords: {
      type: [String],
      required: [true, "Meta keywords are required"],
    },

    meta_robots: { type: String, enum: ["index, follow", "noindex, nofollow"] },

    canonical_url: { type: String },

    structured_data: { type: String },

    og_image: { type: String },

    og_title: { type: String },

    og_description: { type: String },

    product_id: { type: Number },

    product_status: {
      type: String,
      enum: ["ACTIVE", "PAUSE", "DELETE"],
      default: "ACTIVE",
      required: [true, "Product status is required"],
    },
  },
  { timestamps: true }
);

CampaignSchema.plugin(AutoIncrement, {
  inc_field: "product_id",
  start_seq: 100,
});

const CampaignModel =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default CampaignModel;
