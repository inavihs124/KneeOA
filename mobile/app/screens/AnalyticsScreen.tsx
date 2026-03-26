import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const W = Dimensions.get('window').width;

const AnalyticsScreen: React.FC = () => {
    const [timeRange, setTimeRange] = useState(7);
    const painData = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [6, 5, 5, 4, 5, 3, 4] }] };
    const impedanceData = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [340, 320, 350, 310, 330, 290, 300] }] };

    const chartConfig = {
        backgroundColor: '#12233D', backgroundGradientFrom: '#12233D', backgroundGradientTo: '#12233D',
        decimalCount: 0, color: (o = 1) => `rgba(0,229,160,${o})`, labelColor: () => '#8899AA',
        propsForDots: { r: '4', fill: '#00E5A0' }
    };

    return (
        <ScrollView style={s.container}>
            <View style={s.header}><Text style={s.title}>Analytics</Text></View>

            <View style={s.timeRow}>
                {[7, 30, 90].map(d => (
                    <TouchableOpacity key={d} style={[s.timeBtn, timeRange === d && s.timeBtnActive]} onPress={() => setTimeRange(d)}>
                        <Text style={[s.timeTxt, timeRange === d && s.timeTxtActive]}>{d}d</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={s.report}>
                <Text style={s.reportTitle}>📊 Monthly Report</Text>
                <View style={s.reportRow}>
                    <View style={s.reportItem}><Text style={[s.reportVal, { color: '#00E5A0' }]}>-35%</Text><Text style={s.reportLbl}>Pain Reduced</Text></View>
                    <View style={s.reportItem}><Text style={[s.reportVal, { color: '#4ECDC4' }]}>+20%</Text><Text style={s.reportLbl}>Mobility Up</Text></View>
                    <View style={s.reportItem}><Text style={[s.reportVal, { color: '#FFD93D' }]}>85%</Text><Text style={s.reportLbl}>Adherence</Text></View>
                </View>
            </View>

            <Text style={s.secTitle}>Pain Trend</Text>
            <View style={s.chartCard}>
                <LineChart data={painData} width={W - 72} height={180} chartConfig={chartConfig} bezier style={{ borderRadius: 12 }} withInnerLines={false} />
            </View>

            <Text style={s.secTitle}>Impedance Trend</Text>
            <View style={s.chartCard}>
                <LineChart data={impedanceData} width={W - 72} height={180}
                    chartConfig={{ ...chartConfig, color: (o = 1) => `rgba(255,107,107,${o})`, propsForDots: { r: '4', fill: '#FF6B6B' } }}
                    bezier style={{ borderRadius: 12 }} withInnerLines={false} />
            </View>

            <View style={s.corrCard}>
                <Text style={s.corrTitle}>🔗 Correlation Analysis</Text>
                <View style={s.corrRow}>
                    <View style={s.corrItem}><Text style={s.corrVal}>r = 0.72</Text><Text style={s.corrLbl}>Impedance vs Pain</Text><Text style={s.corrTrend}>Strong positive</Text></View>
                    <View style={s.corrItem}><Text style={s.corrVal}>r = -0.58</Text><Text style={s.corrLbl}>Activity vs Pain</Text><Text style={s.corrTrend}>Moderate negative</Text></View>
                </View>
            </View>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A1628' },
    header: { padding: 24, paddingTop: 60 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    timeRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 16 },
    timeBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: '#12233D', borderWidth: 1, borderColor: '#1E3A5F' },
    timeBtnActive: { backgroundColor: '#00E5A0', borderColor: '#00E5A0' },
    timeTxt: { color: '#8899AA', fontWeight: '600' },
    timeTxtActive: { color: '#0A1628' },
    report: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E3A5F' },
    reportTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    reportRow: { flexDirection: 'row', justifyContent: 'space-around' },
    reportItem: { alignItems: 'center' },
    reportVal: { fontSize: 24, fontWeight: '800' },
    reportLbl: { fontSize: 12, color: '#8899AA', marginTop: 4 },
    secTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', paddingHorizontal: 24, marginTop: 20, marginBottom: 8 },
    chartCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#1E3A5F' },
    corrCard: { backgroundColor: '#12233D', marginHorizontal: 24, borderRadius: 16, padding: 20, marginTop: 20, borderWidth: 1, borderColor: '#1E3A5F' },
    corrTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 16 },
    corrRow: { gap: 16 },
    corrItem: { flexDirection: 'column' },
    corrVal: { fontSize: 20, fontWeight: '700', color: '#00E5A0' },
    corrLbl: { fontSize: 14, color: '#FFF', marginTop: 4 },
    corrTrend: { fontSize: 12, color: '#8899AA', marginTop: 2 }
});

export default AnalyticsScreen;
