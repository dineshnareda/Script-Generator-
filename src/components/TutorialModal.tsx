import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Zap, 
  History, 
  Settings,
  CheckCircle2,
  Video,
  MessageSquare,
  FileText
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to Viral Script Strategist",
    description: "The ultimate AI-powered tool to help content creators grow their social media presence with high-converting scripts.",
    icon: Sparkles,
    color: "bg-indigo-500",
    image: "https://picsum.photos/seed/viral/800/400"
  },
  {
    title: "Start with a Great Idea",
    description: "Enter your video topic or use our PRESETS for inspiration. Be specific! The more detail you provide, the better the AI can strategize for you.",
    icon: Target,
    color: "bg-rose-500",
    image: "https://picsum.photos/seed/idea/800/400"
  },
  {
    title: "Customize Your Strategy",
    description: "Fine-tune your script with advanced options like Platform optimization, Tone, Visual Style, and CTA Goals to match your unique brand.",
    icon: Video,
    color: "bg-amber-500",
    image: "https://picsum.photos/seed/strategy/800/400"
  },
  {
    title: "Generate & Refine",
    description: "Get a complete viral package: Hook, Script, Titles, and SEO keywords. You can edit the script directly or export it as a PDF for your production team.",
    icon: Zap,
    color: "bg-emerald-500",
    image: "https://picsum.photos/seed/generate/800/400"
  },
  {
    title: "Manage Your Growth",
    description: "Access your history to reuse successful scripts and customize your workspace in Settings with premium themes.",
    icon: History,
    color: "bg-blue-500",
    image: "https://picsum.photos/seed/history/800/400"
  }
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side - Image/Visual */}
          <div className={`hidden md:block w-1/3 ${step.color} relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <img 
                src={step.image} 
                alt="Tutorial visual" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-24 h-24 text-white drop-shadow-2xl" />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 p-8 sm:p-12 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${step.color} text-white md:hidden`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                    {step.title}
                  </h2>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentStep ? `w-8 ${step.color}` : 'w-2 bg-slate-100'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className={`px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg ${
                    currentStep === steps.length - 1
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : `bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700`
                  }`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      GET STARTED
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      NEXT
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
