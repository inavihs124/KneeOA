import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { seconds: number; mode: string; }

const SessionTimer: React.FC<Props> = ({ seconds, mode }) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const modeLabels: Record<string, string> = { manual: '✋ Manual', auto_adaptive: '🤖 Auto-Adaptive', flare_intervention: '🔥 Flare Intervention' };

    return (
        <View style={s.card}>
            <Text style={s.time}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</Text>
            <View style={s.modeTag}><Text style={s.modeText}>{modeLabels[mode] || mode}</Text></View>
            <View style={s.pulse} />
        </View>
    );
};

const s = StyleSheet.create({
    card: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#1E3A5F', marginTop: 16 },
    time: { fontSize: 56, fontWeight: '800', color: '#00E5A0', fontVariant: ['tabular-nums'] },
    modeTag: { backgroundColor: '#0A1628', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 12 },
    modeText: { color: '#8899AA', fontWeight: '600', fontSize: 14 },
    pulse: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#00E5A0', marginTop: 12 }
});

export default SessionTimer;
