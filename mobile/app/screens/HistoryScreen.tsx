import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import PainScaleInput from '../components/PainScaleInput';

const moods = ['😄', '🙂', '😐', '😟', '😫'];

const history = [
    { date: 'Today', pain: 4, stiffness: 3, fn: 6, mood: '🙂', meds: true, notes: 'Morning session helped' },
    { date: 'Yesterday', pain: 5, stiffness: 4, fn: 5, mood: '😐', meds: true, notes: 'Rainy day' },
    { date: 'Feb 23', pain: 6, stiffness: 5, fn: 4, mood: '😟', meds: false, notes: '' },
    { date: 'Feb 22', pain: 3, stiffness: 2, fn: 7, mood: '😄', meds: true, notes: 'Great day' },
    { date: 'Feb 21', pain: 5, stiffness: 4, fn: 5, mood: '😐', meds: true, notes: '' },
    { date: 'Feb 20', pain: 7, stiffness: 6, fn: 3, mood: '😫', meds: true, notes: 'Flare up' },
];

const HistoryScreen: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [painScore, setPainScore] = useState(5);
    const [mood, setMood] = useState('😐');
    const [meds, setMeds] = useState(false);
    const [notes, setNotes] = useState('');

    const avgPain = (history.reduce((s, h) => s + h.pain, 0) / history.length).toFixed(1);

    return (
        <ScrollView style={s.container}>
            <View style={s.header}>
                <Text style={s.title}>Health Journal</Text>
            </View>

            <View style={s.row}>
                <View style={s.sumCard}><Text style={s.sumVal}>{avgPain}</Text><Text style={s.sumLbl}>Avg Pain</Text></View>
                <View style={s.sumCard}><Text style={s.sumVal}>42</Text><Text style={s.sumLbl}>WOMAC</Text></View>
                <View style={s.sumCard}><Text style={s.sumVal}>5/7</Text><Text style={s.sumLbl}>Logged</Text></View>
            </View>

            <TouchableOpacity style={s.logBtn} onPress={() => setShowForm(!showForm)}>
                <Text style={s.logBtnTxt}>{showForm ? '✕ Cancel' : '+ Log Today'}</Text>
            </TouchableOpacity>

            {showForm && (
                <View style={s.form}>
                    <Text style={s.formTitle}>Daily Check-In</Text>
                    <Text style={s.label}>Pain Level</Text>
                    <PainScaleInput value={painScore} onChange={setPainScore} />
                    <Text style={s.label}>Mood</Text>
                    <View style={s.moodRow}>
                        {moods.map(m => (
                            <TouchableOpacity key={m} style={[s.moodBtn, mood === m && s.moodActive]} onPress={() => setMood(m)}>
                                <Text style={{ fontSize: 24 }}>{m}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={s.label}>Medication?</Text>
                    <View style={s.medRow}>
                        <TouchableOpacity style={[s.medBtn, meds && s.medActive]} onPress={() => setMeds(true)}><Text style={[s.medTxt, meds && s.medTxtA]}>Yes 💊</Text></TouchableOpacity>
                        <TouchableOpacity style={[s.medBtn, !meds && s.medActive]} onPress={() => setMeds(false)}><Text style={[s.medTxt, !meds && s.medTxtA]}>No</Text></TouchableOpacity>
                    </View>
                    <TextInput style={s.notes} placeholder="Notes..." placeholderTextColor="#666" value={notes} onChangeText={setNotes} multiline />
                    <TouchableOpacity style={s.saveBtn} onPress={() => setShowForm(false)}><Text style={s.saveTxt}>Save Entry</Text></TouchableOpacity>
                </View>
            )}

            <Text style={s.secTitle}>Recent Entries</Text>
            {history.map((e, i) => (
                <View key={i} style={s.entry}>
                    <View style={s.entryHead}><Text style={s.entryDate}>{e.date}</Text><Text style={{ fontSize: 20 }}>{e.mood}</Text></View>
                    <View style={s.entryStats}>
                        <View style={s.eStat}><Text style={[s.eVal, { color: e.pain > 6 ? '#FF6B6B' : e.pain < 4 ? '#00E5A0' : '#FFD93D' }]}>{e.pain}/10</Text><Text style={s.eLbl}>Pain</Text></View>
                        <View style={s.eStat}><Text style={s.eVal}>{e.stiffness}/10</Text><Text style={s.eLbl}>Stiffness</Text></View>
                        <View style={s.eStat}><Text style={s.eVal}>{e.fn}/10</Text><Text style={s.eLbl}>Function</Text></View>
                        <View style={s.eStat}><Text style={s.eVal}>{e.meds ? '💊' : '—'}</Text><Text style={s.eLbl}>Meds</Text></View>
                    </View>
                    {e.notes ? <Text style={s.eNotes}>📝 {e.notes}</Text> : null}
                </View>
            ))}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { padding: 24, paddingTop: 60 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    row: { flexDirection: 'row', paddingHorizontal: 24, gap: 12 },
    sumCard: { flex: 1, backgroundColor: '#12233D', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1E3A5F' },
    sumVal: { fontSize: 24, fontWeight: '800', color: '#00E5A0' },
    sumLbl: { fontSize: 11, color: '#8899AA', marginTop: 4 },
    logBtn: { backgroundColor: '#00E5A0', marginHorizontal: 24, marginTop: 16, borderRadius: 14, padding: 16, alignItems: 'center' },
    logBtnTxt: { color: '#0A1628', fontSize: 16, fontWeight: '700' },
    form: { backgroundColor: '#12233D', marginHorizontal: 24, marginTop: 16, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1E3A5F' },
    formTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    label: { color: '#8899AA', fontSize: 14, marginBottom: 8, marginTop: 16 },
    moodRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
    moodBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#1E3A5F' },
    moodActive: { borderColor: '#00E5A0', backgroundColor: '#0A2E1A' },
    medRow: { flexDirection: 'row', gap: 12 },
    medBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#0A1628', alignItems: 'center', borderWidth: 1, borderColor: '#1E3A5F' },
    medActive: { backgroundColor: '#00E5A0', borderColor: '#00E5A0' },
    medTxt: { color: '#8899AA', fontWeight: '600' },
    medTxtA: { color: '#0A1628' },
    notes: { backgroundColor: '#0A1628', borderRadius: 12, padding: 16, color: '#FFF', borderWidth: 1, borderColor: '#1E3A5F', textAlignVertical: 'top', minHeight: 80, marginTop: 8 },
    saveBtn: { backgroundColor: '#00E5A0', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 20 },
    saveTxt: { color: '#0A1628', fontSize: 16, fontWeight: '700' },
    secTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', paddingHorizontal: 24, marginTop: 24, marginBottom: 12 },
    entry: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#1E3A5F' },
    entryHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    entryDate: { fontSize: 15, fontWeight: '600', color: '#FFF' },
    entryStats: { flexDirection: 'row', justifyContent: 'space-between' },
    eStat: { alignItems: 'center' },
    eVal: { fontSize: 16, fontWeight: '700', color: '#FFF' },
    eLbl: { fontSize: 11, color: '#8899AA', marginTop: 2 },
    eNotes: { fontSize: 13, color: '#8899AA', marginTop: 10, fontStyle: 'italic' }
});

export default HistoryScreen;
