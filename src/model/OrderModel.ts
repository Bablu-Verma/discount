import mongoose, { Schema, Document, Model } from "mongoose";

const ORDER_STATUSES = [
  "Redirected",
  "Order",
  "Completed",
  "Cancelled",
] as const;
const PAYMENT_STATUSES = ["Pending", "Confirmed", "Failed"] as const;

interface IHistory {
  status: string;
  date: Date;
  details: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  store_id: mongoose.Types.ObjectId;
  redirect_url: string;
  order_create:Date;
  order_value?: number | null;
  cashback_rate: number;
  cashback?: number | null;
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT";
  transaction_id: string;
  order_status: (typeof ORDER_STATUSES)[number];
  payment_status: (typeof PAYMENT_STATUSES)[number] | null;
  order_history: IHistory[];
  payment_history: IHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    order_create:{
      type:Date,
      default: Date.now
    },
    redirect_url: {
      type: String,
    },
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Store",
      index: true,
    },
    transaction_id: {
      type: String,
      unique: true,
      required: true,
    },
    order_value: { type: Number, default: null, required: false },
    cashback: { type: Number, default: null, required: false },
    cashback_rate: { type: Number, required: true },
    cashback_type: {
      type: String,
      enum: ["PERCENTAGE", "FLAT_AMOUNT"],
      required: true,
    },
    order_status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Redirected",
    },
    payment_status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: null,
    },
    order_history: [
      {
        status: { type: String, enum: ORDER_STATUSES, required: true },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
      },
    ],
    payment_history: [
      {
        status: { type: String, enum: PAYMENT_STATUSES, required: true },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);


const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
