import mongoose, { Schema, model, models, Types } from "mongoose";

// Interface for Campaign Query
export interface ICampaignQuery {
  user_id: Types.ObjectId; 
  message: string; 
  subject: string; 
  campaign_id: Types.ObjectId; 
  whatsapp_number: string;
  location: string;
  deleted_query: boolean;
  solvequery:boolean
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
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign", 
      required: true,
    },
    whatsapp_number: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    deleted_query: {
      default: false,
      type: Boolean,
    },
    solvequery:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true } 
);

// Create or retrieve the model
const CampaignQueryModel =
  models.CampaignQuery || model<ICampaignQuery>("CampaignQuery", CampaignQuerySchema);

export default CampaignQueryModel;
