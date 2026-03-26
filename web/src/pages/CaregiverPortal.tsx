import React from 'react';

const CaregiverPortal: React.FC = () => {
    return (
        <div>
            <h1 className="page-title">Caregiver Portal</h1>
            <p className="page-subtitle">Monitor your loved one's knee health progress</p>

            <div className="grid-3">
                <div className="kpi-card"><div className="emoji">👤</div><div className="value">Akash</div><div className="label">Patient</div></div>
                <div className="kpi-card"><div className="emoji">📉</div><div className="value">4.2/10</div><div className="label">Current Pain Level</div><div className="change positive">↓ from 6.5 baseline</div></div>
                <div className="kpi-card"><div className="emoji">✅</div><div className="value">85%</div><div className="label">Therapy Adherence</div><div className="change positive">On track this week</div></div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-title">📋 Weekly Summary</div>
                <table>
                    <thead><tr><th>Metric</th><th>This Week</th><th>Last Week</th><th>Change</th></tr></thead>
                    <tbody>
                        <tr><td>Avg Pain Score</td><td>4.2</td><td>5.1</td><td><span className="tag tag-green">↓ 0.9</span></td></tr>
                        <tr><td>Sessions Completed</td><td>5</td><td>4</td><td><span className="tag tag-green">↑ 1</span></td></tr>
                        <tr><td>Active Minutes</td><td>142</td><td>118</td><td><span className="tag tag-green">↑ 24 min</span></td></tr>
                        <tr><td>WOMAC Score</td><td>38</td><td>44</td><td><span className="tag tag-green">↓ 6 pts</span></td></tr>
                        <tr><td>Flare Episodes</td><td>0</td><td>1</td><td><span className="tag tag-green">↓ 1</span></td></tr>
                    </tbody>
                </table>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-title">⚠️ Alerts</div>
                    <div style={{ padding: 16, background: '#2A2510', borderRadius: 10, marginBottom: 12, border: '1px solid #FFD93D' }}>
                        <strong style={{ color: '#FFD93D' }}>Moderate Flare Risk (48%)</strong>
                        <p style={{ color: '#8899AA', fontSize: 13, marginTop: 4 }}>Weather change detected. Recommended: preventive session today.</p>
                    </div>
                    <div style={{ padding: 16, background: '#0A2E1A', borderRadius: 10, border: '1px solid #00E5A0' }}>
                        <strong style={{ color: '#00E5A0' }}>Session Completed ✓</strong>
                        <p style={{ color: '#8899AA', fontSize: 13, marginTop: 4 }}>22 min auto-adaptive session. Pain reduced from 7 to 4.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">💊 Medication Log</div>
                    <table>
                        <thead><tr><th>Date</th><th>Medication</th><th>Taken</th></tr></thead>
                        <tbody>
                            <tr><td>Today</td><td>Ibuprofen 400mg</td><td>✅</td></tr>
                            <tr><td>Yesterday</td><td>Ibuprofen 400mg</td><td>✅</td></tr>
                            <tr><td>Feb 23</td><td>Ibuprofen 400mg</td><td>❌</td></tr>
                            <tr><td>Feb 22</td><td>Ibuprofen 400mg</td><td>✅</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CaregiverPortal;
