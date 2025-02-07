import mongoose, { Schema, Document } from "mongoose";

interface IOrder  {
  user_id: mongoose.Schema.Types.ObjectId; 
  campaigns: number[]; 
}

const OrderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, 
      required: [true, "User ID is required"],
      ref: "User", 
    },
    campaigns: {
      type: [Number], 
      required: [true, "Campaign list is required"],
    },
  },
  { timestamps: true } 
);

const OrderModel =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
