import { Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="py-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
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
