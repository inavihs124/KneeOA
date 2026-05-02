import React, { memo } from 'react';
import type { Task } from '../data/mockData';
import { Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityConfig: Record<
  string,
  { label: string; classes: string; bar: string }
> = {
  urgent: {
    label: 'Urgent',
    classes: 'bg-theme-accent/15 text-theme-accent border-theme-accent/30',
    bar: 'bg-theme-accent',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-theme-highlight/15 text-theme-highlight border-theme-highlight/30',
    bar: 'bg-theme-highlight',
  },
  low: {
    label: 'Low',
    classes: 'bg-theme-surface-hover text-white/70 border-theme-muted',
    bar: 'bg-theme-muted',
  },
};

export const TaskCard: React.FC<TaskCardProps> = memo(({ task, onClick }) => {
  const { users, comments, moveTask } = useAppContext();
  const assignee = users.find(u => u.id === task.assigneeId);
  const taskComments = comments.filter(c => c.taskId === task.id);
  const priority = priorityConfig[task.priority];

  // Overdue = in-progress for > 24h
  const isOverdue =
    task.status === 'in-progress' &&
    Date.now() - new Date(task.updatedAt).getTime() > 86_400_000;

  const nextStatus =
    task.status === 'todo'
      ? ('in-progress' as const)
      : task.status === 'in-progress'
        ? ('done' as const)
        : null;
  const nextLabel = task.status === 'todo' ? 'Start' : 'Complete';

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextStatus) moveTask(task.id, nextStatus);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}. Priority: ${task.priority}. Click to open details.`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className={[
        'group relative bg-theme-surface p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none',
        'hover:border-theme-accent/60 hover:shadow-lg hover:shadow-theme-accent/10',
        'focus:outline-none focus:ring-2 focus:ring-theme-accent/50',
        isOverdue ? 'animate-pulse-shake border-theme-accent/50' : 'border-theme-muted',
        task.status === 'done' ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* Priority colour bar */}
      <div
        className={`absolute top-0 left-4 right-4 h-0.5 rounded-b-full ${priority.bar} opacity-60`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2 mb-3 mt-1">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priority.classes}`}
        >
          {priority.label}
        </span>
        <span className="text-[10px] font-black text-theme-highlight bg-theme-highlight/10 border border-theme-highlight/20 px-2 py-0.5 rounded-full shrink-0">
          +{task.xpValue} XP
        </span>
      </div>

      <h3
        className={`font-semibold text-sm mb-3 leading-snug line-clamp-2 ${
          task.status === 'done' ? 'line-through text-white/40' : 'text-white'
        }`}
      >
        {task.title}
      </h3>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          {assignee && (
            <div className="flex items-center gap-1.5" title={`Assigned to ${assignee.name}`}>
              <div className="w-6 h-6 rounded-full bg-theme-accent flex items-center justify-center text-[10px] font-bold text-white border border-theme-muted">
                {assignee.avatar}
              </div>
              <span className="text-[10px] text-white/50">
                {assignee.name.split(' ')[0]}
              </span>
            </div>
          )}
          {taskComments.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-white/50">
              <MessageSquare size={11} />
              {taskComments.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOverdue && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-theme-accent bg-theme-accent/10 px-1.5 py-0.5 rounded-md">
              <Clock size={10} /> Overdue
            </span>
          )}
          {nextStatus && (
            <button
              onClick={handleMove}
              aria-label={`${nextLabel} task: ${task.title}`}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-theme-highlight/20 text-theme-highlight hover:bg-theme-highlight/40 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-theme-highlight"
            >
              {nextLabel} <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
