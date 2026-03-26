import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const SessionAnalytics: React.FC = () => {
    const impedanceData = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
            label: 'Impedance (Ω)', data: Array.from({ length: 30 }, () => 280 + Math.random() * 120),
            borderColor: '#FF6B6B', backgroundColor: '#FF6B6B20', fill: true, tension: 0.4
        }]
    };

    const painVsImpedance = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            { label: 'Pain', data: [6, 5, 5, 4, 5, 3, 4], borderColor: '#00E5A0', tension: 0.4, yAxisID: 'y' },
            { label: 'Impedance', data: [380, 340, 350, 310, 330, 290, 300], borderColor: '#FF6B6B', tension: 0.4, yAxisID: 'y1' }
        ]
    };

    // Heatmap data (simulated)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const heatmapData = days.map(() => hours.map(() => Math.floor(Math.random() * 10)));

    return (
        <div>
            <h1 className="page-title">Session Analytics</h1>
            <p className="page-subtitle">Deep dive into your therapy data</p>

            <div className="export-row">
                <button className="btn-secondary">📥 Export CSV</button>
                <button className="btn-secondary">📄 Export PDF</button>
            </div>

            {/* Pain Heatmap */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-title">🌡️ Pain Intensity Heatmap (Day × Time)</div>
                <table>
                    <thead><tr><th></th>{hours.map(h => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>
                        {days.map((day, di) => (
                            <tr key={day}>
                                <td style={{ fontWeight: 600 }}>{day}</td>
                                {heatmapData[di].map((val, hi) => (
                                    <td key={hi} style={{
                                        backgroundColor: val < 3 ? '#00E5A030' : val < 6 ? '#FFD93D30' : '#FF6B6B30',
                                        textAlign: 'center', borderRadius: 4, fontWeight: 700,
                                        color: val < 3 ? '#00E5A0' : val < 6 ? '#FFD93D' : '#FF6B6B'
                                    }}>{val}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-title">📈 30-Day Impedance Trend</div>
                    <div className="chart-wrapper">
                        <Line data={impedanceData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#1E3A5F' }, ticks: { color: '#8899AA' } }, x: { display: false } } }} />
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">🔗 Pain vs Impedance Correlation</div>
                    <div className="chart-wrapper">
                        <Line data={painVsImpedance} options={{ responsive: true, plugins: { legend: { labels: { color: '#8899AA' } } }, scales: { y: { position: 'left' as const, min: 0, max: 10, grid: { color: '#1E3A5F' }, ticks: { color: '#00E5A0' } }, y1: { position: 'right' as const, min: 200, max: 500, grid: { display: false }, ticks: { color: '#FF6B6B' } }, x: { grid: { display: false }, ticks: { color: '#8899AA' } } } }} />
                    </div>
                </div>
            </div>

            {/* Correlation Stats */}
            <div className="grid-3" style={{ marginTop: 24 }}>
                <div className="kpi-card"><div className="value" style={{ color: '#4ECDC4' }}>r = 0.72</div><div className="label">Impedance ↔ Pain</div><div className="change positive">Strong positive correlation</div></div>
                <div className="kpi-card"><div className="value" style={{ color: '#FFD93D' }}>r = -0.58</div><div className="label">Activity ↔ Pain</div><div className="change positive">More activity → less pain</div></div>
                <div className="kpi-card"><div className="value" style={{ color: '#FF6B6B' }}>r = 0.65</div><div className="label">Weather ↔ Flare</div><div className="change negative">Low pressure → more flares</div></div>
            </div>
        </div>
    );
};

export default SessionAnalytics;
