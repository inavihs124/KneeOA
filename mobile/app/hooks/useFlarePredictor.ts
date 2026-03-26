import { useState, useEffect, useCallback } from 'react';
import { mlModel } from '../utils/mlModel';
import { FlarePrediction } from '../types';

export const useFlarePredictor = () => {
    const [prediction, setPrediction] = useState<FlarePrediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const predict = useCallback(async (data: {
        impedanceTrend: number[];
        painHistory: number[];
        activityLevel: number;
        sleepQuality: number;
        weatherPressure?: number;
    }) => {
        setIsLoading(true);
        try {
            const result = mlModel.predictFlareRisk({
                impedanceTrend: data.impedanceTrend,
                painHistory: data.painHistory,
                activityLevel: data.activityLevel,
                sleepQuality: data.sleepQuality,
                weatherPressure: data.weatherPressure || 1013
            });

            const pred: FlarePrediction = {
                riskScore: result.riskScore,
                riskLevel: result.riskLevel,
                predictedDate: new Date(Date.now() + result.hoursAhead * 3600000).toISOString(),
                confidence: 0.78,
                recommendations: [result.recommendation],
                contributingFactors: ['impedance_trend', 'pain_history', 'activity_level']
            };
            setPrediction(pred);
            return pred;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { prediction, isLoading, predict };
};
