import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const ORDER_STATUSES = ["Redirected", "Order", "Completed", "Cancelled"] as const;
const PAYMENT_STATUSES = ["Pending", "confirm", "Paid", "Failed"] as const;

interface IHistory {
  status: string;
  date: Date;
  details: string;
  proof_document?: string;
}

interface IRecord extends Document {
  user_id: mongoose.Types.ObjectId;
  product_id: string;
  product_url: string;
  price: Number;
  offer_price: Number;
  cashback_: Number;
  calculated_cashback: Number;
  calculation_mode: "PERCENTAGE" | "FIX";
  transaction_id: string;
  order_status: (typeof ORDER_STATUSES)[number];
  payment_status: (typeof PAYMENT_STATUSES)[number] | null;
  order_history: IHistory[];
  payment_history: IHistory[];
  createdAt?: Date;
  updatedAt?: Date;
  payment_proof:string[] ;
}

// Order Schema
const RecordSchema = new Schema<IRecord>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    product_id: {
      type: String,
      required: true,
      index: true,
    },
    product_url: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
      unique: true,  
      default: uuidv4,
      required: true,
    },
    price: { type: Number, required: [true, "Price is required"] },
    offer_price: { type: Number, required: [true, "Offer price is required"] },
    calculated_cashback:{
      type: Number,
      required: [true, "Calculated Cashback is required"],
    },
    calculation_mode: {
      type: String,
      enum: ["PERCENTAGE", "FIX"],
      required: [true, "Calculation mode is required"],
    },
    cashback_: {
      type: Number,
      required: [true, "Cashback is required"],
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
    payment_proof: {
      type: [String], 
      validate: {
        validator: function (val: string[]) {
          return Array.isArray(val) && val.length > 0;
        },
        message: "At least one proof image is required.",
      },
      required: function () {
        return this.payment_status === "Paid"; 
      },
    },

    order_history: [
      {
        status: {
          type: String,
          required: true,
          enum: ORDER_STATUSES,
        },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
       
      },
    ],
    payment_history: [
      {
        status: {
          type: String,
          required: true,
          enum: PAYMENT_STATUSES,
        },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
        
      },
    ],
  },
  { timestamps: true }
);

// Middleware to track history and auto-set payment status
RecordSchema.pre("save", function (next) {
  if (this.isNew) {
    this.order_history.push({
      status: this.order_status,
      date: new Date(),
      details: `Order created with status ${this.order_status}`,
    });

  }
  next();
});


const RecordModel: Model<IRecord> =
  mongoose.models.Record || mongoose.model<IRecord>("Record", RecordSchema);

export default RecordModel;
