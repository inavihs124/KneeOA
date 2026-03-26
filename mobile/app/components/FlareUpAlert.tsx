import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlarePrediction } from '../types';

interface Props { prediction: FlarePrediction; onAction: () => void; }

const FlareUpAlert: React.FC<Props> = ({ prediction, onAction }) => {
    const isHigh = prediction.riskLevel === 'high';
    const bg = isHigh ? '#3A1020' : '#2A2510';
    const border = isHigh ? '#FF6B6B' : '#FFD93D';
    const icon = isHigh ? '🔴' : '🟡';

    return (
        <View style={[s.card, { backgroundColor: bg, borderColor: border }]}>
            <View style={s.row}>
                <Text style={s.icon}>{icon}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={s.title}>Flare-Up Risk: {prediction.riskScore}%</Text>
                    <Text style={s.sub}>{prediction.recommendations[0]}</Text>
                </View>
            </View>
            <TouchableOpacity style={[s.btn, { backgroundColor: border }]} onPress={onAction}>
                <Text style={s.btnText}>Start Preventive Session →</Text>
            </TouchableOpacity>
        </View>
    );
};

const s = StyleSheet.create({
    card: { marginHorizontal: 24, marginBottom: 16, borderRadius: 16, padding: 20, borderWidth: 1 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    icon: { fontSize: 28 },
    title: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    sub: { fontSize: 13, color: '#CCBBAA', marginTop: 4 },
    btn: { marginTop: 14, borderRadius: 10, padding: 12, alignItems: 'center' },
    btnText: { color: '#0A1628', fontWeight: '700', fontSize: 14 }
});

export default FlareUpAlert;
