import mongoose, { Schema, Document } from 'mongoose';

export interface IFlarePrediction extends Document {
    userId: mongoose.Types.ObjectId;
    predictionDate: Date;
    riskScore: number;
    predictedFlareDate: Date;
    confidence: number;
    contributingFactors: string[];
    recommendations: string[];
    actedUpon: boolean;
    actualFlareOccurred: boolean;
}

const FlarePredictionSchema = new Schema<IFlarePrediction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    predictionDate: { type: Date, default: Date.now },
    riskScore: { type: Number, min: 0, max: 100, required: true },
    predictedFlareDate: { type: Date },
    confidence: { type: Number, min: 0, max: 1 },
    contributingFactors: [{ type: String }],
    recommendations: [{ type: String }],
    actedUpon: { type: Boolean, default: false },
    actualFlareOccurred: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IFlarePrediction>('FlarePrediction', FlarePredictionSchema);
