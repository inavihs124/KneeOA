import axios from 'axios';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const callFlarePredictor = async (userData: any) => {
    try {
        const response = await axios.post(`${ML_URL}/predict`, userData, { timeout: 5000 });
        return response.data;
    } catch(err) {
        console.warn('ML service unavailable, using fallback prediction');
        return null;
    }
};

export const callTherapyOptimizer = async (sessionData: any) => {
    try {
        const response = await axios.post(`${ML_URL}/optimize`, sessionData, { timeout: 5000 });
        return response.data;
    } catch(err) {
        console.warn('ML optimizer unavailable, using defaults');
        return { heatIntensity: 60, vibrationFreq: 100, duration: 20 };
    }
};
