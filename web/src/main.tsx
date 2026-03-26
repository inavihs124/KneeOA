import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SessionAnalytics from './pages/SessionAnalytics';
import CaregiverPortal from './pages/CaregiverPortal';
import CliniciansView from './pages/CliniciansView';
import Profile from './pages/Profile';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <nav className="sidebar">
                    <div className="logo">
                        <span className="logo-icon">🦿</span>
                        <span className="logo-text">ArthroEase</span>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>📊 Dashboard</NavLink>
                        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>📈 Analytics</NavLink>
                        <NavLink to="/caregiver" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>👨‍👩‍👦 Caregiver</NavLink>
                        <NavLink to="/clinician" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>🩺 Clinician</NavLink>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>👤 Profile</NavLink>
                    </div>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/analytics" element={<SessionAnalytics />} />
                        <Route path="/caregiver" element={<CaregiverPortal />} />
                        <Route path="/clinician" element={<CliniciansView />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
