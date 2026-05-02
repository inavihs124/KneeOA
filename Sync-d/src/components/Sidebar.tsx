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
      className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-zinc-800 h-screen flex flex-col bg-zinc-950 sticky top-0 z-30 shrink-0`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800 h-16 shrink-0">
        {!collapsed && (
          <h1 className="text-xl font-black bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            Sync-d
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-auto"
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
                  ? 'bg-violet-600/20 text-violet-400 shadow-inner ring-1 ring-violet-500/30'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {badge && (
                <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
                  {badge}
                </span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Leaderboard */}
      {!collapsed && (
        <div className="mx-2 mb-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="flex items-center space-x-1.5 mb-3">
            <Zap size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">XP Leaderboard</span>
          </div>
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="flex items-center space-x-2">
                <span className={`text-[10px] font-black w-4 shrink-0 ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-zinc-400' : index === 2 ? 'text-amber-700' : 'text-zinc-600'}`}>
                  #{index + 1}
                </span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  {user.avatar}
                </div>
                <span className={`text-xs truncate flex-1 ${user.id === currentUser.id ? 'text-violet-400 font-bold' : 'text-zinc-300'}`}>
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-bold text-violet-400 shrink-0">{user.xp}</span>
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
              ? 'bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/30'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};
