import { SavedScript } from '../types';

const STORAGE_KEY_PREFIX = 'viral_scripts_history_';

export const storage = {
  saveScript: (script: SavedScript, userId: string) => {
    const history = storage.getHistory(userId);
    const updatedHistory = [script, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updatedHistory));
  },

  getHistory: (userId: string): SavedScript[] => {
    if (!userId) return [];
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse history', e);
      return [];
    }
  },

  deleteScript: (id: string, userId: string) => {
    const history = storage.getHistory(userId);
    const updatedHistory = history.filter(s => s.id !== id);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updatedHistory));
  },

  updateScript: (id: string, updatedScript: SavedScript, userId: string) => {
    const history = storage.getHistory(userId);
    const updatedHistory = history.map(s => s.id === id ? updatedScript : s);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updatedHistory));
  },

  clearHistory: (userId: string) => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
  },

  getCredits: (): { credits: number; lastReset: string } => {
    const data = localStorage.getItem('viral_scripts_credits');
    if (!data) return { credits: 100, lastReset: new Date().toDateString() };
    try {
      return JSON.parse(data);
    } catch (e) {
      return { credits: 100, lastReset: new Date().toDateString() };
    }
  },

  saveCredits: (credits: number, lastReset: string) => {
    localStorage.setItem('viral_scripts_credits', JSON.stringify({ credits, lastReset }));
  },

  setToken: (token: string) => {
    localStorage.setItem('viral_scripts_token', token);
  },

  getToken: () => {
    return localStorage.getItem('viral_scripts_token');
  },

  removeToken: () => {
    localStorage.removeItem('viral_scripts_token');
  }
};
