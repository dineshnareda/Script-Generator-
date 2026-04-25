import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Settings as SettingsIcon, AlertCircle } from 'lucide-react';

interface OfflineModalProps {
  isOpen: boolean;
  onGoToSettings: () => void;
}

export default function OfflineModal({ isOpen, onGoToSettings }: OfflineModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-white/20"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                <WifiOff className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                No Internet Connection
              </h2>
              
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                You're currently offline. Please check your network cables, modem, and router.
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onGoToSettings}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
                >
                  <SettingsIcon className="w-4 h-4" />
                  GO TO SETTINGS
                </motion.button>
                
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 py-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  STAYING OFFLINE? SOME FEATURES MAY BE LIMITED
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
