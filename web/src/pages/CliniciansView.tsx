import React from 'react';

const CliniciansView: React.FC = () => {
    const patients = [
        { id: 'P001', age: 62, stage: 'Moderate', sessions: 23, avgPain: 4.2, painReduction: 35, adherence: 85, status: 'Improving' },
        { id: 'P002', age: 55, stage: 'Mild', sessions: 18, avgPain: 2.8, painReduction: 42, adherence: 92, status: 'Improving' },
        { id: 'P003', age: 71, stage: 'Severe', sessions: 31, avgPain: 6.5, painReduction: 15, adherence: 68, status: 'Plateau' },
        { id: 'P004', age: 48, stage: 'Mild', sessions: 12, avgPain: 3.1, painReduction: 28, adherence: 78, status: 'Improving' },
        { id: 'P005', age: 67, stage: 'Severe', sessions: 8, avgPain: 7.8, painReduction: 5, adherence: 45, status: 'Non-responder' },
    ];

    return (
        <div>
            <h1 className="page-title">Clinician Dashboard</h1>
            <p className="page-subtitle">Anonymized cohort analytics and research data</p>

            <div className="export-row">
                <button className="btn-secondary">📥 Export CSV (HIPAA)</button>
                <button className="btn-secondary">📄 Export JSON</button>
                <button className="btn-primary">🔬 Submit for Federated Learning</button>
            </div>

            <div className="grid-4">
                <div className="kpi-card"><div className="emoji">👥</div><div className="value">5</div><div className="label">Active Patients</div></div>
                <div className="kpi-card"><div className="emoji">📉</div><div className="value">25%</div><div className="label">Avg Pain Reduction</div></div>
                <div className="kpi-card"><div className="emoji">🎯</div><div className="value">74%</div><div className="label">Avg Adherence</div></div>
                <div className="kpi-card"><div className="emoji">⚠️</div><div className="value">1</div><div className="label">Non-Responders</div><div className="change negative">Needs attention</div></div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-title">📊 Patient Cohort Overview</div>
                <table>
                    <thead>
                        <tr><th>ID</th><th>Age</th><th>OA Stage</th><th>Sessions</th><th>Avg Pain</th><th>Pain Reduction</th><th>Adherence</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.id}</td>
                                <td>{p.age}</td>
                                <td><span className={`tag ${p.stage === 'Mild' ? 'tag-green' : p.stage === 'Moderate' ? 'tag-yellow' : 'tag-red'}`}>{p.stage}</span></td>
                                <td>{p.sessions}</td>
                                <td>{p.avgPain}/10</td>
                                <td style={{ color: p.painReduction > 20 ? '#00E5A0' : p.painReduction > 10 ? '#FFD93D' : '#FF6B6B' }}>{p.painReduction}%</td>
                                <td>{p.adherence}%</td>
                                <td><span className={`tag ${p.status === 'Improving' ? 'tag-green' : p.status === 'Plateau' ? 'tag-yellow' : 'tag-red'}`}>{p.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid-2">
                <div className="card">
                    <div className="card-title">🔍 Outlier Analysis</div>
                    <div style={{ padding: 16, background: '#3A1020', borderRadius: 10, border: '1px solid #FF6B6B', marginBottom: 12 }}>
                        <strong style={{ color: '#FF6B6B' }}>P005 — Non-Responder</strong>
                        <p style={{ color: '#8899AA', fontSize: 13, marginTop: 8 }}>• Low adherence (45%) — may need engagement intervention<br />• Severe OA stage — consider alternative therapy protocol<br />• Only 8 sessions — insufficient data for full assessment</p>
                    </div>
                    <div style={{ padding: 16, background: '#0A2E1A', borderRadius: 10, border: '1px solid #00E5A0' }}>
                        <strong style={{ color: '#00E5A0' }}>P002 — Best Responder</strong>
                        <p style={{ color: '#8899AA', fontSize: 13, marginTop: 8 }}>• 42% pain reduction with mild OA<br />• 92% adherence — highly engaged<br />• Consider as reference profile for ML training</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">🧬 Research Insights</div>
                    <div style={{ color: '#8899AA', fontSize: 14, lineHeight: 1.8 }}>
                        <p>• <strong style={{ color: '#FFF' }}>Impedance-Pain Correlation:</strong> r = 0.72 (p &lt; 0.01) across cohort</p>
                        <p>• <strong style={{ color: '#FFF' }}>Auto-Adaptive vs Manual:</strong> 23% better outcomes with auto mode</p>
                        <p>• <strong style={{ color: '#FFF' }}>Flare Prediction Accuracy:</strong> 78% (goal: 85%+ with more data)</p>
                        <p>• <strong style={{ color: '#FFF' }}>Avg Surgery Delay Potential:</strong> 2.3 years projected</p>
                        <p style={{ marginTop: 16 }}><em>Data last updated: Feb 25, 2026</em></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CliniciansView;
