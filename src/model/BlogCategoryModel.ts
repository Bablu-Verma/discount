import mongoose, { Schema } from "mongoose";

export interface IBCategory {
  name: string; 
  description: string; 
  slug: string; 
  status: boolean;
  img: string;
  deleted_category:boolean;
}

// Create the Category schema
const BlogCategorySchema = new Schema<IBCategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true, 
      trim: true, 
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true, 
      lowercase: true,
      trim: true,
    },
    img:{
        type: String,
        required: [true, "Image is required"],
    },
    status: {
        type: Boolean,
        default: true, 
      },
      deleted_category: {
        type: Boolean,
        default: false,  
      }
  },
  { timestamps: true } 
);


const BlogCategoryModel = mongoose.models.BlogCategory || mongoose.model<IBCategory>("BlogCategory", BlogCategorySchema);

export default BlogCategoryModel;
