import { blogType } from '@/constant';
import mongoose, { Schema, Document, model } from 'mongoose';
import slugify from 'slugify';

export interface IBlog extends Document {
  title: string;
  slug: string;
  short_desc: string;
  desc: string;
  category: string;
  blogType: string;
  isPublished: boolean;
  image?: string;
  writer_email: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  tags?: string[];
  views: number;
  publishedAt?: Date;
  updatedAt?: Date;
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
      trim: true,
      unique: true,
    },
    short_desc: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    blogType: {
      type: String,
      required: [true, 'Blog type is required'],
      enum: blogType,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: [true, 'Blog image is required'],
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [150, 'Meta title cannot exceed 150 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Meta description cannot exceed 300 characters'],
    },
    metaKeywords: {
      type: [String], // Array of keywords
      validate: {
        validator: function (keywords: string[]) {
          return keywords.length <= 10; // Limit to 10 keywords
        },
        message: 'You can specify up to 10 meta keywords.',
      },
    },
    ogImage: {
      type: String, // Open Graph Image for social media
      validate: {
        validator: function (value: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(value);
        },
        message: 'OG image URL must be valid.',
      },
    },
    twitterImage: {
      type: String, // Twitter-specific image
      validate: {
        validator: function (value: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(value);
        },
        message: 'Twitter image URL must be valid.',
      },
    },
    tags: {
      type: [String], 
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 15; 
        },
        message: 'You can specify up to 15 tags.',
      },
    },
    views: {
      type: Number,
      default: 0,
    },
   
    writer_email: {
      type: String,
      required: [true, 'Writer email is required'],
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Writer email must be a valid email address.',
      },
    },
    publishedAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes
BlogSchema.index({ title: 1, category: 1 });
BlogSchema.index({ tags: 1 }); 

// Hooks
BlogSchema.pre('save', function (next) {
  // Auto-generate slug from title if not provided
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Set publishedAt date if the blog is being published
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  this.updatedAt = new Date(); // Update the updatedAt field
  next();
});

const BlogModel = mongoose.models.Blog || model<IBlog>('Blog', BlogSchema);

export default BlogModel;
