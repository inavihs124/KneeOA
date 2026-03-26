import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props { value: number; onChange: (v: number) => void; }

const PainScaleInput: React.FC<Props> = ({ value, onChange }) => {
    const getColor = (v: number) => {
        if(v <= 3) return '#00E5A0';
        if(v <= 6) return '#FFD93D';
        return '#FF6B6B';
    };

    return (
        <View style={s.container}>
            <View style={s.row}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <TouchableOpacity key={n} style={[s.dot, n === value && { backgroundColor: getColor(n), transform: [{ scale: 1.3 }] }]}
                        onPress={() => onChange(n)}>
                        <Text style={[s.dotText, n === value && s.dotTextActive]}>{n}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={s.labels}>
                <Text style={s.label}>No Pain</Text>
                <Text style={[s.valueText, { color: getColor(value) }]}>{value}/10</Text>
                <Text style={s.label}>Worst</Text>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: { marginVertical: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1E3A5F', alignItems: 'center', justifyContent: 'center' },
    dotText: { color: '#8899AA', fontSize: 11, fontWeight: '600' },
    dotTextActive: { color: '#0A1628', fontWeight: '800' },
    labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    label: { color: '#8899AA', fontSize: 11 },
    valueText: { fontSize: 16, fontWeight: '700' }
});

export default PainScaleInput;
