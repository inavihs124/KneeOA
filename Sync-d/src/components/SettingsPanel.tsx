import React from 'react';
import { Settings, Pin, PinOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const THEMES = [
  { id: 'purple-haze', label: 'Purple Haze', base: '#1a0533', accent: '#BF5FFF', highlight: '#00E5FF' },
  { id: 'ocean-mode', label: 'Ocean Mode', base: '#001a2e', accent: '#00E5FF', highlight: '#3B82F6' },
  { id: 'sunset-mode', label: 'Sunset Mode', base: '#1a0a00', accent: '#FF6B35', highlight: '#FBBF24' },
  { id: 'matrix-mode', label: 'Matrix Mode', base: '#001a0a', accent: '#00FF88', highlight: '#84CC16' },
];

const WIDGETS = [
  { id: 'standup', label: 'AI Standup Bot' },
  { id: 'pulse', label: 'Team Pulse Feed' },
  { id: 'wins', label: 'Wins Feed' },
  { id: 'leaderboard', label: 'XP Leaderboard' },
];

export const SettingsPanel: React.FC = () => {
  const { activeTheme, setActiveTheme, layoutDensity, setLayoutDensity, pinnedWidgets, toggleWidgetPin } = useAppContext();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-theme-muted" />
        <h2 className="text-2xl font-black text-white">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <section className="bg-theme-surface border border-theme-muted/30 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Appearance</h3>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(theme => {
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all overflow-hidden relative ${
                    isActive ? 'border-theme-accent scale-[1.02]' : 'border-transparent hover:border-theme-muted'
                  }`}
                  style={{ backgroundColor: theme.base }}
                >
                  <span className="text-sm font-bold text-white mb-2 z-10">{theme.label}</span>
                  <div className="flex gap-2 z-10">
                    <div className="w-6 h-6 rounded-full shadow-lg border border-white/20" style={{ backgroundColor: theme.accent }}></div>
                    <div className="w-6 h-6 rounded-full shadow-lg border border-white/20 -ml-4" style={{ backgroundColor: theme.highlight }}></div>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 border-[3px] border-theme-accent rounded-xl pointer-events-none opacity-50" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Layout Density */}
        <section className="bg-theme-surface border border-theme-muted/30 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Layout Density</h3>
          <div className="flex gap-3" role="radiogroup" aria-label="Layout density">
            {(['compact', 'comfortable'] as const).map(d => (
              <button
                key={d}
                role="radio"
                aria-checked={layoutDensity === d}
                onClick={() => setLayoutDensity(d)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-theme-accent
                  ${layoutDensity === d ? 'bg-theme-accent text-white' : 'bg-theme-surface hover:bg-theme-surface-hover text-white/70'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Pinned Widgets */}
        <section className="bg-theme-surface border border-theme-muted/30 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Dashboard Widgets</h3>
          <div className="space-y-2">
            {WIDGETS.map(w => {
              const isPinned = pinnedWidgets.includes(w.id);
              return (
                <div key={w.id} className="flex items-center justify-between p-3 bg-theme-surface rounded-xl">
                  <span className="text-sm text-white/90">{w.label}</span>
                  <button
                    onClick={() => toggleWidgetPin(w.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-theme-accent
                      ${isPinned ? 'bg-theme-accent/20 text-theme-accent hover:bg-red-500/20 hover:text-red-400' : 'bg-theme-surface-hover text-white/60 hover:bg-theme-accent/20 hover:text-theme-accent'}`}
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
