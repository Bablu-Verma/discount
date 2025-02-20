import mongoose, { Schema, Document, Model } from "mongoose";

const ORDER_STATUSES = ["Redirected", "Completed", "Cancelled"] as const;
const PAYMENT_STATUSES = ["Pending", "Conform", "Paid", "Failed"] as const;

interface IHistory {
  status: string;
  date: Date;
  details: string;
  proof_document?: string;
}

interface IRecord extends Document {
  user_id: mongoose.Types.ObjectId;
  product_id: string;
  product_url: string;
  cashback_amount: number;
  order_status: typeof ORDER_STATUSES[number];
  payment_status: typeof PAYMENT_STATUSES[number];
  history: IHistory[];
  createdAt?: Date;
  updatedAt?: Date;

  updateStatus(newStatus: typeof ORDER_STATUSES[number], details: string, proofDocument?: string): Promise<void>;
  updatePaymentStatus(newStatus: typeof PAYMENT_STATUSES[number], details: string): Promise<void>;
}

// Order Schema
const RecordSchema = new Schema<IRecord>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product_id: {
      type: String,
      required: true,
    },
    product_url: {
      type: String,
      required: true,
    },
    cashback_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    order_status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Redirected",
    },
    payment_status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "Pending",
    },
    history: [
      {
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
        proof_document: { 
          type: String, 
          required: function(this: { status: string }) { 
            return this.status === "Cancelled" || this.status === "Completed"; 
          } 
        },
      },
    ],
  },
  { timestamps: true }
);

// Add a method to update order status and track history
RecordSchema.methods.updateStatus = async function (
  newStatus: typeof ORDER_STATUSES[number],
  details: string,
  proofDocument?: string // Required if order is "Cancelled" or "Completed"
) {
  // Validation: Proof document is required for "Cancelled" and "Completed"
  if ((newStatus === "Cancelled" || newStatus === "Completed") && !proofDocument) {
    throw new Error("Proof document is required for order completion or cancellation.");
  }

  // Create history entry
  const historyEntry: IHistory = { status: newStatus, date: new Date(), details };

  // Attach proof document if required
  if (newStatus === "Cancelled" || newStatus === "Completed") {
    historyEntry.proof_document = proofDocument;
  }

  // Update order status and push to history
  this.order_status = newStatus;
  this.history.push(historyEntry);

  await this.save();
};

// Add a method to update payment status and track history
RecordSchema.methods.updatePaymentStatus = async function (
  newStatus: typeof PAYMENT_STATUSES[number],
  details: string
) {
  this.payment_status = newStatus;
  this.history.push({ status: newStatus, date: new Date(), details });
  await this.save();
};

// Export Model
const RecordModel: Model<IRecord> =
  mongoose.models.Record || mongoose.model<IRecord>("Record", RecordSchema);

export default RecordModel;
