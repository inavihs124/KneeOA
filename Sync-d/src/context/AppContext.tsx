import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { User, Task, Comment, Notification, TaskStatus, VibeStatus } from '../data/mockData';
import { users as initialUsers, initialTasks, initialComments, initialNotifications } from '../data/mockData';

interface AppState {
  currentUser: User;
  users: User[];
  tasks: Task[];
  comments: Comment[];
  notifications: Notification[];
  theme: 'dark' | 'light';
  accentColor: string;
  layoutDensity: 'compact' | 'comfortable';
  pinnedWidgets: string[];
}

interface AppContextType extends AppState {
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  setLayoutDensity: (density: 'compact' | 'comfortable') => void;
  toggleWidgetPin: (widgetId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  addComment: (taskId: string, text: string) => void;
  updateUserVibe: (userId: string, vibe: VibeStatus) => void;
  markNotificationRead: (id: string) => void;
  triggerWin: (task: Task) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState<string>('purple');
  const [layoutDensity, setLayoutDensity] = useState<'compact' | 'comfortable'>('comfortable');
  const [pinnedWidgets, setPinnedWidgets] = useState<string[]>(['standup', 'pulse']);

  const toggleWidgetPin = useCallback((widgetId: string) => {
    setPinnedWidgets(prev => 
      prev.includes(widgetId) ? prev.filter(id => id !== widgetId) : [...prev, widgetId]
    );
  }, []);

  const triggerWin = useCallback((task: Task) => {
    // In a real app, this might trigger a global event or add to a wins feed.
    // For now, we just update the user's XP.
    setUsers(prev => prev.map(u => {
      if (u.id === task.assigneeId) {
        return { ...u, xp: u.xp + task.xpValue };
      }
      return u;
    }));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (newStatus === 'done' && t.status !== 'done') {
          triggerWin(t);
        }
        return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return t;
    }));
  }, [triggerWin]);

  const addComment = useCallback((taskId: string, text: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      taskId,
      userId: currentUser.id,
      text,
      timestamp: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
  }, [currentUser.id]);

  const updateUserVibe = useCallback((userId: string, vibe: VibeStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, vibe } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, vibe }));
    }
  }, [currentUser.id]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const value = useMemo(() => ({
    currentUser, users, tasks, comments, notifications,
    theme, accentColor, layoutDensity, pinnedWidgets,
    setTheme, setAccentColor, setLayoutDensity, toggleWidgetPin,
    moveTask, addComment, updateUserVibe, markNotificationRead, triggerWin
  }), [
    currentUser, users, tasks, comments, notifications,
    theme, accentColor, layoutDensity, pinnedWidgets,
    setTheme, setAccentColor, setLayoutDensity, toggleWidgetPin,
    moveTask, addComment, updateUserVibe, markNotificationRead, triggerWin
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
