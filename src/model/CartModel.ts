import mongoose, { Schema, model, models, Types } from "mongoose";

export interface ICartItem {
  campaign_id: Types.ObjectId;
}

interface ICart {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  items: ICartItem[];
}

const CartItemSchema = new Schema({
  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
});

const CartSchema = new Schema<ICart>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

const CartModel = models.Cart || model("Cart", CartSchema);

export default CartModel;
