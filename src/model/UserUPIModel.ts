import mongoose, { Schema, Document } from "mongoose";

export interface IUserUPI extends Document {
  user_id: mongoose.Types.ObjectId;
  user_email: string;
  upi_link_bank_name: string;
  upi_holder_name_aspr_upi: string;
  upi_id: string;
  status: "ACTIVE" | "INACTIVE";
  otp_history: { otp: number; generated_at: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserUPISchema = new Schema<IUserUPI>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    upi_link_bank_name: {
      type: String,
      trim: true,
      required: true,
    },
    upi_holder_name_aspr_upi: {
      type: String,
      trim: true,
      required: true,
    },
    upi_id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "INACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    otp_history: [
      {
        otp: { type: Number, required: true },
        generated_at: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

const UserUPIModel =
  mongoose.models.UserUPI || mongoose.model<IUserUPI>("UserUPI", UserUPISchema);

export default UserUPIModel;
