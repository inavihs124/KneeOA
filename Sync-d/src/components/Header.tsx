import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { VibeStatus } from '../data/mockData';

const vibeOptions: VibeStatus[] = [
  'Available 🟢',
  'Deep Focus 🎯',
  'In a Meeting 🔴',
  'Slow Day 🌙',
];

export const Header: React.FC<{ onBellClick: () => void }> = ({ onBellClick }) => {
  const { users, currentUser, notifications, updateUserVibe } = useAppContext();
  const [vibeOpen, setVibeOpen] = useState(false);
  const vibeRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close vibe dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vibeRef.current && !vibeRef.current.contains(e.target as Node)) {
        setVibeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 border-b border-theme-muted/30 bg-theme-base/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
      {/* Team Pulse Strip */}
      <div className="flex-1 overflow-x-auto flex items-center gap-5 mr-6 no-scrollbar" role="region" aria-label="Team Pulse Feed">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 shrink-0">Pulse</span>
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-theme-accent flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                aria-label={`${user.name}'s avatar`}
              >
                {user.avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-theme-surface rounded-full border border-theme-muted px-0.5 leading-none py-0.5">
                {user.vibe.split(' ').pop()}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-none">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] text-white/60 mt-0.5">{user.vibe}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification bell */}
        <button
          onClick={onBellClick}
          className="relative p-2 rounded-xl hover:bg-theme-surface transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell size={18} className="text-white/80" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-theme-highlight rounded-full" aria-hidden="true" />
          )}
        </button>

        {/* Vibe picker */}
        <div ref={vibeRef} className="relative">
          <button
            onClick={() => setVibeOpen(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-surface border border-theme-muted/30 rounded-xl text-xs font-medium hover:border-theme-accent/50 transition-colors"
            aria-haspopup="listbox"
            aria-expanded={vibeOpen}
            aria-label="Set your vibe status"
          >
            <span>{currentUser.vibe}</span>
            <ChevronDown size={12} className="text-white/60" />
          </button>
          {vibeOpen && (
            <div
              role="listbox"
              aria-label="Vibe status options"
              className="absolute right-0 top-full mt-1 w-48 bg-theme-surface border border-theme-muted/30 rounded-xl shadow-2xl py-1 z-50"
            >
              {vibeOptions.map(v => (
                <button
                  key={v}
                  role="option"
                  aria-selected={currentUser.vibe === v}
                  onClick={() => { updateUserVibe(currentUser.id, v); setVibeOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-theme-surface-hover transition-colors ${currentUser.vibe === v ? 'text-theme-accent font-bold' : 'text-white/80'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current user avatar */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{currentUser.name}</p>
            <p className="text-[10px] text-theme-accent font-bold">{currentUser.xp} XP</p>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-theme-accent flex items-center justify-center text-sm font-bold text-white ring-2 ring-theme-accent/40"
            aria-label={`${currentUser.name}, ${currentUser.role}`}
          >
            {currentUser.avatar}
          </div>
        </div>
      </div>
    </header>
  );
};
