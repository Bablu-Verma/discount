import mongoose, { Schema, Document, Model } from "mongoose";

// Define Claim Statuses
const CLAIM_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

// Define ClaimForm Interface
interface IClaimForm extends Document {
  user_id: mongoose.Types.ObjectId;
  order_id: Schema.Types.ObjectId;
  transaction_id:string;
  reason: string;
  supporting_documents: string[]; 
  status: typeof CLAIM_STATUSES[number]; 
  partner_site_orderid: string;
  partner_site_order_status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define ClaimForm Schema
const ClaimFormSchema = new Schema<IClaimForm>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Record",
    },
    transaction_id:{
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: [10, "Reason must be at least 10 characters long"],
    },
    supporting_documents: {
      type: [String],
      validate: {
        validator: function (val: string[]) {
          return Array.isArray(val) && val.length > 0;
        },
        message: "At least one supporting document is required.",
      },
      required: true,
    },
    partner_site_orderid: {
      type: String,
      required: true,
      trim: true,
    },
    partner_site_order_status: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: CLAIM_STATUSES, // ✅ Correctly enforces allowed values
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Export ClaimForm Model
const ClaimFormModel: Model<IClaimForm> =
  mongoose.models.ClaimForm || mongoose.model<IClaimForm>("ClaimForm", ClaimFormSchema);

export default ClaimFormModel;
