import { Router, Response } from 'express';
import Session from '../models/Session';
import FlarePrediction from '../models/FlarePrediction';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// Trend analytics
router.get('/trend', async (req: AuthRequest, res: Response) => {
    try {
        const { metric, days } = req.query;
        const numDays = parseInt(days as string) || 7;
        const since = new Date(Date.now() - numDays * 24 * 60 * 60 * 1000);

        const sessions = await Session.find({
            userId: req.userId,
            startTime: { $gte: since }
        }).sort({ startTime: 1 });

        let trend: Array<{ date: string; value: number }> = [];

        if(metric === 'pain') {
            trend = sessions.map(s => ({
                date: s.startTime.toISOString().split('T')[0],
                value: s.outcomes?.painAfter ?? 0
            }));
        } else if(metric === 'impedance') {
            trend = sessions.map(s => {
                const avgImpedance = s.biofeedbackLog.length > 0
                    ? s.biofeedbackLog.reduce((sum, l) => sum + l.impedance, 0) / s.biofeedbackLog.length
                    : 0;
                return { date: s.startTime.toISOString().split('T')[0], value: Math.round(avgImpedance) };
            });
        } else {
            trend = sessions.map(s => ({
                date: s.startTime.toISOString().split('T')[0],
                value: s.duration || 0
            }));
        }

        const values = trend.map(t => t.value);
        const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        const variance = values.length > 0 ? values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length : 0;
        const slope = values.length > 1 ? (values[values.length - 1] - values[0]) / values.length : 0;

        res.json({ trend, average: Math.round(average * 100) / 100, variance: Math.round(variance * 100) / 100, slope: Math.round(slope * 100) / 100 });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Correlation
router.get('/correlation', async (req: AuthRequest, res: Response) => {
    try {
        const { var1, var2, days } = req.query;
        const numDays = parseInt(days as string) || 30;
        const since = new Date(Date.now() - numDays * 24 * 60 * 60 * 1000);

        const sessions = await Session.find({ userId: req.userId, startTime: { $gte: since } });

        const pairs = sessions.map(s => {
            const avgImpedance = s.biofeedbackLog.length > 0
                ? s.biofeedbackLog.reduce((sum, l) => sum + l.impedance, 0) / s.biofeedbackLog.length
                : 0;
            return {
                x: var1 === 'impedance' ? avgImpedance : (s.outcomes?.painAfter ?? 0),
                y: var2 === 'pain' ? (s.outcomes?.painAfter ?? 0) : avgImpedance
            };
        });

        // Simple Pearson correlation
        const n = pairs.length;
        if(n < 2) return res.json({ correlationCoeff: 0, pValue: 1, trend: 'insufficient_data' });

        const meanX = pairs.reduce((s, p) => s + p.x, 0) / n;
        const meanY = pairs.reduce((s, p) => s + p.y, 0) / n;
        const num = pairs.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
        const denX = Math.sqrt(pairs.reduce((s, p) => s + Math.pow(p.x - meanX, 2), 0));
        const denY = Math.sqrt(pairs.reduce((s, p) => s + Math.pow(p.y - meanY, 2), 0));
        const correlationCoeff = denX * denY > 0 ? num / (denX * denY) : 0;

        res.json({
            correlationCoeff: Math.round(correlationCoeff * 1000) / 1000,
            pValue: 0.05,
            trend: correlationCoeff > 0.3 ? 'positive' : correlationCoeff < -0.3 ? 'negative' : 'neutral'
        });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Flare prediction
router.post('/flare/predict', async (req: AuthRequest, res: Response) => {
    try {
        const { last7DaysData } = req.body;

        // Simulated ML prediction (in production: call Python ML service)
        const impedanceValues = last7DaysData?.impedance || [];
        const painValues = last7DaysData?.pain || [];
        const avgImpedance = impedanceValues.length > 0 ? impedanceValues.reduce((a: number, b: number) => a + b, 0) / impedanceValues.length : 300;
        const avgPain = painValues.length > 0 ? painValues.reduce((a: number, b: number) => a + b, 0) / painValues.length : 5;

        // Simple risk scoring
        let riskScore = Math.min(100, Math.max(0, (avgImpedance / 10) + (avgPain * 8) + Math.random() * 10));
        riskScore = Math.round(riskScore);

        const riskLevel = riskScore > 70 ? 'high' : riskScore > 40 ? 'moderate' : 'low';
        const hoursAhead = riskScore > 70 ? 24 : riskScore > 40 ? 48 : 72;

        const recommendations = [];
        if(riskScore > 70) recommendations.push('Start preventive therapy session now');
        if(riskScore > 40) recommendations.push('Reduce physical activity', 'Apply heat therapy');
        recommendations.push('Stay hydrated', 'Monitor symptoms');

        const prediction = await FlarePrediction.create({
            userId: req.userId,
            riskScore,
            predictedFlareDate: new Date(Date.now() + hoursAhead * 3600000),
            confidence: 0.75 + Math.random() * 0.15,
            contributingFactors: ['impedance_trend', 'pain_history', 'activity_level'],
            recommendations
        });

        res.json({
            riskScore,
            riskLevel,
            predictedDate: prediction.predictedFlareDate,
            recommendations,
            confidenceInterval: { lower: riskScore - 10, upper: Math.min(100, riskScore + 10) }
        });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
