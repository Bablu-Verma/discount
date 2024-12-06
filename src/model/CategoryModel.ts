import mongoose, { Schema } from "mongoose";

interface ICategory {
  name: string; 
  description: string; 
  slug: string; 
  status: boolean;
  img: string;
  font_awesome_class: string;  // Font Awesome class for category icon
  deleted_category:boolean;
}

// Create the Category schema
const CategorySchema = new Schema<ICategory>(
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
    font_awesome_class:{
        type: String,
        required: [true, "Font Awesome class is required"],
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


const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
