import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { entries?: Array<{ date: string; activity: string; steps: number; duration: number }> }

const defaultEntries = [
    { date: 'Today', activity: 'Walking', steps: 4200, duration: 35 },
    { date: 'Yesterday', activity: 'Stairs', steps: 3800, duration: 28 },
    { date: 'Feb 23', activity: 'Standing', steps: 5100, duration: 42 },
];

const ActivityLog: React.FC<Props> = ({ entries = defaultEntries }) => (
    <View style={s.card}>
        <Text style={s.title}>📋 Activity Log</Text>
        {entries.map((e, i) => (
            <View key={i} style={s.row}>
                <View style={{ flex: 1 }}>
                    <Text style={s.date}>{e.date}</Text>
                    <Text style={s.activity}>{e.activity}</Text>
                </View>
                <View style={s.stat}><Text style={s.statVal}>{e.steps}</Text><Text style={s.statLbl}>steps</Text></View>
                <View style={s.stat}><Text style={s.statVal}>{e.duration}m</Text><Text style={s.statLbl}>active</Text></View>
            </View>
        ))}
    </View>
);

const s = StyleSheet.create({
    card: { backgroundColor: '#12233D', borderRadius: 16, padding: 20, marginHorizontal: 24, marginTop: 16, borderWidth: 1, borderColor: '#1E3A5F' },
    title: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E3A5F' },
    date: { fontSize: 14, fontWeight: '600', color: '#FFF' },
    activity: { fontSize: 12, color: '#8899AA', marginTop: 2 },
    stat: { alignItems: 'center', marginLeft: 20 },
    statVal: { fontSize: 16, fontWeight: '700', color: '#00E5A0' },
    statLbl: { fontSize: 10, color: '#8899AA' }
});

export default ActivityLog;
