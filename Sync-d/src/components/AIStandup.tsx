import React from 'react';
import { Bot, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const AIStandup: React.FC = () => {
  const { users, tasks } = useAppContext();

  const yesterday = Date.now() - 86_400_000;
  const twoDaysAgo = Date.now() - 86_400_000 * 2;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Bot size={24} className="text-cyan-400" />
        <h2 className="text-2xl font-black text-zinc-100">AI Standup Bot</h2>
      </div>
      <p className="text-zinc-500 text-sm mb-6">
        Auto-generated daily digest · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      <div className="space-y-4">
        {users.map(user => {
          const completedYesterday = tasks.filter(t =>
            t.assigneeId === user.id &&
            t.status === 'done' &&
            new Date(t.updatedAt).getTime() > twoDaysAgo
          );
          const inProgress = tasks.filter(t =>
            t.assigneeId === user.id && t.status === 'in-progress'
          );
          const overdue = tasks.filter(t =>
            t.assigneeId === user.id &&
            t.status === 'in-progress' &&
            new Date(t.updatedAt).getTime() < yesterday
          );

          return (
            <article
              key={user.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
              aria-label={`Standup for ${user.name}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                  {user.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100">{user.name}</h3>
                  <p className="text-xs text-zinc-500">{user.role} · {user.vibe}</p>
                </div>
                <span className="ml-auto text-xs font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-full">
                  {user.xp} XP
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {/* Yesterday */}
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs mb-1.5">
                    <CheckCircle size={12} /> Completed Yesterday
                  </div>
                  {completedYesterday.length > 0 ? (
                    <ul className="space-y-1 ml-5">
                      {completedYesterday.map(t => (
                        <li key={t.id} className="text-zinc-300 text-xs list-disc">
                          {t.title} <span className="text-emerald-400 font-bold">(+{t.xpValue} XP)</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 text-xs ml-5">Nothing completed recently.</p>
                  )}
                </div>

                {/* Today */}
                <div>
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs mb-1.5">
                    <Clock size={12} /> Working On Today
                  </div>
                  {inProgress.length > 0 ? (
                    <ul className="space-y-1 ml-5">
                      {inProgress.map(t => (
                        <li key={t.id} className="text-zinc-300 text-xs list-disc">{t.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 text-xs ml-5">No active tasks.</p>
                  )}
                </div>

                {/* Blockers */}
                {overdue.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-red-400 font-semibold text-xs mb-1">
                      <AlertTriangle size={12} /> Blocked / Overdue
                    </div>
                    <ul className="space-y-1 ml-4">
                      {overdue.map(t => (
                        <li key={t.id} className="text-red-300 text-xs list-disc">{t.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
