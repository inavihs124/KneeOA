import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import analyticsRoutes from './routes/analytics';
import deviceRoutes from './routes/devices';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', apiLimiter);

// Routes
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ArthroEase API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/devices', deviceRoutes);

// Error handler
app.use(errorHandler);

// Database & Start
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arthroease';
        await mongoose.connect(mongoUri);
        logger.info('Connected to MongoDB');

        app.listen(PORT, () => {
            logger.info(`ArthroEase API running on port ${PORT}`);
        });
    } catch(err) {
        logger.error('Failed to start server:', err);
        // Start without DB for development
        app.listen(PORT, () => {
            logger.warn(`ArthroEase API running on port ${PORT} (no database)`);
        });
    }
};

startServer();

export default app;
