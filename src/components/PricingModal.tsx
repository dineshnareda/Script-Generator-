import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Check, ShoppingCart } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: (credits: number) => void;
}

export default function PricingModal({ isOpen, onClose, onBuy }: PricingModalProps) {
  const plans = [
    {
      credits: 100,
      price: 99,
      label: 'Starter Pack',
      description: 'Perfect for beginners',
      popular: false
    },
    {
      credits: 500,
      price: 399,
      label: 'Pro Creator',
      description: 'Most popular choice',
      popular: true
    },
    {
      credits: 1000,
      price: 899,
      label: 'Studio Master',
      description: 'Best value for power users',
      popular: false
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition-all z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-black uppercase tracking-widest mb-4">
                  <Zap className="w-4 h-4 fill-current" />
                  Refill Credits
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Plan</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  Get more credits to keep generating high-performance viral scripts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.credits}
                    className={`relative p-8 rounded-[2rem] border-2 transition-all flex flex-col ${
                      plan.popular 
                        ? 'border-indigo-600 bg-indigo-50/30 shadow-xl shadow-indigo-100' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-black text-slate-900 mb-1">{plan.label}</h3>
                      <p className="text-slate-500 text-xs font-bold">{plan.description}</p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-indigo-600 font-black">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>{plan.credits} Credits</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <Check className="w-4 h-4 text-indigo-600" />
                        <span>{Math.floor(plan.credits / 20)} Viral Scripts</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <Check className="w-4 h-4 text-indigo-600" />
                        <span>No Expiry</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <Check className="w-4 h-4 text-indigo-600" />
                        <span>Premium Support</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onBuy(plan.credits)}
                      className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                        plan.popular
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                          : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-center mt-12 text-slate-400 text-xs font-bold uppercase tracking-widest">
                Secure Payment via Razorpay • Instant Credit Refill
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
