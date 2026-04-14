import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Users,
  Info,
  ChevronDown
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
import Tooltip from './ui/Tooltip';

interface ScriptFormProps {
  onSubmit: (input: ScriptInput) => void;
  isLoading: boolean;
  userId: string;
}

export default function ScriptForm({ onSubmit, isLoading, userId }: ScriptFormProps) {
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

  const [presets, setPresets] = useState<string[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`presets_${userId}`);
    if (saved) setPresets(JSON.parse(saved));
  }, [userId]);

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
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-black text-slate-700 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Topic / Idea</span>
            <Tooltip content="What is your video about? Be specific for better results.">
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-indigo-500 transition-colors" />
            </Tooltip>
          </label>
          <div className="flex items-center gap-3">
            {presets.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black hover:bg-indigo-100 transition-all"
                >
                  PRESETS
                  <ChevronDown className={`w-3 h-3 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showPresets && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 p-2"
                    >
                      {presets.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, topic: p });
                            setShowPresets(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 truncate"
                        >
                          {p}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <span className={`text-[10px] ${formData.topic.length >= 180 ? 'text-red-500' : 'text-slate-400'}`}>
              {formData.topic.length}/200
            </span>
          </div>
        </div>
        <div className="relative">
          <textarea
            required
            maxLength={200}
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., 5 Morning Habits for Productivity, Why AI won't replace you..."
            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white transition-all resize-none h-32 font-bold text-slate-700 outline-none bg-slate-50/50 placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomSelect
          label="Platform"
          icon={Video}
          options={platformOptions}
          value={formData.platform}
          onChange={(val) => setFormData({ ...formData, platform: val as Platform })}
          tooltip="Optimizes the script structure and SEO for the specific platform's algorithm."
        />

        <CustomSelect
          label="Tone"
          icon={MessageSquare}
          options={toneOptions}
          value={formData.tone}
          onChange={(val) => setFormData({ ...formData, tone: val as Tone })}
          tooltip="Sets the emotional vibe of the script to resonate with your audience."
        />

        <CustomSelect
          label="Language"
          icon={Globe}
          options={languageOptions}
          value={formData.language}
          onChange={(val) => setFormData({ ...formData, language: val as Language })}
          tooltip="The primary language for the script and captions."
        />

        <CustomSelect
          label="Duration"
          icon={Clock}
          options={durationOptions}
          value={formData.duration}
          onChange={(val) => setFormData({ ...formData, duration: val as Duration })}
          tooltip="Controls the length and pacing of the content."
        />

        <CustomSelect
          label="Content Type"
          icon={TypeIcon}
          options={contentTypeOptions}
          value={formData.contentType}
          onChange={(val) => setFormData({ ...formData, contentType: val as ContentType })}
          tooltip="Defines the format and structure of the script (e.g., educational vs. comedy)."
        />

        <CustomSelect
          label="Hook Type"
          icon={Target}
          options={hookTypeOptions}
          value={formData.hookType}
          onChange={(val) => setFormData({ ...formData, hookType: val as HookType })}
          tooltip="The opening strategy to grab attention in the first 3 seconds."
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-black text-slate-700 uppercase tracking-widest">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Target Audience (Optional)</span>
            <Tooltip content="Helps the AI tailor the language and references to a specific group.">
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-indigo-500 transition-colors" />
            </Tooltip>
          </label>
          <span className={`text-[10px] ${formData.audience?.length === 80 ? 'text-red-500' : 'text-slate-400'}`}>
            {formData.audience?.length || 0}/80
          </span>
        </div>
        <input
          type="text"
          maxLength={80}
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
