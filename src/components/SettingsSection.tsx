import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Leaf, 
  CheckCircle,
  Sunset,
  CloudMoon
} from 'lucide-react';
import { User, Theme } from '../types';
import Tooltip from './ui/Tooltip';

interface SettingsSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onLogout: () => void;
}

export default function SettingsSection({ user, onUpdate }: SettingsSectionProps) {
  const themes: { id: Theme, label: string, icon: any, color: string, tooltip: string }[] = [
    { id: 'light', label: 'Light Mode', icon: Sun, color: 'bg-amber-50 text-amber-600', tooltip: 'Classic clean look for bright environments' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, color: 'bg-slate-900 text-slate-100', tooltip: 'Easy on the eyes for low-light environments' },
    { id: 'emerald', label: 'Premium Green', icon: Leaf, color: 'bg-emerald-50 text-emerald-600', tooltip: 'Exclusive emerald aesthetic for a luxury feel' },
    { id: 'sunset', label: 'Sunset Glow', icon: Sunset, color: 'bg-orange-50 text-orange-600', tooltip: 'Warm and cozy aesthetic for evening creativity' },
    { id: 'midnight', label: 'Midnight Sky', icon: CloudMoon, color: 'bg-indigo-950 text-cyan-400', tooltip: 'Deep, focused environment for late-night sessions' },
  ];

  const handleThemeChange = (theme: Theme) => {
    onUpdate({ ...user, theme });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">Appearance</h3>
            <p className="text-slate-500 font-medium">Customize the look and feel of your studio</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {themes.map((t) => (
            <Tooltip key={t.id} content={t.tooltip} position="bottom">
              <button
                onClick={() => handleThemeChange(t.id)}
                className={`w-full flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all ${
                  user.theme === t.id 
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-lg shadow-indigo-100' 
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.color}`}>
                  <t.icon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className={`block font-black text-sm mb-1 ${user.theme === t.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {t.label}
                  </span>
                  {user.theme === t.id && (
                    <div className="flex items-center justify-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </div>
                  )}
                </div>
              </button>
            </Tooltip>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
