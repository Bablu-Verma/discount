import mongoose, { Schema } from "mongoose";
import { IStore } from "@/model/StoreModel";
import { ICategory } from "@/model/CategoryModel";

export interface ICoupon {
  code: string;
  discount: string;
  description: string;
  expiry_date: Date;
  store: mongoose.Types.ObjectId | IStore;
  category: mongoose.Types.ObjectId | ICategory;
  status: boolean;
  deleted_coupon: boolean;
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
      type: Boolean,
      default: true,
    },
    deleted_coupon: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;
