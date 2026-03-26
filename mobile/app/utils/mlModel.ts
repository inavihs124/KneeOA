// TensorFlow.js edge ML model stub
// In production: load converted Keras model via @tensorflow/tfjs

interface TherapyParams {
    heatIntensity: number;  // 0-100
    vibrationFreq: number;  // 0-200 Hz
    sessionDuration: number; // minutes
}

interface FlareRisk {
    riskScore: number;     // 0-100
    riskLevel: 'low' | 'moderate' | 'high';
    hoursAhead: number;
    recommendation: string;
}

// Simple heuristic model (replace with TF.js in production)
export const mlModel = {
    predictTherapyParams: (input: {
        impedance: number;
        temp: number;
        heartRate: number;
        timeOfDay: number;
        prevPainScore: number;
    }): TherapyParams => {
        const { impedance, temp, heartRate, prevPainScore } = input;

        // Higher impedance = more inflammation = more heat needed
        let heatIntensity = Math.min(100, Math.max(0, (impedance - 200) / 4 + prevPainScore * 5));
        // Lower vibration for higher pain
        let vibrationFreq = Math.min(200, Math.max(0, 150 - prevPainScore * 10));
        // Longer sessions for higher pain
        let sessionDuration = Math.min(45, Math.max(10, 15 + prevPainScore * 2));

        // Temperature adjustment
        if(temp > 38) { heatIntensity *= 0.7; }

        // Heart rate adjustment
        if(heartRate > 90) { vibrationFreq *= 0.8; }

        return {
            heatIntensity: Math.round(heatIntensity),
            vibrationFreq: Math.round(vibrationFreq),
            sessionDuration: Math.round(sessionDuration)
        };
    },

    predictFlareRisk: (data: {
        impedanceTrend: number[];
        painHistory: number[];
        activityLevel: number;
        sleepQuality: number;
        weatherPressure: number;
    }): FlareRisk => {
        const { impedanceTrend, painHistory, activityLevel, sleepQuality, weatherPressure } = data;

        // Features
        const avgImpedance = impedanceTrend.reduce((a, b) => a + b, 0) / (impedanceTrend.length || 1);
        const impedanceSlope = impedanceTrend.length > 1
            ? (impedanceTrend[impedanceTrend.length - 1] - impedanceTrend[0]) / impedanceTrend.length
            : 0;
        const avgPain = painHistory.reduce((a, b) => a + b, 0) / (painHistory.length || 1);
        const painTrend = painHistory.length > 1
            ? (painHistory[painHistory.length - 1] - painHistory[0]) / painHistory.length
            : 0;

        // Weighted risk score
        let risk = 0;
        risk += Math.max(0, (avgImpedance - 250) / 5);   // weight: impedance
        risk += Math.max(0, impedanceSlope * 10);           // weight: rising impedance
        risk += avgPain * 6;                                 // weight: pain history
        risk += Math.max(0, painTrend * 15);                // weight: worsening pain
        risk += Math.max(0, (5 - activityLevel) * 3);       // weight: inactivity
        risk += Math.max(0, (5 - sleepQuality) * 4);        // weight: poor sleep
        risk += Math.max(0, (1013 - weatherPressure) * 0.5); // weight: low pressure

        const riskScore = Math.min(100, Math.max(0, Math.round(risk)));
        const riskLevel = riskScore > 70 ? 'high' : riskScore > 40 ? 'moderate' : 'low';
        const hoursAhead = riskScore > 70 ? 24 : riskScore > 40 ? 48 : 72;

        const recommendations: Record<string, string> = {
            high: 'Start preventive therapy session now. Flare-up likely within 24h.',
            moderate: 'Consider a gentle therapy session. Monitor symptoms closely.',
            low: 'Continue normal activities. Keep tracking your symptoms.'
        };

        return { riskScore, riskLevel, hoursAhead, recommendation: recommendations[riskLevel] };
    }
};
