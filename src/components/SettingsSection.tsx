import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Leaf, 
  CheckCircle,
  Sunset,
  CloudMoon,
  BookOpen,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { User, Theme } from '../types';
import Tooltip from './ui/Tooltip';

interface SettingsSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onLogout: () => void;
  onResetTutorial: () => void;
}

export default function SettingsSection({ user, onUpdate, onResetTutorial }: SettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'instructions'>('appearance');
  const [presets, setPresets] = useState<string[]>(() => {
    const saved = localStorage.getItem(`presets_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newPreset, setNewPreset] = useState('');

  const themes: { id: Theme, label: string, icon: any, color: string, tooltip: string }[] = [
    { id: 'light', label: 'Light', icon: Sun, color: 'bg-amber-50 text-amber-600', tooltip: 'Classic clean look' },
    { id: 'dark', label: 'Dark', icon: Moon, color: 'bg-slate-900 text-slate-100', tooltip: 'Easy on the eyes' },
    { id: 'emerald', label: 'Emerald', icon: Leaf, color: 'bg-emerald-50 text-emerald-600', tooltip: 'Luxury emerald feel' },
    { id: 'sunset', label: 'Sunset', icon: Sunset, color: 'bg-orange-50 text-orange-600', tooltip: 'Warm evening creativity' },
    { id: 'midnight', label: 'Midnight', icon: CloudMoon, color: 'bg-indigo-950 text-cyan-400', tooltip: 'Deep focused environment' },
  ];

  const handleThemeChange = (theme: Theme) => {
    onUpdate({ ...user, theme });
  };

  const addPreset = () => {
    if (newPreset.trim()) {
      const updated = [...presets, newPreset.trim()];
      setPresets(updated);
      localStorage.setItem(`presets_${user.id}`, JSON.stringify(updated));
      setNewPreset('');
    }
  };

  const removePreset = (index: number) => {
    const updated = presets.filter((_, i) => i !== index);
    setPresets(updated);
    localStorage.setItem(`presets_${user.id}`, JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-[2rem] shadow-xl border border-white/10 flex gap-1">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === 'appearance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === 'instructions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Instructions
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'appearance' ? (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="glass-panel rounded-[2.5rem] p-10 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Theme Toggle</h3>
                <p className="text-slate-500 font-medium">Switch between premium studio environments</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <div className="bg-slate-100/50 dark:bg-white/5 p-2 rounded-[3rem] flex flex-wrap justify-center gap-2 border border-slate-200/50 dark:border-white/10 backdrop-blur-2xl shadow-inner">
                {themes.map((t) => (
                  <Tooltip key={t.id} content={t.tooltip} position="bottom">
                    <button
                      onClick={() => handleThemeChange(t.id)}
                      className={`relative group flex items-center gap-3 px-8 py-4 rounded-[2.5rem] transition-all duration-700 glass-light ${
                        user.theme === t.id 
                          ? 'text-white' 
                          : 'text-slate-500 hover:text-indigo-600'
                      }`}
                    >
                      {/* Active State Indicator (The "Toggle" Knob) */}
                      <AnimatePresence>
                        {user.theme === t.id && (
                          <motion.div
                            layoutId="active-theme-pill"
                            className="absolute inset-0 bg-indigo-600 shadow-2xl shadow-indigo-500/50"
                            transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative z-10 flex items-center gap-3">
                        <motion.div 
                          animate={{ rotate: user.theme === t.id ? 360 : 0 }}
                          transition={{ duration: 1, ease: "anticipate" }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            user.theme === t.id ? 'bg-white/20 scale-110 shadow-lg' : t.color
                          }`}
                        >
                          <t.icon className="w-5 h-5" />
                        </motion.div>
                        <span className="font-black text-xs tracking-[0.2em] uppercase">{t.label}</span>
                      </div>
                      
                      {/* Fluent Glass Light Sweep Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      </div>
                      
                      {/* Inner Glass Border */}
                      <div className="absolute inset-0 rounded-[2.5rem] border border-white/0 group-hover:border-white/30 transition-colors duration-500 z-10" />
                    </button>
                  </Tooltip>
                ))}
              </div>
              
              <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] tracking-widest uppercase">
                <div className="w-12 h-[1px] bg-slate-200 dark:bg-white/10" />
                <span>Select Studio Environment</span>
                <div className="w-12 h-[1px] bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="glass-panel rounded-[2.5rem] p-10 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Topic Presets</h3>
                <p className="text-slate-500 font-medium">Save recurring instructions for your specific video types</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newPreset}
                  onChange={(e) => setNewPreset(e.target.value)}
                  placeholder="e.g., Daily Tech News, Fitness Motivation..."
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-slate-700 bg-white/50"
                  onKeyDown={(e) => e.key === 'Enter' && addPreset()}
                />
                <button
                  onClick={addPreset}
                  className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {presets.map((preset, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index}
                    className="flex items-center justify-between p-5 bg-white/50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all"
                  >
                    <span className="font-bold text-slate-700">{preset}</span>
                    <button
                      onClick={() => removePreset(index)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
                {presets.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-slate-400 font-bold">No presets saved yet</p>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">Need a Refresher?</h4>
                    <p className="text-sm text-slate-500 font-medium">Re-watch the onboarding tutorial to learn all features.</p>
                  </div>
                  <button
                    onClick={onResetTutorial}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Reset Tutorial
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
