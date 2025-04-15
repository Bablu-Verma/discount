import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ORDER_STATUSES = ["Redirected", "Order", "Completed", "Cancelled"] as const;
const PAYMENT_STATUSES = ["Pending", "Confirmed", "Failed"] as const;

interface IHistory {
  status: string;
  date: Date;
  details: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  store_id: mongoose.Types.ObjectId;
  price: number;
  offer_price: number;
  cashback_rate: number;
  calculated_cashback: number;
  calculation_mode: "PERCENTAGE" | "FIX";
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
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Store",
      index: true,
    },
   
    transaction_id: {
      type: String,
      unique: true,
      default: uuidv4,
      required: true,
    },
    price: { type: Number, required: true },
    calculated_cashback: { type: Number, required: true },
    cashback_rate: { type: Number, required: true }, 
    calculation_mode: {
      type: String,
      enum: ["PERCENTAGE", "FIX"],
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

// ✅ Auto-push initial order history on creation
OrderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.order_history.push({
      status: this.order_status,
      date: new Date(),
      details: `Order created with status ${this.order_status}`,
    });
  }
  next();
});

const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
