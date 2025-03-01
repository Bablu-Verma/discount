import mongoose, { Schema, Document } from "mongoose";
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose);



export interface IStore extends Document {
  name: string;
  description: string;
  slug: string;
  store_id?: number; 
  store_img: string;
  cashback_status: "ACTIVE_CASHBACK" | "INACTIVE_CASHBACK";
  store_link: string;
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT";
  cashback_amount?: string;
  store_status: "ACTIVE" | "INACTIVE" | "REMOVED";
}

const StoreSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      unique: true,
      trim: true,
    },
    store_id: {
      type: Number,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    store_img: {
      type: String,
      required: [true, "Image is required"],
    },
    cashback_status: {
      type: String,
      default: "ACTIVE_CASHBACK",
      enum: ["ACTIVE_CASHBACK", "INACTIVE_CASHBACK"],
    },
    store_link: {
      type: String,
      required: true,
    },
    cashback_type: {
      type: String,
      enum: ["PERCENTAGE", "FLAT_AMOUNT"],
      required: true,
    },
    cashback_amount: {
      type: String,
    },
    store_status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "REMOVED"],
    },
   
  },
  { timestamps: true }
);

StoreSchema.plugin(AutoIncrement, {
  inc_field: "store_id",
  start_seq: 1,
});

const StoreModel =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default StoreModel;
