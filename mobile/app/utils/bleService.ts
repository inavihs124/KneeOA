import { BiofeedbackReading } from '../types';

// Simulated BLE service for development
// In production: use react-native-ble-plx

const ARTHROEASE_SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const IMPEDANCE_CHAR_UUID = '12345678-1234-1234-1234-123456789abd';
const TEMP_CHAR_UUID = '12345678-1234-1234-1234-123456789abe';
const COMMAND_CHAR_UUID = '12345678-1234-1234-1234-123456789abf';

type BLEListener = (reading: BiofeedbackReading) => void;
let listeners: BLEListener[] = [];
let simulationInterval: NodeJS.Timeout | null = null;
let connected = false;

// Generate realistic simulated biofeedback data
const generateReading = (): BiofeedbackReading => {
    const baseImpedance = 300 + Math.sin(Date.now() / 10000) * 100;
    const noise = (Math.random() - 0.5) * 40;
    return {
        timestamp: new Date().toISOString(),
        impedance: Math.round(baseImpedance + noise),
        temperature: 36.5 + Math.random() * 2.5,
        heatIntensity: 50 + Math.random() * 30,
        vibrationFreq: 80 + Math.random() * 60,
        heartRate: 65 + Math.random() * 20
    };
};

export const bleService = {
    isConnected: () => connected,

    scanDevices: async (): Promise<Array<{ id: string; name: string; rssi: number }>> => {
        // Simulate scanning delay
        await new Promise(r => setTimeout(r, 2000));
        return [
            { id: 'AA:BB:CC:DD:EE:FF', name: 'ArthroEase-K1', rssi: -45 },
            { id: 'AA:BB:CC:DD:EE:01', name: 'ArthroEase-K2', rssi: -62 }
        ];
    },

    connect: async (deviceId: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 1500));
        connected = true;
        return true;
    },

    disconnect: async (): Promise<void> => {
        connected = false;
        bleService.stopMonitoring();
    },

    startMonitoring: (callback: BLEListener) => {
        listeners.push(callback);
        if(!simulationInterval) {
            simulationInterval = setInterval(() => {
                const reading = generateReading();
                listeners.forEach(cb => cb(reading));
            }, 500); // 500ms updates as specified
        }
    },

    stopMonitoring: () => {
        if(simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        listeners = [];
    },

    sendCommand: async (command: { heat: number; vibration: number }): Promise<boolean> => {
        // In production: write to BLE characteristic
        console.log(`[BLE] Command sent: heat=${command.heat}, vibration=${command.vibration}`);
        return true;
    }
};
