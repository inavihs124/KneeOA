import { useState, useEffect, useCallback, useRef } from 'react';
import { bleService } from '../utils/bleService';
import { BiofeedbackReading } from '../types';

interface BLEDevice {
    id: string;
    name: string;
    rssi: number;
}

export const useBLE = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [devices, setDevices] = useState<BLEDevice[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
    const [currentReading, setCurrentReading] = useState<BiofeedbackReading | null>(null);
    const [readings, setReadings] = useState<BiofeedbackReading[]>([]);
    const readingsRef = useRef<BiofeedbackReading[]>([]);

    const scan = useCallback(async () => {
        setIsScanning(true);
        try {
            const found = await bleService.scanDevices();
            setDevices(found);
        } catch(err) {
            console.error('Scan failed:', err);
        } finally {
            setIsScanning(false);
        }
    }, []);

    const connect = useCallback(async (device: BLEDevice) => {
        try {
            const success = await bleService.connect(device.id);
            if(success) {
                setIsConnected(true);
                setConnectedDevice(device);
            }
            return success;
        } catch(err) {
            console.error('Connect failed:', err);
            return false;
        }
    }, []);

    const disconnect = useCallback(async () => {
        await bleService.disconnect();
        setIsConnected(false);
        setConnectedDevice(null);
        setCurrentReading(null);
    }, []);

    const startMonitoring = useCallback(() => {
        readingsRef.current = [];
        setReadings([]);
        bleService.startMonitoring((reading) => {
            setCurrentReading(reading);
            readingsRef.current = [...readingsRef.current.slice(-120), reading]; // Keep last 60s (120 × 500ms)
            setReadings([...readingsRef.current]);
        });
    }, []);

    const stopMonitoring = useCallback(() => {
        bleService.stopMonitoring();
    }, []);

    const sendCommand = useCallback(async (heat: number, vibration: number) => {
        return bleService.sendCommand({ heat, vibration });
    }, []);

    useEffect(() => {
        return () => { bleService.stopMonitoring(); };
    }, []);

    return {
        isScanning, isConnected, devices, connectedDevice,
        currentReading, readings,
        scan, connect, disconnect,
        startMonitoring, stopMonitoring, sendCommand
    };
};
