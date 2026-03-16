import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { storage } from '../utils/dataStorage';

interface Props { navigation: any; }

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [voiceGuidance, setVoiceGuidance] = useState(false);

    const logout = async () => {
        await storage.clearAll();
        navigation.replace('Onboarding');
    };

    const renderToggle = (label: string, icon: string, value: boolean, onToggle: (v: boolean) => void) => (
        <View style={s.row}>
            <Text style={s.rowIcon}>{icon}</Text>
            <Text style={s.rowLabel}>{label}</Text>
            <Switch value={value} onValueChange={onToggle} trackColor={{ false: '#1E3A5F', true: '#00E5A0' }} thumbColor="#FFF" />
        </View>
    );

    return (
        <ScrollView style={s.container}>
            <View style={s.header}><Text style={s.title}>Settings</Text></View>

            <View style={s.profileCard}>
                <View style={s.avatar}><Text style={s.avatarText}>AK</Text></View>
                <View><Text style={s.profileName}>Akash Sundar</Text><Text style={s.profileEmail}>akash@email.com</Text><Text style={s.profileStage}>OA Stage: Moderate</Text></View>
            </View>

            <Text style={s.secTitle}>Notifications</Text>
            <View style={s.card}>
                {renderToggle('Push Notifications', '🔔', notifications, setNotifications)}
                {renderToggle('Flare-Up Alerts', '⚠️', true, () => { })}
                {renderToggle('Session Reminders', '⏰', true, () => { })}
            </View>

            <Text style={s.secTitle}>Accessibility</Text>
            <View style={s.card}>
                {renderToggle('Dark Mode', '🌙', darkMode, setDarkMode)}
                {renderToggle('High Contrast', '🔆', highContrast, setHighContrast)}
                {renderToggle('Large Text (24pt)', '🔤', largeText, setLargeText)}
                {renderToggle('Voice Guidance', '🗣️', voiceGuidance, setVoiceGuidance)}
            </View>

            <Text style={s.secTitle}>Device</Text>
            <View style={s.card}>
                <TouchableOpacity style={s.menuRow} onPress={() => navigation.navigate('DeviceConnect')}>
                    <Text style={s.rowIcon}>📡</Text><Text style={s.rowLabel}>Manage Devices</Text><Text style={s.arrow}>›</Text>
                </TouchableOpacity>
            </View>

            <Text style={s.secTitle}>Account</Text>
            <View style={s.card}>
                <TouchableOpacity style={s.menuRow}><Text style={s.rowIcon}>📋</Text><Text style={s.rowLabel}>Privacy Policy</Text><Text style={s.arrow}>›</Text></TouchableOpacity>
                <TouchableOpacity style={s.menuRow}><Text style={s.rowIcon}>📄</Text><Text style={s.rowLabel}>Terms of Service</Text><Text style={s.arrow}>›</Text></TouchableOpacity>
                <TouchableOpacity style={s.menuRow}><Text style={s.rowIcon}>💬</Text><Text style={s.rowLabel}>Support</Text><Text style={s.arrow}>›</Text></TouchableOpacity>
            </View>

            <TouchableOpacity style={s.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout', onPress: logout, style: 'destructive' }])}>
                <Text style={s.logoutText}>Log Out</Text>
            </TouchableOpacity>
            <Text style={s.version}>ArthroEase v1.0.0</Text>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { padding: 24, paddingTop: 60 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, gap: 16, borderWidth: 1, borderColor: '#1E3A5F' },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#00E5A0', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 20, fontWeight: '800', color: '#0A1628' },
    profileName: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    profileEmail: { fontSize: 13, color: '#8899AA', marginTop: 2 },
    profileStage: { fontSize: 13, color: '#00E5A0', marginTop: 2 },
    secTitle: { fontSize: 16, fontWeight: '700', color: '#8899AA', paddingHorizontal: 24, marginTop: 24, marginBottom: 8 },
    card: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 14, borderWidth: 1, borderColor: '#1E3A5F', overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E3A5F' },
    menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E3A5F' },
    rowIcon: { fontSize: 20, marginRight: 12 },
    rowLabel: { flex: 1, fontSize: 15, color: '#FFF' },
    arrow: { fontSize: 22, color: '#8899AA' },
    logoutBtn: { backgroundColor: '#2A1020', marginHorizontal: 24, marginTop: 32, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FF6B6B' },
    logoutText: { color: '#FF6B6B', fontSize: 16, fontWeight: '700' },
    version: { textAlign: 'center', color: '#8899AA', fontSize: 12, marginTop: 16 }
});

export default SettingsScreen;
