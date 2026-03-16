// Fully simulated API client — no backend required
// All calls return mock data after a short delay

let authToken: string | null = null;

export const setToken = (token: string) => { authToken = token; };
export const getToken = () => authToken;

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const mockUser = {
    id: 'usr_001',
    email: 'demo@arthroease.com',
    profile: {
        firstName: 'Akash', lastName: 'Sundar', age: 25,
        gender: 'male', oaStage: 'moderate', height: 175, weight: 72,
        baselineWOMACScore: 42
    }
};

export const api = {
    // Auth
    register: async (data: any) => {
        await delay(800);
        const token = 'sim_token_' + Date.now();
        return { token, user: { ...mockUser, email: data.email, profile: { ...mockUser.profile, firstName: data.firstName, lastName: data.lastName } } };
    },
    login: async (data: { email: string; password: string }) => {
        await delay(800);
        const token = 'sim_token_' + Date.now();
        return { token, user: { ...mockUser, email: data.email } };
    },

    // Sessions
    createSession: async (_data: any) => {
        await delay(300);
        return { sessionId: 'ses_' + Date.now(), recommendedDuration: 20, recommendedIntensity: 65 };
    },
    logBiofeedback: async (_sessionId: string, _data: any) => {
        await delay(100);
        return { ok: true };
    },
    endSession: async (_sessionId: string, _data: any) => {
        await delay(300);
        return { ok: true, painReduction: 2 };
    },
    getSessions: async (_timeRange = 30, _limit = 20) => {
        await delay(400);
        return {
            sessions: [
                { _id: 's1', startTime: new Date(Date.now() - 86400000).toISOString(), duration: 22, sessionType: 'auto_adaptive', outcomes: { painBefore: 6, painAfter: 3 } },
                { _id: 's2', startTime: new Date(Date.now() - 172800000).toISOString(), duration: 18, sessionType: 'manual', outcomes: { painBefore: 5, painAfter: 4 } },
                { _id: 's3', startTime: new Date(Date.now() - 259200000).toISOString(), duration: 25, sessionType: 'flare_intervention', outcomes: { painBefore: 8, painAfter: 5 } }
            ]
        };
    },

    // Analytics
    getTrend: async (metric: string, _days = 7) => {
        await delay(400);
        const data = metric === 'pain'
            ? [6, 5, 5, 4, 5, 3, 4]
            : [340, 320, 350, 310, 330, 290, 300];
        return { trend: data.map((v, i) => ({ date: `Day ${i + 1}`, value: v })), average: data.reduce((a, b) => a + b) / data.length, slope: -0.3 };
    },
    getCorrelation: async (_var1: string, _var2: string, _days = 30) => {
        await delay(300);
        return { correlation: 0.72, pValue: 0.001 };
    },
    predictFlare: async (_data: any) => {
        await delay(500);
        return { riskScore: 45, riskLevel: 'moderate', recommendations: ['Consider a gentle therapy session'] };
    },

    // Devices
    pairDevice: async (_deviceId: string) => {
        await delay(500);
        return { ok: true };
    },
    getDevices: async () => {
        await delay(300);
        return { devices: [{ deviceId: 'AA:BB:CC:DD:EE:FF', name: 'ArthroEase-K1', pairedAt: new Date().toISOString() }] };
    },

    // Community
    getTips: async () => {
        await delay(300);
        return { tips: ['Stretch gently before therapy', 'Stay hydrated', 'Track your pain daily'] };
    }
};
