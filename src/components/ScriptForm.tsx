import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Video, 
  Type as TypeIcon, 
  Globe, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Target, 
  Send,
  Laugh,
  Heart,
  Zap,
  BookOpen,
  AlertTriangle,
  FileText,
  Lightbulb,
  HelpCircle,
  Flame,
  Users
} from 'lucide-react';
import { 
  ScriptInput, 
  Platform, 
  Tone, 
  Language, 
  Duration, 
  ContentType, 
  HookType 
} from '../types';
import CustomSelect from './ui/CustomSelect';

interface ScriptFormProps {
  onSubmit: (input: ScriptInput) => void;
  isLoading: boolean;
}

export default function ScriptForm({ onSubmit, isLoading }: ScriptFormProps) {
  const [formData, setFormData] = useState<ScriptInput>({
    topic: '',
    platform: 'Instagram',
    tone: 'Funny',
    language: 'English',
    duration: '30 sec',
    contentType: 'Story',
    hookType: 'Question',
    audience: ''
  });

  const platformOptions = [
    { 
      value: 'Instagram', 
      label: 'Instagram Reels', 
      image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
      description: 'Visual, aesthetic, and trending audio focused'
    },
    { 
      value: 'YouTube Shorts', 
      label: 'YouTube Shorts', 
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
      description: 'Search-driven and broad audience reach'
    }
  ];

  const toneOptions = [
    { value: 'Funny', label: 'Funny', icon: Laugh, description: 'Humorous and entertaining' },
    { value: 'Emotional', label: 'Emotional', icon: Heart, description: 'Heartfelt and touching' },
    { value: 'Motivational', label: 'Motivational', icon: Zap, description: 'Inspiring and energetic' },
    { value: 'Storytelling', label: 'Storytelling', icon: BookOpen, description: 'Narrative and engaging' },
    { value: 'Shocking', label: 'Shocking', icon: AlertTriangle, description: 'Surprising and bold' }
  ];

  const languageOptions = [
    { value: 'English', label: 'English', icon: Globe, description: 'Global reach' },
    { value: 'Hindi', label: 'Hindi', icon: Globe, description: 'Indian audience' },
    { value: 'Hinglish', label: 'Hinglish', icon: Globe, description: 'Modern conversational' }
  ];

  const durationOptions = [
    { value: '15 sec', label: '15 Seconds', icon: Clock, description: 'Quick and punchy' },
    { value: '30 sec', label: '30 Seconds', icon: Clock, description: 'Standard engagement' },
    { value: '60 sec', label: '60 Seconds', icon: Clock, description: 'Deep storytelling' }
  ];

  const contentTypeOptions = [
    { value: 'Story', label: 'Story', icon: FileText, description: 'Personal or narrative' },
    { value: 'Facts', label: 'Facts', icon: Lightbulb, description: 'Informative and educational' },
    { value: 'Motivation', label: 'Motivation', icon: Flame, description: 'Daily inspiration' },
    { value: 'Comedy', label: 'Comedy', icon: Laugh, description: 'Skit or humor' },
    { value: 'Educational', label: 'Educational', icon: BookOpen, description: 'Tutorial or guide' }
  ];

  const hookTypeOptions = [
    { value: 'Question', label: 'Question', icon: HelpCircle, description: 'Ask to engage' },
    { value: 'Shock', label: 'Shock', icon: AlertTriangle, description: 'Surprising statement' },
    { value: 'Relatable', label: 'Relatable', icon: Users, description: 'Common experience' },
    { value: 'Bold', label: 'Bold', icon: Zap, description: 'Strong opinion' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8"
    >
      {/* Topic Input */}
      <div className="space-y-3">
        <label className="flex items-center justify-between text-sm font-black text-slate-700 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Topic / Idea
          </div>
          <span className={`text-[10px] ${formData.topic.length >= 90 ? 'text-red-500' : 'text-slate-400'}`}>
            {formData.topic.length}/100
          </span>
        </label>
        <textarea
          required
          maxLength={100}
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., 5 Morning Habits for Productivity, Why AI won't replace you..."
          className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all resize-none h-32 font-bold text-slate-700 outline-none bg-slate-50/50 placeholder:text-slate-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomSelect
          label="Platform"
          icon={Video}
          options={platformOptions}
          value={formData.platform}
          onChange={(val) => setFormData({ ...formData, platform: val as Platform })}
        />

        <CustomSelect
          label="Tone"
          icon={MessageSquare}
          options={toneOptions}
          value={formData.tone}
          onChange={(val) => setFormData({ ...formData, tone: val as Tone })}
        />

        <CustomSelect
          label="Language"
          icon={Globe}
          options={languageOptions}
          value={formData.language}
          onChange={(val) => setFormData({ ...formData, language: val as Language })}
        />

        <CustomSelect
          label="Duration"
          icon={Clock}
          options={durationOptions}
          value={formData.duration}
          onChange={(val) => setFormData({ ...formData, duration: val as Duration })}
        />

        <CustomSelect
          label="Content Type"
          icon={TypeIcon}
          options={contentTypeOptions}
          value={formData.contentType}
          onChange={(val) => setFormData({ ...formData, contentType: val as ContentType })}
        />

        <CustomSelect
          label="Hook Type"
          icon={Target}
          options={hookTypeOptions}
          value={formData.hookType}
          onChange={(val) => setFormData({ ...formData, hookType: val as HookType })}
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <label className="flex items-center justify-between text-sm font-black text-slate-700 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Target Audience (Optional)
          </div>
          <span className={`text-[10px] ${formData.audience?.length === 20 ? 'text-red-500' : 'text-slate-400'}`}>
            {formData.audience?.length || 0}/20
          </span>
        </label>
        <input
          type="text"
          maxLength={20}
          value={formData.audience}
          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          placeholder="e.g., Students, Entrepreneurs, Fitness Enthusiasts..."
          className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 outline-none bg-slate-50/50 placeholder:text-slate-300"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        type="submit"
        className={`w-full py-5 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all ${
          isLoading 
            ? 'bg-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="tracking-wide">STRATEGIZING...</span>
          </>
        ) : (
          <>
            <Send className="w-6 h-6" />
            <span className="tracking-wide">GENERATE VIRAL SCRIPT</span>
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
