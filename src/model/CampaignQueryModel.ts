import mongoose, { Schema, model, models, Types } from "mongoose";

// Enum for Query Status
export type QueryStatus = "NOTSTART" | "OPEN" | "CLOSED" | "REMOVED";

// Interface for Campaign Query
export interface ICampaignQuery {
  user_id: Types.ObjectId;
  message: string;
  subject: string;
  product_id:Number;
  number: Number;
  location: string;
  query_status: QueryStatus;
}

const CampaignQuerySchema = new Schema<ICampaignQuery>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    product_id: {
      type: Number,
      ref: "Campaign",
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    query_status: {
      type: String,
      default: "NOTSTART",
      enum: ["NOTSTART", "OPEN", "CLOSED", "REMOVED"],
    },
  },
  { timestamps: true }
);

// Create or retrieve the model
const CampaignQueryModel =
  models.CampaignQuery || model<ICampaignQuery>("CampaignQuery", CampaignQuerySchema);

export default CampaignQueryModel;
