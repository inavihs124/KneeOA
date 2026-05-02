export type VibeStatus = 'Deep Focus 🎯' | 'Available 🟢' | 'Slow Day 🌙' | 'In a Meeting 🔴';
export type Priority = 'low' | 'medium' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  vibe: VibeStatus;
  xp: number;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId: string | null;
  priority: Priority;
  xpValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'assigned' | 'blocked';
  message: string;
  read: boolean;
  timestamp: string;
}

export const users: User[] = [
  { id: 'u1', name: 'Alex Rivera', avatar: 'AR', role: 'Frontend Dev', vibe: 'Available 🟢', xp: 450 },
  { id: 'u2', name: 'Sam Chen', avatar: 'SC', role: 'UX Designer', vibe: 'Deep Focus 🎯', xp: 620 },
  { id: 'u3', name: 'Jordan Lee', avatar: 'JL', role: 'Product Manager', vibe: 'In a Meeting 🔴', xp: 380 },
  { id: 'u4', name: 'Taylor Swift', avatar: 'TS', role: 'Backend Dev', vibe: 'Slow Day 🌙', xp: 510 },
];

export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Design onboarding flow',
    status: 'todo',
    assigneeId: 'u2',
    priority: 'urgent',
    xpValue: 100,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 't2',
    title: 'Implement Dark Mode toggle',
    status: 'in-progress',
    assigneeId: 'u1',
    priority: 'medium',
    xpValue: 50,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // > 24 hours in progress
  },
  {
    id: 't3',
    title: 'Update API rate limits',
    status: 'in-progress',
    assigneeId: 'u4',
    priority: 'low',
    xpValue: 30,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(), // recent
  },
  {
    id: 't4',
    title: 'Draft Q3 Roadmap',
    status: 'done',
    assigneeId: 'u3',
    priority: 'urgent',
    xpValue: 200,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const initialComments: Comment[] = [
  {
    id: 'c1',
    taskId: 't2',
    userId: 'u3',
    text: 'How is this coming along? Need help?',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'c2',
    taskId: 't2',
    userId: 'u1',
    text: 'Almost done, just fixing a color contrast issue.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'assigned',
    message: 'You were assigned to "Implement Dark Mode toggle"',
    read: false,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'n2',
    userId: 'u1',
    type: 'mention',
    message: 'Jordan Lee commented on your task.',
    read: false,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];
