import React, { useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import confetti from 'canvas-confetti';

const REACTIONS = ['🎉', '🔥', '💯', '👏', '🚀', '⭐'];

export const WinsFeed: React.FC = () => {
  const { tasks, users } = useAppContext();
  const fired = useRef<Set<string>>(new Set());

  const doneTasks = tasks.filter(t => t.status === 'done');

  useEffect(() => {
    const newest = doneTasks[doneTasks.length - 1];
    if (newest && !fired.current.has(newest.id)) {
      fired.current.add(newest.id);
      void confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneTasks.length]);

  return (
    <div className="p-6 max-w-2xl mx-auto" role="feed" aria-label="Team Wins">
      <div className="flex items-center gap-3 mb-6">
        <Trophy size={24} className="text-theme-highlight" />
        <h2 className="text-2xl font-black text-white">Team Wins 🏆</h2>
      </div>

      {doneTasks.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <Trophy size={48} className="mx-auto mb-3 opacity-30" />
          <p>No wins yet — complete a task to celebrate!</p>
        </div>
      )}

      <div className="space-y-4">
        {[...doneTasks].reverse().map(task => {
          const assignee = users.find(u => u.id === task.assigneeId);
          return (
            <div
              key={task.id}
              className="bg-gradient-to-r from-theme-accent/30 to-theme-highlight/20 border border-theme-accent/30 rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 text-5xl opacity-10 select-none" aria-hidden="true">🏆</div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-theme-accent flex items-center justify-center text-sm font-black text-white shrink-0">
                  {assignee?.avatar ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60 mb-1">
                    <span className="font-bold text-theme-highlight">{assignee?.name ?? 'Someone'}</span> completed
                  </p>
                  <h3 className="font-bold text-white text-base leading-snug">{task.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-black text-theme-highlight bg-theme-highlight/10 border border-theme-highlight/20 px-2 py-0.5 rounded-full">
                      +{task.xpValue} XP earned
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emoji reactions */}
              <div className="flex gap-2 mt-4" role="group" aria-label="Emoji reactions">
                {REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    className="text-lg hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-theme-accent rounded"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
