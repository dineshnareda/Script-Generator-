import { SavedScript } from '../types';

const STORAGE_KEY = 'viral_scripts_history';

export const storage = {
  saveScript: (script: SavedScript) => {
    const history = storage.getHistory();
    const updatedHistory = [script, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  getHistory: (): SavedScript[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse history', e);
      return [];
    }
  },

  deleteScript: (id: string) => {
    const history = storage.getHistory();
    const updatedHistory = history.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  updateScript: (id: string, updatedScript: SavedScript) => {
    const history = storage.getHistory();
    const updatedHistory = history.map(s => s.id === id ? updatedScript : s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
