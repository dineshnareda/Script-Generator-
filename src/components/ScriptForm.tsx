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
  Send 
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

  const platforms: Platform[] = ['Instagram', 'YouTube Shorts'];
  const tones: Tone[] = ['Funny', 'Emotional', 'Motivational', 'Storytelling', 'Shocking'];
  const languages: Language[] = ['Hindi', 'English', 'Hinglish'];
  const durations: Duration[] = ['15 sec', '30 sec', '60 sec'];
  const contentTypes: ContentType[] = ['Story', 'Facts', 'Motivation', 'Comedy', 'Educational'];
  const hookTypes: HookType[] = ['Question', 'Shock', 'Relatable', 'Bold'];

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
      className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8"
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
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all resize-none h-28 font-medium outline-none bg-slate-50/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
            <Video className="w-4 h-4 text-indigo-500" />
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50 appearance-none cursor-pointer"
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Tone */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            Tone
          </label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value as Tone })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50 appearance-none cursor-pointer"
          >
            {tones.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Language */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
            <Globe className="w-4 h-4 text-indigo-500" />
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50 appearance-none cursor-pointer"
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-indigo-500" />
            Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value as Duration })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50 appearance-none cursor-pointer"
          >
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Content Type */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
            <TypeIcon className="w-4 h-4 text-indigo-500" />
            Content Type
          </label>
          <select
            value={formData.contentType}
            onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50 appearance-none cursor-pointer"
          >
            {contentTypes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Hook Type */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
            <Target className="w-4 h-4 text-indigo-500" />
            Hook Type
          </label>
          <select
            value={formData.hookType}
            onChange={(e) => setFormData({ ...formData, hookType: e.target.value as HookType })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50 appearance-none cursor-pointer"
          >
            {hookTypes.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <label className="flex items-center justify-between text-sm font-black text-slate-700 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
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
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all font-medium outline-none bg-slate-50/50"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        type="submit"
        className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
          isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Strategizing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Generate Viral Script
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
