import mongoose, { Schema, Document } from 'mongoose';

export interface IBiofeedbackLog extends Document {
    userId: mongoose.Types.ObjectId;
    deviceId: string;
    timestamp: Date;
    impedance: number;
    temperature: number;
    gait_accel: number[];
    weatherData: {
        temperature: number;
        humidity: number;
        pressure: number;
    };
    activityData: {
        steps: number;
        heartRate: number;
    };
}

const BiofeedbackLogSchema = new Schema<IBiofeedbackLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deviceId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    impedance: { type: Number, required: true },
    temperature: { type: Number, required: true },
    gait_accel: [{ type: Number }],
    weatherData: {
        temperature: Number,
        humidity: Number,
        pressure: Number
    },
    activityData: {
        steps: Number,
        heartRate: Number
    }
}, { timestamps: true });

BiofeedbackLogSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model<IBiofeedbackLog>('BiofeedbackLog', BiofeedbackLogSchema);
