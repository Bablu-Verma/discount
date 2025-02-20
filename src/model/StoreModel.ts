import mongoose, { Schema } from "mongoose";

export interface IStore {
  name: string; 
  description: string; 
  slug: string; 
  status: boolean;
  img: string;
  deleted_store: boolean;
}


const StoreSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      unique: true, 
      trim: true, 
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true, 
      lowercase: true,
      trim: true,
    },
    img: {
      type: String,
      required: [true, "Image is required"],
    },
   
    status: {
      type: Boolean,
      default: true, 
    },
    deleted_store: {
      type: Boolean,
      default: false,  
    }
  },
  { timestamps: true } 
);

const StoreModel = mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default StoreModel;
