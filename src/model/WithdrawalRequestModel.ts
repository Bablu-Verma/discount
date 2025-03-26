import mongoose, { Schema, Document } from "mongoose";

export interface IWithdrawalRequest extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number;
  upi_id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requested_at: Date;
  processed_at: Date | null;
  transaction_id:string,
  order_id: mongoose.Types.ObjectId
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transaction_id:{
      type: String,
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Record",
    },
    amount: {
      type: Number,
      required: true,
      min: 1, // Minimum withdrawal amount
    },
    upi_id: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    requested_at: {
      type: Date,
      default: Date.now,
    },
    processed_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const WithdrawalRequestModel =
  mongoose.models.WithdrawalRequest ||
  mongoose.model<IWithdrawalRequest>("WithdrawalRequest", WithdrawalRequestSchema);

export default WithdrawalRequestModel;
