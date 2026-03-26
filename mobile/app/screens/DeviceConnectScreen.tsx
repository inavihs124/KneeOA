import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useBLE } from '../hooks/useBLE';

interface Props { navigation: any; }

const DeviceConnectScreen: React.FC<Props> = ({ navigation }) => {
    const { isScanning, isConnected, devices, connectedDevice, scan, connect, disconnect } = useBLE();
    const [connecting, setConnecting] = useState<string | null>(null);

    useEffect(() => { scan(); }, []);

    const handleConnect = async (device: { id: string; name: string; rssi: number }) => {
        setConnecting(device.id);
        const success = await connect(device);
        setConnecting(null);
        if(success) {
            // Could navigate back or show success
        }
    };

    const getSignalStrength = (rssi: number) => {
        if(rssi > -50) return { label: 'Excellent', color: '#00E5A0', bars: 4 };
        if(rssi > -60) return { label: 'Good', color: '#4ECDC4', bars: 3 };
        if(rssi > -70) return { label: 'Fair', color: '#FFD93D', bars: 2 };
        return { label: 'Weak', color: '#FF6B6B', bars: 1 };
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Connect Device</Text>
                <Text style={styles.subtitle}>Find and pair your ArthroEase wearable</Text>
            </View>

            {/* Connected Device */}
            {isConnected && connectedDevice && (
                <View style={styles.connectedCard}>
                    <View style={styles.connectedHeader}>
                        <Text style={styles.connectedIcon}>✅</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.connectedName}>{connectedDevice.name}</Text>
                            <Text style={styles.connectedId}>{connectedDevice.id}</Text>
                        </View>
                        <TouchableOpacity style={styles.disconnectBtn} onPress={disconnect}>
                            <Text style={styles.disconnectText}>Disconnect</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.deviceStats}>
                        <View style={styles.deviceStat}>
                            <Text style={styles.deviceStatValue}>v1.0.0</Text>
                            <Text style={styles.deviceStatLabel}>Firmware</Text>
                        </View>
                        <View style={styles.deviceStat}>
                            <Text style={styles.deviceStatValue}>85%</Text>
                            <Text style={styles.deviceStatLabel}>Battery</Text>
                        </View>
                        <View style={styles.deviceStat}>
                            <Text style={styles.deviceStatValue}>Active</Text>
                            <Text style={styles.deviceStatLabel}>Status</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Scan Button */}
            <TouchableOpacity style={styles.scanButton} onPress={scan} disabled={isScanning}>
                {isScanning ? (
                    <><ActivityIndicator color="#0A1628" size="small" /><Text style={styles.scanText}>Scanning...</Text></>
                ) : (
                    <><Text style={styles.scanIcon}>📡</Text><Text style={styles.scanText}>Scan for Devices</Text></>
                )}
            </TouchableOpacity>

            {/* Device List */}
            {devices.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Available Devices</Text>
                    {devices.map(device => {
                        const signal = getSignalStrength(device.rssi);
                        const isThisConnecting = connecting === device.id;
                        return (
                            <TouchableOpacity key={device.id} style={styles.deviceCard}
                                onPress={() => !isConnected && handleConnect(device)} disabled={isConnected || isThisConnecting}>
                                <View style={styles.deviceInfo}>
                                    <Text style={styles.deviceIcon}>🦿</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.deviceName}>{device.name}</Text>
                                        <Text style={styles.deviceId}>{device.id}</Text>
                                    </View>
                                    <View style={styles.signalContainer}>
                                        <View style={styles.signalBars}>
                                            {[1, 2, 3, 4].map(bar => (
                                                <View key={bar} style={[styles.signalBar, { height: 6 + bar * 4, backgroundColor: bar <= signal.bars ? signal.color : '#1E3A5F' }]} />
                                            ))}
                                        </View>
                                        <Text style={[styles.signalLabel, { color: signal.color }]}>{signal.label}</Text>
                                    </View>
                                </View>
                                {isThisConnecting && (
                                    <View style={styles.connectingRow}>
                                        <ActivityIndicator color="#00E5A0" size="small" />
                                        <Text style={styles.connectingText}>Connecting...</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </>
            )}

            {/* Help Text */}
            <View style={styles.helpCard}>
                <Text style={styles.helpTitle}>💡 Tips</Text>
                <Text style={styles.helpText}>• Make sure your device is powered on</Text>
                <Text style={styles.helpText}>• Keep your phone within 3 meters</Text>
                <Text style={styles.helpText}>• Enable Bluetooth in system settings</Text>
                <Text style={styles.helpText}>• Device name starts with "ArthroEase"</Text>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { padding: 24, paddingTop: 60 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    subtitle: { fontSize: 15, color: '#8899AA', marginTop: 4 },
    connectedCard: { backgroundColor: '#0A2E1A', marginHorizontal: 24, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#00E5A0' },
    connectedHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    connectedIcon: { fontSize: 24 },
    connectedName: { fontSize: 18, fontWeight: '700', color: '#00E5A0' },
    connectedId: { fontSize: 12, color: '#66BB99', marginTop: 2 },
    disconnectBtn: { backgroundColor: '#1E3A5F', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    disconnectText: { color: '#FF6B6B', fontWeight: '600', fontSize: 13 },
    deviceStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1E5A3F' },
    deviceStat: { alignItems: 'center' },
    deviceStatValue: { fontSize: 16, fontWeight: '700', color: '#FFF' },
    deviceStatLabel: { fontSize: 12, color: '#66BB99', marginTop: 2 },
    scanButton: { backgroundColor: '#00E5A0', marginHorizontal: 24, marginTop: 20, borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    scanIcon: { fontSize: 20 },
    scanText: { fontSize: 16, fontWeight: '700', color: '#0A1628' },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', paddingHorizontal: 24, marginTop: 24, marginBottom: 12 },
    deviceCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#1E3A5F' },
    deviceInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    deviceIcon: { fontSize: 28 },
    deviceName: { fontSize: 16, fontWeight: '600', color: '#FFF' },
    deviceId: { fontSize: 12, color: '#8899AA', marginTop: 2 },
    signalContainer: { alignItems: 'center' },
    signalBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
    signalBar: { width: 4, borderRadius: 2 },
    signalLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
    connectingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1E3A5F' },
    connectingText: { color: '#00E5A0', fontSize: 14 },
    helpCard: { backgroundColor: '#12233D', marginHorizontal: 24, marginTop: 24, borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1E3A5F' },
    helpTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12 },
    helpText: { fontSize: 14, color: '#8899AA', marginBottom: 6 }
});

export default DeviceConnectScreen;
