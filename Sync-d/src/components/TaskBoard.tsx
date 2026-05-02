import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { TaskStatus, Task } from '../data/mockData';
import { TaskCard } from './TaskCard';
import { TaskDrawer } from './TaskDrawer';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: '📋 To Do', color: 'border-theme-muted' },
  { id: 'in-progress', title: '⚡ In Progress', color: 'border-theme-highlight/40' },
  { id: 'done', title: '✅ Done', color: 'border-theme-accent/40' },
];

export const TaskBoard: React.FC = () => {
  const { tasks } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="flex-1 min-h-0 overflow-x-auto px-6 pb-6 flex gap-5 pt-4">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div
            key={col.id}
            className={`flex-1 min-w-[300px] max-w-[380px] flex flex-col bg-theme-surface/60 rounded-2xl border ${col.color}`}
            role="region"
            aria-label={`${col.title} column`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-theme-muted shrink-0">
              <h2 className="font-bold text-sm text-white">{col.title}</h2>
              <span className="text-[10px] font-black text-white/60 bg-theme-surface px-2 py-0.5 rounded-full border border-theme-muted">
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar"
              role="list"
              aria-label={`${col.title} tasks`}
            >
              {colTasks.map(task => (
                <div role="listitem" key={task.id}>
                  <TaskCard task={task} onClick={() => setSelectedTask(task)} />
                </div>
              ))}
              {colTasks.length === 0 && (
                <div className="text-center text-white/30 text-xs py-12 select-none">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}

      {selectedTask && (
        <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};
