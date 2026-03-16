import { Router, Response } from 'express';
import Session from '../models/Session';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate, sessionCreateSchema, biofeedbackLogSchema, sessionEndSchema } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// Create session
router.post('/create', validate(sessionCreateSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { sessionType, painBefore, notes } = req.body;
        const session = await Session.create({
            userId: req.userId,
            sessionType,
            startTime: new Date(),
            outcomes: { painBefore },
            feedback: { notes: notes || '' }
        });
        res.status(201).json({
            sessionId: session._id,
            recommendedDuration: sessionType === 'flare_intervention' ? 30 : 20,
            recommendedIntensity: sessionType === 'flare_intervention' ? 80 : 60
        });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Log biofeedback during session
router.post('/:id/log-biofeedback', validate(biofeedbackLogSchema), async (req: AuthRequest, res: Response) => {
    try {
        const session = await Session.findById(req.params.id);
        if(!session) return res.status(404).json({ error: 'Session not found' });

        session.biofeedbackLog.push({
            timestamp: new Date(),
            impedance: req.body.impedance,
            temperature: req.body.temperature,
            heatIntensity: req.body.heatIntensity || 0,
            vibrationFreq: req.body.vibrationFreq || 0,
            heartRate: req.body.heartRate || 0
        });
        await session.save();

        // Simple adaptive recommendation
        const lastImpedance = req.body.impedance;
        let adjustmentRecommendation = 'maintain';
        if(lastImpedance > 500) adjustmentRecommendation = 'increase_heat';
        else if(lastImpedance < 200) adjustmentRecommendation = 'decrease_heat';

        res.json({ success: true, adjustmentRecommendation });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// End session
router.post('/:id/end', validate(sessionEndSchema), async (req: AuthRequest, res: Response) => {
    try {
        const session = await Session.findById(req.params.id);
        if(!session) return res.status(404).json({ error: 'Session not found' });

        session.endTime = new Date();
        session.duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000);
        session.outcomes.painAfter = req.body.painAfter;
        session.outcomes.effortRating = req.body.effortRating;
        session.feedback.effectiveness = req.body.effectivenessRating;
        if(req.body.notes) session.feedback.notes = req.body.notes;
        await session.save();

        const painReduction = session.outcomes.painBefore - session.outcomes.painAfter;
        res.json({
            sessionSummary: {
                duration: session.duration,
                painReduction,
                effectiveness: session.feedback.effectiveness,
                dataPoints: session.biofeedbackLog.length
            },
            nextRecommendation: painReduction > 2 ? 'Continue current therapy' : 'Consider adjusting intensity'
        });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// List sessions
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const { timeRange, limit } = req.query;
        const days = parseInt(timeRange as string) || 30;
        const maxResults = parseInt(limit as string) || 20;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const sessions = await Session.find({ userId: req.userId, startTime: { $gte: since } })
            .sort({ startTime: -1 })
            .limit(maxResults)
            .select('startTime endTime duration sessionType outcomes feedback');

        res.json(sessions);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
