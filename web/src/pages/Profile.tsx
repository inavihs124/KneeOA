import React from 'react';

const Profile: React.FC = () => (
    <div>
        <h1 className="page-title">Profile</h1>
        <div className="grid-2">
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 40, background: '#00E5A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#0A1628' }}>AK</div>
                    <div><h2 style={{ fontSize: 24, fontWeight: 700 }}>Akash Sundar</h2><p style={{ color: '#8899AA', marginTop: 4 }}>akash@email.com</p></div>
                </div>
                <table>
                    <tbody>
                        <tr><td style={{ color: '#8899AA' }}>Age</td><td>28</td></tr>
                        <tr><td style={{ color: '#8899AA' }}>Gender</td><td>Male</td></tr>
                        <tr><td style={{ color: '#8899AA' }}>OA Stage</td><td><span className="tag tag-yellow">Moderate</span></td></tr>
                        <tr><td style={{ color: '#8899AA' }}>Height</td><td>175 cm</td></tr>
                        <tr><td style={{ color: '#8899AA' }}>Weight</td><td>72 kg</td></tr>
                        <tr><td style={{ color: '#8899AA' }}>Baseline WOMAC</td><td>52</td></tr>
                        <tr><td style={{ color: '#8899AA' }}>Member Since</td><td>Jan 2026</td></tr>
                    </tbody>
                </table>
                <button className="btn-primary" style={{ marginTop: 20, width: '100%' }}>Edit Profile</button>
            </div>
            <div>
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-title">📱 Paired Devices</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#0A2E1A', borderRadius: 10, border: '1px solid #00E5A0' }}>
                        <span style={{ fontSize: 28 }}>🦿</span>
                        <div style={{ flex: 1 }}><strong>ArthroEase-K1</strong><br /><span style={{ color: '#8899AA', fontSize: 12 }}>AA:BB:CC:DD:EE:FF • Firmware v1.0.0</span></div>
                        <span className="tag tag-green">Connected</span>
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">⚙️ Preferences</div>
                    <table>
                        <tbody>
                            <tr><td style={{ color: '#8899AA' }}>Notifications</td><td>✅ Enabled</td></tr>
                            <tr><td style={{ color: '#8899AA' }}>Language</td><td>English</td></tr>
                            <tr><td style={{ color: '#8899AA' }}>Theme</td><td>Dark</td></tr>
                            <tr><td style={{ color: '#8899AA' }}>Privacy Consent</td><td>✅ Granted</td></tr>
                            <tr><td style={{ color: '#8899AA' }}>Data Sharing</td><td>Anonymized only</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default Profile;
