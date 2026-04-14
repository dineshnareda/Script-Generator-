import { Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="py-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
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
