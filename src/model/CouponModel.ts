import mongoose, { Schema, model, Types } from "mongoose";
import { IStore } from "@/model/StoreModel";
import { ICategory } from "@/model/CategoryModel";

export type CouponStatus = "ACTIVE" | "INACTIVE" | "REMOVED";

export interface ICoupon {
  code: string;
  discount: string;
  description: string;
  expiry_date: Date;
  store: Types.ObjectId | IStore;
  category: Types.ObjectId | ICategory;
  status: CouponStatus;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      trim: true,
    },
    discount: {
      type: String,
      required: [true, "Discount value is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    expiry_date: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "REMOVED"],
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.models.Coupon || model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;
