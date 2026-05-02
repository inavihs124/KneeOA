import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskBoard } from './components/TaskBoard';
import { WinsFeed } from './components/WinsFeed';
import { AIStandup } from './components/AIStandup';
import { NotificationsPanel } from './components/NotificationsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { AppProvider } from './context/AppContext';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Gamified Task Board',
  tasks: 'All Tasks',
  pulse: 'Team Pulse',
  wins: 'Team Wins',
  standup: 'AI Standup',
  notifications: 'Notifications',
  settings: 'Settings',
};

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
      case 'tasks':
        return (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-6 pb-2 shrink-0">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {PAGE_TITLES[activePage]}
              </h1>
              <p className="text-white/60 text-sm mt-1">Hover a card to move it · Click to open chat</p>
            </div>
            <TaskBoard />
          </div>
        );
      case 'wins':
        return <div className="flex-1 overflow-y-auto"><WinsFeed /></div>;
      case 'standup':
        return <div className="flex-1 overflow-y-auto"><AIStandup /></div>;
      case 'notifications':
        return <div className="flex-1 overflow-y-auto"><NotificationsPanel /></div>;
      case 'settings':
        return <div className="flex-1 overflow-y-auto"><SettingsPanel /></div>;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-white/50">
            <p>Page coming soon…</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-theme-base text-white">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onBellClick={() => setActivePage('notifications')} />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
