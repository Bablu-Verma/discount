import mongoose, { Schema } from 'mongoose';

interface IBlog {
  title: string;
  slug: string;
  short_desc: string;
  category: string;
  blogType: string; 
  isPublished: boolean;   
  image?: string;  
  readTime: number;  
  excerpt?: string;
}


const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'slug is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    short_desc: {
      type: String,
      required: [true, 'short_desc is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    blogType: {
        type: String,
        required: [true, 'Blog type is required'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String, 
    },
    readTime: {
      type: Number,  
      required: true,
    },
    excerpt: {
      type: String, 
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
  },
  { timestamps: true }  
);

const BlogModel = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default BlogModel;
