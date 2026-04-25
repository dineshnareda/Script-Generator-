import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Smartphone, X, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';

interface OfflineModalProps {
  isOpen: boolean;
}

export default function OfflineModal({ isOpen }: OfflineModalProps) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-4 right-4 z-[200] flex justify-center pointer-events-none"
        >
          <div className="bg-slate-900 text-white rounded-[2rem] shadow-2xl p-4 pl-6 flex flex-col gap-4 w-full max-w-md pointer-events-auto border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">Offline Connection</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check your device internet</p>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 rounded-2xl text-[10px] font-black hover:bg-indigo-700 transition-all border-b-2 border-indigo-800"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                GO TO SETTINGS
              </motion.button>
            </div>

            <AnimatePresence>
              {showGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] mb-3 uppercase tracking-wider">
                      <Smartphone className="w-4 h-4" />
                      Quick Setup Guide
                    </div>
                    <ul className="text-[11px] font-bold text-slate-300 space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        Swipe down to open your <span className="text-white">Phone Control Center</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        Tap the <span className="text-white">Wi-Fi</span> or <span className="text-white">Mobile Data</span> icon to enable
                      </li>
                    </ul>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGuide(false)}
                      className="mt-4 w-full py-2 bg-white/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-3 h-3" />
                      CLOSE GUIDE
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
