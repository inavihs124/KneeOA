import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    AUTH_TOKEN: '@arthroease_token',
    USER_DATA: '@arthroease_user',
    PAIRED_DEVICE: '@arthroease_device',
    PAIN_LOGS: '@arthroease_pain_logs',
    SESSIONS: '@arthroease_sessions',
    SETTINGS: '@arthroease_settings'
};

export const storage = {
    // Auth
    saveToken: (token: string) => AsyncStorage.setItem(KEYS.AUTH_TOKEN, token),
    getToken: () => AsyncStorage.getItem(KEYS.AUTH_TOKEN),
    removeToken: () => AsyncStorage.removeItem(KEYS.AUTH_TOKEN),

    // User
    saveUser: (user: any) => AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user)),
    getUser: async () => {
        const data = await AsyncStorage.getItem(KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    },

    // Device
    savePairedDevice: (device: any) => AsyncStorage.setItem(KEYS.PAIRED_DEVICE, JSON.stringify(device)),
    getPairedDevice: async () => {
        const data = await AsyncStorage.getItem(KEYS.PAIRED_DEVICE);
        return data ? JSON.parse(data) : null;
    },

    // Pain Logs
    savePainLog: async (log: any) => {
        const existing = await storage.getPainLogs();
        existing.push(log);
        await AsyncStorage.setItem(KEYS.PAIN_LOGS, JSON.stringify(existing));
    },
    getPainLogs: async () => {
        const data = await AsyncStorage.getItem(KEYS.PAIN_LOGS);
        return data ? JSON.parse(data) : [];
    },

    // Clear
    clearAll: () => AsyncStorage.multiRemove(Object.values(KEYS))
};
