import mongoose, { Schema, Document } from "mongoose";

export interface IWithdrawalRequest extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number;
  upi_id: string;
  status: "WITHDRAWAL_CREATE"|"PENDING" | "APPROVED" | "REJECTED";
  requested_at: Date;
  processed_at: Date | null;
  otp?:number
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
    },
    upi_id: {
      type: String,
      required: true, 
      trim: true,
    },
    status: {
      type: String,
      enum: ["WITHDRAWAL_CREATE","PENDING", "APPROVED", "REJECTED"],
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
    otp:{
      type:Number,
      select: false,
    }
  },
  { timestamps: true }
);

const WithdrawalRequestModel =
  mongoose.models.WithdrawalRequest ||
  mongoose.model<IWithdrawalRequest>("WithdrawalRequest", WithdrawalRequestSchema);

export default WithdrawalRequestModel;
