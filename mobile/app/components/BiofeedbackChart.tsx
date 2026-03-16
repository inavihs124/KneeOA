import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BiofeedbackReading } from '../types';

const W = Dimensions.get('window').width;

interface Props { readings: BiofeedbackReading[]; }

const BiofeedbackChart: React.FC<Props> = ({ readings }) => {
    if(readings.length < 3) {
        return <View style={s.card}><Text style={s.waiting}>Collecting data...</Text></View>;
    }

    const recent = readings.slice(-20);
    const data = {
        labels: recent.map(() => ''),
        datasets: [
            { data: recent.map(r => r.impedance), color: () => '#00E5A0', strokeWidth: 2 },
            { data: recent.map(r => r.temperature * 10), color: () => '#FF6B6B', strokeWidth: 2 }
        ]
    };

    return (
        <View style={s.card}>
            <Text style={s.title}>📊 Biofeedback</Text>
            <LineChart data={data} width={W - 72} height={180}
                chartConfig={{ backgroundColor: '#12233D', backgroundGradientFrom: '#12233D', backgroundGradientTo: '#12233D', decimalCount: 0, color: (o = 1) => `rgba(255,255,255,${o})`, labelColor: () => '#8899AA', propsForDots: { r: '2' } }}
                bezier style={{ borderRadius: 12 }} withInnerLines={false} />
            <View style={s.legend}>
                <View style={s.legendItem}><View style={[s.dot, { backgroundColor: '#00E5A0' }]} /><Text style={s.legendText}>Impedance (Ω)</Text></View>
                <View style={s.legendItem}><View style={[s.dot, { backgroundColor: '#FF6B6B' }]} /><Text style={s.legendText}>Temperature (×10°C)</Text></View>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    card: { backgroundColor: '#12233D', borderRadius: 16, padding: 16, marginHorizontal: 24, marginTop: 12, borderWidth: 1, borderColor: '#1E3A5F' },
    title: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 12 },
    waiting: { color: '#8899AA', textAlign: 'center', paddingVertical: 40 },
    legend: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: '#8899AA' }
});

export default BiofeedbackChart;
