// Demo mode utilities
export const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@quitlab.app',
  image: null,
};

export const DEMO_QUIT_PLAN = {
  substance: 'nicotine',
  method: 'gradual',
  targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  dailyTarget: 5,
  costPerUnit: 0.5,
};

export const DEMO_CHECKINS = [
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), cravings: 3, used: 8, mood: 6, sleep: 7 },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), cravings: 4, used: 7, mood: 7, sleep: 6 },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), cravings: 5, used: 6, mood: 5, sleep: 5 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), cravings: 3, used: 5, mood: 8, sleep: 7 },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), cravings: 2, used: 4, mood: 8, sleep: 8 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), cravings: 3, used: 5, mood: 7, sleep: 6 },
];

export const DEMO_POSTS = [
  {
    id: '1',
    content: 'Day 3 of cutting back. The cravings are real but I\'m staying strong! 💪',
    author: { name: 'Sarah K.', id: 'user-1' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reactions: 12,
    comments: 3,
  },
  {
    id: '2',
    content: 'Found a great substitute - chewing gum is helping me through the rough patches.',
    author: { name: 'Mike T.', id: 'user-2' },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reactions: 8,
    comments: 5,
  },
  {
    id: '3',
    content: 'Had a slip yesterday but not letting it derail me. Back on track today!',
    author: { name: 'Anonymous', id: 'user-3' },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reactions: 15,
    comments: 7,
  },
];

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('quitlab-demo') === 'true';
}

export function setDemoMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  if (enabled) {
    localStorage.setItem('quitlab-demo', 'true');
  } else {
    localStorage.removeItem('quitlab-demo');
  }
}

export function clearDemoMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('quitlab-demo');
}
