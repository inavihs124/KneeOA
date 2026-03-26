import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if(error) {
            const errors = error.details.map(d => d.message);
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        next();
    };
};

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().integer().min(18).max(120).required(),
    gender: Joi.string().required(),
    oaStage: Joi.string().valid('mild', 'moderate', 'severe').required(),
    height: Joi.number().optional(),
    weight: Joi.number().optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const sessionCreateSchema = Joi.object({
    sessionType: Joi.string().valid('manual', 'auto_adaptive', 'flare_intervention').default('manual'),
    painBefore: Joi.number().min(0).max(10).required(),
    notes: Joi.string().allow('').optional()
});

export const biofeedbackLogSchema = Joi.object({
    impedance: Joi.number().required(),
    temperature: Joi.number().required(),
    heatIntensity: Joi.number().min(0).max(100).optional(),
    vibrationFreq: Joi.number().min(0).max(200).optional(),
    heartRate: Joi.number().optional()
});

export const sessionEndSchema = Joi.object({
    painAfter: Joi.number().min(0).max(10).required(),
    effortRating: Joi.number().min(1).max(5).required(),
    effectivenessRating: Joi.number().min(1).max(5).required(),
    notes: Joi.string().allow('').optional()
});
