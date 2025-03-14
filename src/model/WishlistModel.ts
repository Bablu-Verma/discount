import mongoose, { Schema, Document } from "mongoose";

interface IWishlist extends Document {
  user_id: mongoose.Schema.Types.ObjectId; 
  campaigns: number[]; 
}

const WishlistSchema = new Schema<IWishlist>(
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

const WishlistModel =
  mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default WishlistModel;
