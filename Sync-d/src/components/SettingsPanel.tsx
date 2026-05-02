import React from 'react';
import { Settings, Sun, Moon, Pin, PinOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ACCENT_COLORS = [
  { id: 'purple', label: 'Purple', hex: '#8b5cf6' },
  { id: 'blue', label: 'Blue', hex: '#3b82f6' },
  { id: 'teal', label: 'Teal', hex: '#14b8a6' },
  { id: 'coral', label: 'Coral', hex: '#f43f5e' },
];

const WIDGETS = [
  { id: 'standup', label: 'AI Standup Bot' },
  { id: 'pulse', label: 'Team Pulse Feed' },
  { id: 'wins', label: 'Wins Feed' },
  { id: 'leaderboard', label: 'XP Leaderboard' },
];

export const SettingsPanel: React.FC = () => {
  const { theme, setTheme, accentColor, setAccentColor, layoutDensity, setLayoutDensity, pinnedWidgets, toggleWidgetPin } = useAppContext();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-zinc-400" />
        <h2 className="text-2xl font-black text-zinc-100">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="font-bold text-zinc-200 mb-4">Appearance</h3>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-zinc-200">Theme</p>
              <p className="text-xs text-zinc-500">Switch between dark and light mode</p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${theme === 'dark' ? 'bg-violet-600' : 'bg-zinc-600'}`}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle dark mode"
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform flex items-center justify-center text-[10px] ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}>
                {theme === 'dark' ? <Moon size={10} className="text-violet-600" /> : <Sun size={10} className="text-amber-500" />}
              </span>
            </button>
          </div>

          {/* Accent Color */}
          <div>
            <p className="text-sm font-medium text-zinc-200 mb-3">Accent Color</p>
            <div className="flex gap-3" role="radiogroup" aria-label="Accent color">
              {ACCENT_COLORS.map(color => (
                <button
                  key={color.id}
                  role="radio"
                  aria-checked={accentColor === color.id}
                  aria-label={color.label}
                  onClick={() => setAccentColor(color.id)}
                  className={`w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-zinc-900 transition-all ${accentColor === color.id ? 'ring-white scale-110' : 'ring-transparent hover:scale-105'} focus:outline-none focus:ring-white`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Layout Density */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="font-bold text-zinc-200 mb-4">Layout Density</h3>
          <div className="flex gap-3" role="radiogroup" aria-label="Layout density">
            {(['compact', 'comfortable'] as const).map(d => (
              <button
                key={d}
                role="radio"
                aria-checked={layoutDensity === d}
                onClick={() => setLayoutDensity(d)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-violet-500
                  ${layoutDensity === d ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Pinned Widgets */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="font-bold text-zinc-200 mb-4">Dashboard Widgets</h3>
          <div className="space-y-2">
            {WIDGETS.map(w => {
              const isPinned = pinnedWidgets.includes(w.id);
              return (
                <div key={w.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                  <span className="text-sm text-zinc-300">{w.label}</span>
                  <button
                    onClick={() => toggleWidgetPin(w.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500
                      ${isPinned ? 'bg-violet-500/20 text-violet-400 hover:bg-red-500/20 hover:text-red-400' : 'bg-zinc-700 text-zinc-500 hover:bg-violet-500/20 hover:text-violet-400'}`}
                    aria-label={isPinned ? `Unpin ${w.label}` : `Pin ${w.label}`}
                    aria-pressed={isPinned}
                  >
                    {isPinned ? <><PinOff size={12} /> Pinned</> : <><Pin size={12} /> Pin</>}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
