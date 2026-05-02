import React from 'react';
import { Bell, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  assigned: <CheckCircle2 size={16} className="text-theme-accent" />,
  mention: <MessageSquare size={16} className="text-theme-highlight" />,
  blocked: <AlertTriangle size={16} className="text-theme-accent" />,
};

export const NotificationsPanel: React.FC = () => {
  const { notifications, markNotificationRead } = useAppContext();

  const grouped = {
    assigned: notifications.filter(n => n.type === 'assigned'),
    mention: notifications.filter(n => n.type === 'mention'),
    blocked: notifications.filter(n => n.type === 'blocked'),
  };

  const groupLabels: Record<string, string> = {
    assigned: 'Task Assignments',
    mention: 'Comments & Mentions',
    blocked: 'Blockers',
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bell size={24} className="text-theme-accent" />
        <h2 className="text-2xl font-black text-white">Notifications</h2>
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <Bell size={48} className="mx-auto mb-3 opacity-20" />
          <p>You're all caught up!</p>
        </div>
      )}

      <div className="space-y-6">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(type => {
          const group = grouped[type];
          if (group.length === 0) return null;
          return (
            <section key={type} aria-label={groupLabels[type]}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2 px-1">{groupLabels[type]}</h3>
              <div className="space-y-2">
                {group.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer
                      ${n.read ? 'bg-theme-surface/50 border-theme-muted/50 opacity-60' : 'bg-theme-surface border-theme-muted hover:border-theme-accent/30'}`}
                    role="article"
                    aria-label={n.message}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <span className="mt-0.5 shrink-0">{iconMap[n.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{n.message}</p>
                      <p className="text-xs text-white/40 mt-1">
                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-theme-accent rounded-full mt-1.5 shrink-0" aria-label="Unread" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
