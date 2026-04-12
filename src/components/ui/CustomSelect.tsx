import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: any;
  image?: string;
  description?: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: any;
  className?: string;
}

export default function CustomSelect({ label, options, value, onChange, icon: LabelIcon, className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-3 relative ${className}`} ref={containerRef}>
      <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
        {LabelIcon && <LabelIcon className="w-4 h-4 text-indigo-500" />}
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all font-bold outline-none text-left ${
          isOpen 
            ? 'border-indigo-500 bg-white ring-4 ring-indigo-500/10' 
            : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedOption.image ? (
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5">
              <img src={selectedOption.image} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          ) : selectedOption.icon ? (
            <selectedOption.icon className="w-5 h-5 text-indigo-600" />
          ) : null}
          <span className="text-slate-700">{selectedOption.label}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 left-0 right-0 mt-2 p-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-80 overflow-y-auto"
          >
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    value === option.value 
                      ? 'bg-indigo-600 text-white' 
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      value === option.value ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'
                    }`}>
                      {option.image ? (
                        <div className="w-6 h-6 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5">
                          <img src={option.image} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                      ) : option.icon ? (
                        <option.icon className={`w-5 h-5 ${value === option.value ? 'text-white' : 'text-indigo-600'}`} />
                      ) : null}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{option.label}</p>
                      {option.description && (
                        <p className={`text-[10px] font-medium ${value === option.value ? 'text-white/70' : 'text-slate-400'}`}>
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {value === option.value && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
