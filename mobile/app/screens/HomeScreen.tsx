import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFlarePredictor } from '../hooks/useFlarePredictor';
import FlareUpAlert from '../components/FlareUpAlert';

interface Props { navigation: any; }

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { prediction, predict } = useFlarePredictor();
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        avgPain: 4.2, painChange: -35, sessionsThisWeek: 5,
        totalSessions: 23, streak: 7, lastSessionDate: 'Today, 10:30 AM'
    });

    useEffect(() => {
        predict({
            impedanceTrend: [320, 310, 340, 355, 370, 360, 380],
            painHistory: [5, 4, 5, 6, 5, 4, 5],
            activityLevel: 6, sleepQuality: 7
        });
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await predict({ impedanceTrend: [320, 310, 340, 355, 370, 360, 380], painHistory: [5, 4, 5, 6, 5, 4, 5], activityLevel: 6, sleepQuality: 7 });
        setRefreshing(false);
    };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5A0" />}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Good Afternoon 👋</Text>
                <Text style={styles.headerTitle}>Your Knee Health</Text>
            </View>

            {/* Flare Alert */}
            {prediction && prediction.riskLevel !== 'low' && (
                <FlareUpAlert prediction={prediction} onAction={() => navigation.navigate('Session')} />
            )}

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, styles.statCardLarge]}>
                    <Text style={styles.statEmoji}>📉</Text>
                    <Text style={styles.statValue}>{stats.painChange}%</Text>
                    <Text style={styles.statLabel}>Pain Reduction</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statEmoji}>🎯</Text>
                    <Text style={styles.statValue}>{stats.sessionsThisWeek}</Text>
                    <Text style={styles.statLabel}>Sessions This Week</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statEmoji}>🔥</Text>
                    <Text style={styles.statValue}>{stats.streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statEmoji}>💪</Text>
                    <Text style={styles.statValue}>{stats.avgPain}/10</Text>
                    <Text style={styles.statLabel}>Avg Pain Score</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statEmoji}>📊</Text>
                    <Text style={styles.statValue}>{stats.totalSessions}</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Session')}>
                <Text style={styles.startButtonEmoji}>⚡</Text>
                <View>
                    <Text style={styles.startButtonText}>Start Therapy Session</Text>
                    <Text style={styles.startButtonSub}>20 min • Auto-Adaptive Mode</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate('DeviceConnect')}>
                <Text style={styles.connectEmoji}>📡</Text>
                <View>
                    <Text style={styles.connectText}>Connect Device</Text>
                    <Text style={styles.connectSub}>ArthroEase-K1 • Not connected</Text>
                </View>
            </TouchableOpacity>

            {/* Last Session */}
            <View style={styles.lastSession}>
                <Text style={styles.sectionTitle}>Last Session</Text>
                <View style={styles.sessionCard}>
                    <Text style={styles.sessionDate}>{stats.lastSessionDate}</Text>
                    <View style={styles.sessionStats}>
                        <View style={styles.sessionStat}>
                            <Text style={styles.sessionStatValue}>22 min</Text>
                            <Text style={styles.sessionStatLabel}>Duration</Text>
                        </View>
                        <View style={styles.sessionStat}>
                            <Text style={styles.sessionStatValue}>-3 pts</Text>
                            <Text style={styles.sessionStatLabel}>Pain Change</Text>
                        </View>
                        <View style={styles.sessionStat}>
                            <Text style={styles.sessionStatValue}>⭐ 4/5</Text>
                            <Text style={styles.sessionStatLabel}>Effectiveness</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { padding: 24, paddingTop: 60 },
    greeting: { fontSize: 16, color: '#8899AA' },
    headerTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', marginTop: 4 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
    statCard: { backgroundColor: '#12233D', borderRadius: 16, padding: 16, width: '47%', borderWidth: 1, borderColor: '#1E3A5F' },
    statCardLarge: { width: '97%' },
    statEmoji: { fontSize: 24, marginBottom: 8 },
    statValue: { fontSize: 28, fontWeight: '800', color: '#00E5A0' },
    statLabel: { fontSize: 13, color: '#8899AA', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', paddingHorizontal: 24, marginTop: 24, marginBottom: 12 },
    startButton: { backgroundColor: '#00E5A0', marginHorizontal: 24, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
    startButtonEmoji: { fontSize: 32 },
    startButtonText: { fontSize: 18, fontWeight: '700', color: '#0A1628' },
    startButtonSub: { fontSize: 13, color: '#0A1628', opacity: 0.7, marginTop: 2 },
    connectButton: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12, borderWidth: 1, borderColor: '#1E3A5F' },
    connectEmoji: { fontSize: 28 },
    connectText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
    connectSub: { fontSize: 13, color: '#8899AA', marginTop: 2 },
    lastSession: { marginTop: 8 },
    sessionCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E3A5F' },
    sessionDate: { fontSize: 15, color: '#8899AA', marginBottom: 12 },
    sessionStats: { flexDirection: 'row', justifyContent: 'space-between' },
    sessionStat: { alignItems: 'center' },
    sessionStatValue: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    sessionStatLabel: { fontSize: 12, color: '#8899AA', marginTop: 4 }
});

export default HomeScreen;
