import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useBLE } from '../hooks/useBLE';
import { mlModel } from '../utils/mlModel';
import SessionTimer from '../components/SessionTimer';
import PainScaleInput from '../components/PainScaleInput';

interface Props { navigation: any; }

const SCREEN_W = Dimensions.get('window').width;

const SessionScreen: React.FC<Props> = ({ navigation }) => {
    const { isConnected, currentReading, readings, startMonitoring, stopMonitoring, sendCommand } = useBLE();
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionMode, setSessionMode] = useState<'manual' | 'auto_adaptive' | 'flare_intervention'>('auto_adaptive');
    const [painBefore, setPainBefore] = useState(5);
    const [painAfter, setPainAfter] = useState(5);
    const [showEndForm, setShowEndForm] = useState(false);
    const [elapsedSec, setElapsedSec] = useState(0);
    const [therapyParams, setTherapyParams] = useState({ heat: 60, vibration: 100 });

    // Start session
    const startSession = () => {
        setSessionActive(true);
        setShowEndForm(false);
        setElapsedSec(0);
        startMonitoring();
    };

    // End session
    const endSession = () => {
        stopMonitoring();
        setShowEndForm(true);
    };

    const confirmEnd = () => {
        setSessionActive(false);
        setShowEndForm(false);
        Alert.alert('Session Complete', `Pain: ${painBefore} → ${painAfter}\nDuration: ${Math.round(elapsedSec / 60)} min`);
    };

    // Adaptive therapy logic
    useEffect(() => {
        if(sessionActive && currentReading && sessionMode === 'auto_adaptive') {
            const params = mlModel.predictTherapyParams({
                impedance: currentReading.impedance,
                temp: currentReading.temperature,
                heartRate: currentReading.heartRate,
                timeOfDay: new Date().getHours(),
                prevPainScore: painBefore
            });
            setTherapyParams({ heat: params.heatIntensity, vibration: params.vibrationFreq });
            sendCommand(params.heatIntensity, params.vibrationFreq);
        }
    }, [currentReading, sessionActive]);

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if(sessionActive && !showEndForm) {
            timer = setInterval(() => setElapsedSec(s => s + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [sessionActive, showEndForm]);

    // Chart data
    const chartData = readings.length > 5 ? {
        labels: readings.slice(-20).map(() => ''),
        datasets: [
            { data: readings.slice(-20).map(r => r.impedance), color: () => '#00E5A0', strokeWidth: 2 },
            { data: readings.slice(-20).map(r => r.temperature * 10), color: () => '#FF6B6B', strokeWidth: 2 }
        ]
    } : null;

    const getZoneColor = (impedance: number) => {
        if(impedance < 250) return '#00E5A0';
        if(impedance < 400) return '#FFD93D';
        return '#FF6B6B';
    };

    if(showEndForm) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}><Text style={styles.title}>Session Complete</Text></View>
                <View style={styles.endCard}>
                    <Text style={styles.endTitle}>How's your pain now?</Text>
                    <PainScaleInput value={painAfter} onChange={setPainAfter} />
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{Math.round(elapsedSec / 60)} min</Text>
                            <Text style={styles.summaryLabel}>Duration</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{readings.length}</Text>
                            <Text style={styles.summaryLabel}>Data Points</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: painAfter < painBefore ? '#00E5A0' : '#FF6B6B' }]}>
                                {painBefore - painAfter > 0 ? '-' : '+'}{Math.abs(painBefore - painAfter)}
                            </Text>
                            <Text style={styles.summaryLabel}>Pain Change</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={confirmEnd}>
                        <Text style={styles.buttonText}>Save & Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Therapy Session</Text>
            </View>

            {!sessionActive ? (
                <View style={styles.setupCard}>
                    <Text style={styles.setupTitle}>Set Up Session</Text>

                    <Text style={styles.label}>Pain Level (Before)</Text>
                    <PainScaleInput value={painBefore} onChange={setPainBefore} />

                    <Text style={styles.label}>Session Mode</Text>
                    <View style={styles.modeRow}>
                        {(['manual', 'auto_adaptive', 'flare_intervention'] as const).map(mode => (
                            <TouchableOpacity key={mode} style={[styles.modeBtn, sessionMode === mode && styles.modeBtnActive]}
                                onPress={() => setSessionMode(mode)}>
                                <Text style={[styles.modeBtnText, sessionMode === mode && styles.modeBtnTextActive]}>
                                    {mode === 'auto_adaptive' ? '🤖 Auto' : mode === 'flare_intervention' ? '🔥 Flare' : '✋ Manual'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.startBtn} onPress={startSession}>
                        <Text style={styles.startBtnText}>▶ Start Session</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* Timer & Controls */}
                    <SessionTimer seconds={elapsedSec} mode={sessionMode} />

                    {/* Live Readings */}
                    {currentReading && (
                        <View style={styles.liveCard}>
                            <Text style={styles.liveTitle}>Live Biofeedback</Text>
                            <View style={styles.readingsRow}>
                                <View style={styles.readingBox}>
                                    <Text style={styles.readingLabel}>Impedance</Text>
                                    <Text style={[styles.readingValue, { color: getZoneColor(currentReading.impedance) }]}>
                                        {currentReading.impedance} Ω
                                    </Text>
                                </View>
                                <View style={styles.readingBox}>
                                    <Text style={styles.readingLabel}>Temperature</Text>
                                    <Text style={styles.readingValue}>{currentReading.temperature.toFixed(1)}°C</Text>
                                </View>
                                <View style={styles.readingBox}>
                                    <Text style={styles.readingLabel}>Heart Rate</Text>
                                    <Text style={styles.readingValue}>{Math.round(currentReading.heartRate)} bpm</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Therapy Parameters */}
                    <View style={styles.therapyCard}>
                        <Text style={styles.therapyTitle}>🤖 AI Therapy Parameters</Text>
                        <View style={styles.paramRow}>
                            <View style={styles.paramItem}>
                                <Text style={styles.paramValue}>{therapyParams.heat}%</Text>
                                <Text style={styles.paramLabel}>Heat</Text>
                                <View style={[styles.paramBar, { width: `${therapyParams.heat}%`, backgroundColor: '#FF6B6B' }]} />
                            </View>
                            <View style={styles.paramItem}>
                                <Text style={styles.paramValue}>{therapyParams.vibration} Hz</Text>
                                <Text style={styles.paramLabel}>Vibration</Text>
                                <View style={[styles.paramBar, { width: `${therapyParams.vibration / 2}%`, backgroundColor: '#4ECDC4' }]} />
                            </View>
                        </View>
                    </View>

                    {/* Chart */}
                    {chartData && (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>📊 Real-Time Graph</Text>
                            <LineChart
                                data={chartData}
                                width={SCREEN_W - 48}
                                height={200}
                                chartConfig={{
                                    backgroundColor: '#12233D',
                                    backgroundGradientFrom: '#12233D',
                                    backgroundGradientTo: '#12233D',
                                    decimalCount: 0,
                                    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                                    labelColor: () => '#8899AA',
                                    propsForDots: { r: '2' }
                                }}
                                bezier
                                style={{ borderRadius: 12 }}
                                withInnerLines={false}
                            />
                            <View style={styles.legendRow}>
                                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#00E5A0' }]} /><Text style={styles.legendText}>Impedance (Ω)</Text></View>
                                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} /><Text style={styles.legendText}>Temp (×10 °C)</Text></View>
                            </View>
                        </View>
                    )}

                    {/* End Button */}
                    <TouchableOpacity style={styles.endBtn} onPress={endSession}>
                        <Text style={styles.endBtnText}>⏹ End Session</Text>
                    </TouchableOpacity>
                </>
            )}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { padding: 24, paddingTop: 60 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    setupCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1E3A5F' },
    setupTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 20 },
    label: { color: '#8899AA', fontSize: 14, marginBottom: 8, marginTop: 16 },
    modeRow: { flexDirection: 'row', gap: 8 },
    modeBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#0A1628', borderWidth: 1, borderColor: '#1E3A5F', alignItems: 'center' },
    modeBtnActive: { backgroundColor: '#00E5A0', borderColor: '#00E5A0' },
    modeBtnText: { color: '#8899AA', fontWeight: '600', fontSize: 13 },
    modeBtnTextActive: { color: '#0A1628' },
    startBtn: { backgroundColor: '#00E5A0', borderRadius: 14, padding: 20, alignItems: 'center', marginTop: 24 },
    startBtnText: { color: '#0A1628', fontSize: 18, fontWeight: '700' },
    liveCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: '#1E3A5F' },
    liveTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    readingsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    readingBox: { alignItems: 'center', flex: 1 },
    readingLabel: { fontSize: 12, color: '#8899AA', marginBottom: 4 },
    readingValue: { fontSize: 20, fontWeight: '700', color: '#FFF' },
    therapyCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#1E3A5F' },
    therapyTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    paramRow: { gap: 16 },
    paramItem: { marginBottom: 8 },
    paramValue: { fontSize: 18, fontWeight: '700', color: '#00E5A0' },
    paramLabel: { fontSize: 12, color: '#8899AA', marginBottom: 4 },
    paramBar: { height: 6, borderRadius: 3, marginTop: 4 },
    chartContainer: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 1, borderColor: '#1E3A5F' },
    chartTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12 },
    legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: '#8899AA' },
    endBtn: { backgroundColor: '#FF6B6B', marginHorizontal: 24, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 20 },
    endBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    endCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1E3A5F' },
    endTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#1E3A5F' },
    summaryItem: { alignItems: 'center' },
    summaryValue: { fontSize: 22, fontWeight: '700', color: '#FFF' },
    summaryLabel: { fontSize: 12, color: '#8899AA', marginTop: 4 },
    button: { backgroundColor: '#00E5A0', borderRadius: 14, padding: 18, alignItems: 'center' },
    buttonText: { color: '#0A1628', fontSize: 18, fontWeight: '700' }
});

export default SessionScreen;
