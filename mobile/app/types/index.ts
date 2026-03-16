// TypeScript interfaces for ArthroEase

export interface User {
    id: string;
    email: string;
    profile: UserProfile;
    preferences: UserPreferences;
    devices: PairedDevice[];
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    oaStage: 'mild' | 'moderate' | 'severe';
    height: number;
    weight: number;
    baselineWOMACScore: number;
}

export interface UserPreferences {
    notificationsEnabled: boolean;
    preferredLanguage: string;
    theme: 'light' | 'dark';
    privacyConsent: boolean;
}

export interface PairedDevice {
    deviceId: string;
    pairedAt: string;
    firmwareVersion: string;
    name?: string;
    rssi?: number;
}

export interface BiofeedbackReading {
    timestamp: string;
    impedance: number;
    temperature: number;
    heatIntensity: number;
    vibrationFreq: number;
    heartRate: number;
}

export interface Session {
    _id: string;
    userId: string;
    deviceId: string;
    startTime: string;
    endTime?: string;
    duration: number;
    sessionType: 'manual' | 'auto_adaptive' | 'flare_intervention';
    biofeedbackLog: BiofeedbackReading[];
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

export interface FlarePrediction {
    riskScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
    predictedDate: string;
    confidence: number;
    recommendations: string[];
    contributingFactors: string[];
}

export interface PainLog {
    date: string;
    painScore: number;
    womacScore: WOMACScore;
    activityLevel: string;
    mood: string;
    medicationTaken: boolean;
    medicationType?: string;
    notes: string;
}

export interface WOMACScore {
    pain: number;       // 0-20
    stiffness: number;  // 0-8
    function: number;   // 0-68
    total: number;      // 0-96
}

export interface TrendData {
    trend: Array<{ date: string; value: number }>;
    average: number;
    variance: number;
    slope: number;
}

export interface SessionCreateResponse {
    sessionId: string;
    recommendedDuration: number;
    recommendedIntensity: number;
}

export type RootTabParamList = {
    Home: undefined;
    Session: undefined;
    History: undefined;
    Analytics: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    DeviceConnect: undefined;
    ActiveSession: { sessionId: string };
};
