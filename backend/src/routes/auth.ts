import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, age, gender, oaStage, height, weight } = req.body;
        const existing = await User.findOne({ email });
        if(existing) return res.status(400).json({ error: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({
            email,
            passwordHash,
            profile: { firstName, lastName, age, gender, oaStage, height, weight, baselineWOMACScore: 0 },
            preferences: { notificationsEnabled: true, preferredLanguage: 'en', theme: 'light', privacyConsent: true }
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.status(201).json({ token, userId: user._id, message: 'Registration successful' });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', authLimiter, validate(loginSchema), async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                profile: user.profile,
                preferences: user.preferences
            }
        });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({ error: 'No token' });
        const oldToken = authHeader.split(' ')[1];
        const decoded = jwt.verify(oldToken, process.env.JWT_SECRET || 'secret') as { userId: string };
        const token = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token });
    } catch(err: any) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
