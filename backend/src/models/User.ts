import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        gender: string;
        oaStage: 'mild' | 'moderate' | 'severe';
        height: number;
        weight: number;
        baselineWOMACScore: number;
    };
    devices: Array<{
        deviceId: string;
        pairedAt: Date;
        firmwareVersion: string;
    }>;
    preferences: {
        notificationsEnabled: boolean;
        preferredLanguage: string;
        theme: string;
        privacyConsent: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        oaStage: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
        height: { type: Number },
        weight: { type: Number },
        baselineWOMACScore: { type: Number, default: 0 }
    },
    devices: [{
        deviceId: { type: String },
        pairedAt: { type: Date, default: Date.now },
        firmwareVersion: { type: String }
    }],
    preferences: {
        notificationsEnabled: { type: Boolean, default: true },
        preferredLanguage: { type: String, default: 'en' },
        theme: { type: String, default: 'light' },
        privacyConsent: { type: Boolean, default: false }
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
