import mongoose, { Schema, model, Types, Document } from "mongoose";

export interface ILiveDeal extends Document {
    title: string;
    price: string;
    source: string;
    image: string;
    client_id: string;
    create_date: Date;
    real_price?: string | null;
}

const LiveDealSchema = new Schema<ILiveDeal>(
    {
        title: { type: String, required: true },
        price: { type: String, required: true },
        source: { type: String, required: true },
        image: { type: String, required: true },
        client_id: { type: String, required: true },
        create_date: { type: Date, required: true, default: Date.now },
        real_price: { type: String, required: false, default: null },
    },
    { timestamps: true }
);


const LiveDealModel = mongoose.models.LiveDeal || model<ILiveDeal>("LiveDeal", LiveDealSchema);

export default LiveDealModel;
