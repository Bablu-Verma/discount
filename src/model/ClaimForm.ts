import mongoose, { Schema, Document, Model } from "mongoose";

// Define Claim Statuses
const CLAIM_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

// Define Claim History Interface
interface IClaimHistory {
  status: (typeof CLAIM_STATUSES)[number];
  date: Date;
  details: string;
  reviewed_by?: mongoose.Types.ObjectId; 
}

// Define ClaimForm Interface
interface IClaimForm extends Document {
  user_id: mongoose.Types.ObjectId;
  order_id: string;
  reason: string;
  supporting_documents: string[]; 
  status: (typeof CLAIM_STATUSES)[number];
  claim_history: IClaimHistory[];
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
      type: String,
      required: true,
      index: true,
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
    status: {
      type: String,
      enum: CLAIM_STATUSES,
      default: "PENDING",
    },
    claim_history: [
      {
        status: {
          type: String,
          enum: CLAIM_STATUSES,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        details: {
          type: String,
          required: true,
        },
      },
    ],
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
  },
  { timestamps: true }
);

// Export ClaimForm Model
const ClaimFormModel: Model<IClaimForm> =
  mongoose.models.ClaimForm || mongoose.model<IClaimForm>("ClaimForm", ClaimFormSchema);

export default ClaimFormModel;
