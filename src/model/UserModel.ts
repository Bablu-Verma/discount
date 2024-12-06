import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  profile?: string;
  password: string;
  phone?: string;
  subscribe_email?: string; 
  accept_terms_conditions_privacy_policy: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  verify_code_expiry: Date;
  verify_code: string;
  role: string;
  address: string;
  dob: Date;
  gender: string;
  deleted_user: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Your name is required"],
    },
    profile: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please add a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
     
    },
    phone: {
      type: String,
      
    },
    subscribe_email: {
      type:String, 
     
    },
    accept_terms_conditions_privacy_policy: {
      type: Boolean,
     
    },
    email_verified: {
      type: Boolean,
      default: false,
      
    },
    phone_verified: {
      type: Boolean,
      default: false,
   
    },
    verify_code: {
      type: String,
     
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      
    },
    address: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    deleted_user: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
