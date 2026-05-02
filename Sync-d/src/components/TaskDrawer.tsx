import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send } from 'lucide-react';
import type { Task, TaskStatus } from '../data/mockData';
import { useAppContext } from '../context/AppContext';

interface TaskDrawerProps {
  task: Task;
  onClose: () => void;
}

const EMOJI_REACTIONS = ['👍', '🔥', '💯', '😂', '❤️', '🎯'];

export const TaskDrawer: React.FC<TaskDrawerProps> = ({ task, onClose }) => {
  const { comments, users, addComment, moveTask } = useAppContext();
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const taskComments = comments.filter(c => c.taskId === task.id);
  const assignee = users.find(u => u.id === task.assigneeId);

  // Focus input on open, trap focus in drawer
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new comments
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [taskComments.length]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;
    addComment(task.id, text);
    setNewComment('');
  }, [newComment, task.id, addComment]);

  const nextStatus: TaskStatus | null =
    task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : null;
  const nextLabel = task.status === 'todo' ? 'Start Task' : 'Mark Done';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Task details: ${task.title}`}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-zinc-100 leading-snug">{task.title}</h2>
            {assignee && (
              <p className="text-xs text-zinc-500 mt-1">
                Assigned to <span className="text-violet-400 font-medium">{assignee.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Close task drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Meta info */}
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-4 text-xs shrink-0">
          <span className={`font-bold uppercase tracking-wider px-2 py-1 rounded-full
            ${task.priority === 'urgent' ? 'bg-red-500/15 text-red-400' :
              task.priority === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                'bg-emerald-500/15 text-emerald-400'}`}>
            {task.priority}
          </span>
          <span className="text-violet-400 font-bold">+{task.xpValue} XP</span>
          <span className="text-zinc-500 capitalize">{task.status.replace('-', ' ')}</span>

          {nextStatus && (
            <button
              onClick={() => { moveTask(task.id, nextStatus); onClose(); }}
              className="ml-auto px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {nextLabel} →
            </button>
          )}
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar" role="log" aria-label="Task comments" aria-live="polite">
          {taskComments.length === 0 && (
            <p className="text-center text-zinc-600 text-sm mt-8">No comments yet. Start the conversation!</p>
          )}
          {taskComments.map(comment => {
            const author = users.find(u => u.id === comment.userId);
            return (
              <div key={comment.id} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
                  {author?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-xs text-zinc-200">{author?.name}</span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-zinc-900 rounded-2xl rounded-tl-sm px-3 py-2 border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
                    {comment.text}
                  </div>
                  {/* Emoji reactions */}
                  <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {EMOJI_REACTIONS.map(emoji => (
                      <button
                        key={emoji}
                        className="text-sm hover:scale-125 transition-transform"
                        aria-label={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2" aria-label="Add comment form">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Comment on this task..."
              aria-label="Comment text"
              maxLength={500}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              aria-label="Send comment"
              className="p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
