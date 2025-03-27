import mongoose, { Schema, Document } from "mongoose";

export interface IConformAmount extends Document {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  amount: Number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ConformAmountSchema = new Schema<IConformAmount>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    amount: {
      type: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserUPIModel =
  mongoose.models.UserUPI ||
  mongoose.model<IConformAmount>("ConformAmount", ConformAmountSchema);

export default UserUPIModel;
