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
  transaction_id: string; 
  cashback_amount: number;
  order_status: (typeof ORDER_STATUSES)[number];
  payment_status: (typeof PAYMENT_STATUSES)[number] | null;
  order_history: IHistory[];
  payment_history: IHistory[];
  createdAt?: Date;
  updatedAt?: Date;
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
      required: true,
    },
    cashback_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    order_status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Redirected",
    },
    payment_status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: null, // Initially null
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
        proof_document: { type: String },
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
        proof_document: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to track history and auto-set payment status
RecordSchema.pre("save", function (next) {
  if (this.isNew) {
     // ✅ Generate a unique transaction ID using UUID
     this.transaction_id = uuidv4();
     
    // Add initial order history
    this.order_history.push({
      status: this.order_status,
      date: new Date(),
      details: `Order created with status ${this.order_status}`,
    });

    // Set payment status to "Pending" only if the order is placed
    if (this.order_status === "Order") {
      this.payment_status = "Pending";
      this.payment_history.push({
        status: "Pending",
        date: new Date(),
        details: `Payment status set to Pending as order is placed`,
      });
    }
  } else {
    if (this.isModified("order_status")) {
      this.order_history.push({
        status: this.order_status,
        date: new Date(),
        details: `Order status changed to ${this.order_status}`,
      });

      // Set payment to "Pending" only if order is placed and no previous payment status exists
      if (this.order_status === "Order" && !this.payment_status) {
        this.payment_status = "Pending";
        this.payment_history.push({
          status: "Pending",
          date: new Date(),
          details: `Payment status set to Pending as order is placed`,
        });
      }
    }

    // Log payment status changes
    if (this.isModified("payment_status") && this.payment_status) {
      this.payment_history.push({
        status: this.payment_status,
        date: new Date(),
        details: `Payment status changed to ${this.payment_status}`,
      });
    }
  }
  next();
});


const RecordModel: Model<IRecord> =
  mongoose.models.Record || mongoose.model<IRecord>("Record", RecordSchema);

export default RecordModel;
