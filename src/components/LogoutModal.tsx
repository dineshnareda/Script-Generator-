import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-6">
              <LogOut className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Logging Out?</h3>
            <p className="text-slate-500 font-medium mb-8">Are you sure you want to log out of your viral journey?</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black transition-all shadow-lg shadow-red-200"
              >
                Yes, Log Out
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-black transition-all border border-slate-100"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
