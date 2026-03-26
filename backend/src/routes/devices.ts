import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();
router.use(authMiddleware);

// Register device
router.post('/pair', async (req: AuthRequest, res: Response) => {
    try {
        const { deviceId, firmwareVersion } = req.body;
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({ error: 'User not found' });

        const existingIdx = user.devices.findIndex(d => d.deviceId === deviceId);
        if(existingIdx >= 0) {
            user.devices[existingIdx].firmwareVersion = firmwareVersion;
        } else {
            user.devices.push({ deviceId, pairedAt: new Date(), firmwareVersion: firmwareVersion || '1.0.0' });
        }
        await user.save();
        res.json({ success: true, devices: user.devices });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// List devices
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).select('devices');
        res.json(user?.devices || []);
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Community tips
router.get('/community/tips', async (_req: AuthRequest, res: Response) => {
    res.json([
        { id: 1, title: 'Morning Stretches', description: 'Gentle knee bends help reduce morning stiffness', category: 'exercise' },
        { id: 2, title: 'Heat Before Activity', description: 'Apply heat therapy 15 min before walking', category: 'therapy' },
        { id: 3, title: 'Track Your Triggers', description: 'Weather changes and stress can increase flare-ups', category: 'awareness' },
        { id: 4, title: 'Stay Active', description: 'Low-impact exercises like swimming help maintain mobility', category: 'exercise' },
        { id: 5, title: 'Hydration Matters', description: 'Drink 8 glasses of water daily for joint health', category: 'nutrition' }
    ]);
});

export default router;
