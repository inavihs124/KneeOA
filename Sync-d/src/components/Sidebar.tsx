import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, Activity, Trophy, Bot, Bell, Settings, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: CheckSquare, label: 'Tasks', id: 'tasks' },
  { icon: Activity, label: 'Pulse', id: 'pulse' },
  { icon: Trophy, label: 'Wins', id: 'wins' },
  { icon: Bot, label: 'Standup', id: 'standup' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { notifications, users, currentUser } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Leaderboard sorted by XP
  const leaderboard = [...users].sort((a, b) => b.xp - a.xp);

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-theme-muted/30 h-screen flex flex-col bg-theme-base sticky top-0 z-30 shrink-0`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-theme-muted/30 h-16 shrink-0">
        {!collapsed && (
          <h1 className="text-xl font-black text-theme-accent tracking-tighter">
            Sync-d
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-theme-surface text-white/60 hover:text-white transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" role="navigation">
        {navItems.map(({ icon: Icon, label, id }) => {
          const isActive = activePage === id;
          const badge = id === 'notifications' && unreadCount > 0 ? unreadCount : null;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group
                ${isActive
                  ? 'bg-theme-accent text-white shadow-inner ring-1 ring-theme-highlight/50'
                  : 'text-white/60 hover:bg-theme-surface hover:text-white'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {badge && (
                <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} bg-theme-highlight text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
                  {badge}
                </span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-theme-surface text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Leaderboard */}
      {!collapsed && (
        <div className="mx-2 mb-2 p-3 bg-theme-surface rounded-xl border border-theme-muted/30">
          <div className="flex items-center space-x-1.5 mb-3">
            <Zap size={12} className="text-theme-highlight" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">XP Leaderboard</span>
          </div>
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="flex items-center space-x-2">
                <span className={`text-[10px] font-black w-4 shrink-0 ${index === 0 ? 'text-theme-highlight' : index === 1 ? 'text-white/80' : index === 2 ? 'text-white/60' : 'text-white/40'}`}>
                  #{index + 1}
                </span>
                <div className="w-5 h-5 rounded-full bg-theme-accent flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  {user.avatar}
                </div>
                <span className={`text-xs truncate flex-1 ${user.id === currentUser.id ? 'text-theme-highlight font-bold' : 'text-white/80'}`}>
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-bold text-theme-highlight shrink-0">{user.xp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-2 pb-4 shrink-0">
        <button
          onClick={() => setActivePage('settings')}
          aria-current={activePage === 'settings' ? 'page' : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
            ${activePage === 'settings'
              ? 'bg-theme-accent text-white ring-1 ring-theme-highlight/50'
              : 'text-white/60 hover:bg-theme-surface hover:text-white'
            }`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};
