import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: React.FC = () => {
    const painTrend = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Pain Score', data: [6, 5, 5, 4, 5, 3, 4],
            borderColor: '#00E5A0', backgroundColor: '#00E5A020', fill: true, tension: 0.4
        }]
    };

    const sessions = [
        { date: 'Today 10:30 AM', type: 'Auto-Adaptive', duration: '22 min', pain: '7→4', rating: '⭐⭐⭐⭐' },
        { date: 'Yesterday 3:15 PM', type: 'Manual', duration: '18 min', pain: '5→3', rating: '⭐⭐⭐⭐⭐' },
        { date: 'Feb 23 9:00 AM', type: 'Flare', duration: '30 min', pain: '8→5', rating: '⭐⭐⭐' },
        { date: 'Feb 22 11:45 AM', type: 'Auto-Adaptive', duration: '20 min', pain: '4→2', rating: '⭐⭐⭐⭐⭐' },
        { date: 'Feb 21 4:30 PM', type: 'Manual', duration: '15 min', pain: '6→4', rating: '⭐⭐⭐⭐' },
    ];

    return (
        <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your knee health and therapy progress</p>

            {/* Flare Alert */}
            <div className="alert-banner">
                <span className="alert-icon">🔴</span>
                <div className="alert-text">
                    <div className="alert-title">Flare-Up Risk: 72% in 36 hours</div>
                    <div className="alert-desc">Start preventive therapy now. Contributing factors: rising impedance, weather change, reduced activity.</div>
                </div>
                <button className="btn-primary">Start Session →</button>
            </div>

            {/* KPIs */}
            <div className="grid-4">
                <div className="kpi-card"><div className="emoji">📉</div><div className="value">-35%</div><div className="label">Pain Reduction</div><div className="change positive">↑ 8% vs last month</div></div>
                <div className="kpi-card"><div className="emoji">🎯</div><div className="value">85%</div><div className="label">Weekly Adherence</div><div className="change positive">↑ 5% vs last week</div></div>
                <div className="kpi-card"><div className="emoji">🔥</div><div className="value">72%</div><div className="label">Flare-Up Risk</div><div className="change negative">↑ High alert</div></div>
                <div className="kpi-card"><div className="emoji">💪</div><div className="value">+20%</div><div className="label">Mobility Improved</div><div className="change positive">↑ 12% vs baseline</div></div>
            </div>

            {/* Chart + Sessions */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-title">📊 Pain Trend (7 Days)</div>
                    <div className="chart-wrapper">
                        <Line data={painTrend} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 10, grid: { color: '#1E3A5F' }, ticks: { color: '#8899AA' } }, x: { grid: { display: false }, ticks: { color: '#8899AA' } } } }} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">⏱️ Recent Sessions</div>
                    <table>
                        <thead><tr><th>Date</th><th>Type</th><th>Duration</th><th>Pain</th><th>Rating</th></tr></thead>
                        <tbody>
                            {sessions.map((s, i) => (
                                <tr key={i}>
                                    <td>{s.date}</td>
                                    <td><span className={`tag ${s.type === 'Flare' ? 'tag-red' : s.type === 'Auto-Adaptive' ? 'tag-green' : 'tag-yellow'}`}>{s.type}</span></td>
                                    <td>{s.duration}</td><td>{s.pain}</td><td>{s.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Start */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button className="btn-primary" style={{ fontSize: 18, padding: '18px 48px' }}>⚡ Start Session Now</button>
            </div>
        </div>
    );
};

export default Dashboard;
