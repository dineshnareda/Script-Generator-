import { Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onOpenTutorial: () => void;
}

export default function Header({ onOpenTutorial }: HeaderProps) {
  return (
    <header className="py-8 text-center relative">
      <div className="absolute top-0 right-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenTutorial}
          className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
        >
          <HelpCircle className="w-4 h-4" />
          TUTORIAL
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20"
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
          Viral Script <span className="text-indigo-600">Strategist</span>
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-500 max-w-lg mx-auto px-4"
      >
        Generate high-performance, scroll-stopping scripts for Instagram Reels and YouTube Shorts in seconds.
      </motion.p>
    </header>
  );
}
