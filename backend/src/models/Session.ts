import mongoose, { Schema, Document } from 'mongoose';

export interface IBiofeedbackEntry {
    timestamp: Date;
    impedance: number;
    temperature: number;
    heatIntensity: number;
    vibrationFreq: number;
    heartRate: number;
}

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    deviceId: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    sessionType: 'manual' | 'auto_adaptive' | 'flare_intervention';
    biofeedbackLog: IBiofeedbackEntry[];
    outcomes: {
        painBefore: number;
        painAfter: number;
        effortRating: number;
        activityAfter: string;
    };
    feedback: {
        effectiveness: number;
        notes: string;
    };
}

const SessionSchema = new Schema<ISession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deviceId: { type: String },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    sessionType: { type: String, enum: ['manual', 'auto_adaptive', 'flare_intervention'], default: 'manual' },
    biofeedbackLog: [{
        timestamp: { type: Date, default: Date.now },
        impedance: Number,
        temperature: Number,
        heatIntensity: Number,
        vibrationFreq: Number,
        heartRate: Number
    }],
    outcomes: {
        painBefore: { type: Number, min: 0, max: 10 },
        painAfter: { type: Number, min: 0, max: 10 },
        effortRating: { type: Number, min: 1, max: 5 },
        activityAfter: String
    },
    feedback: {
        effectiveness: { type: Number, min: 1, max: 5 },
        notes: String
    }
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);
