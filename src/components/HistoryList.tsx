import { motion } from 'motion/react';
import { Clock, Trash2, ExternalLink, Copy, Check, RefreshCw } from 'lucide-react';
import { SavedScript } from '../types';
import { useState } from 'react';

interface HistoryListProps {
  history: SavedScript[];
  onDelete: (id: string) => void;
  onSelect: (script: SavedScript) => void;
  onRegenerate: (script: SavedScript) => Promise<void>;
}

export default function HistoryList({ history, onDelete, onSelect, onRegenerate }: HistoryListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async (e: React.MouseEvent, item: SavedScript) => {
    e.stopPropagation();
    if (regeneratingId) return;
    setRegeneratingId(item.id);
    try {
      await onRegenerate(item);
    } finally {
      setRegeneratingId(null);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No saved scripts yet.</p>
        <p className="text-slate-400 text-sm">Generate your first script to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ 
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            delay: index * 0.05,
            scale: { duration: 0.1 }
          }}
          className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          onClick={() => onSelect(item)}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">
                {item.input.platform}
              </span>
              <span className="text-slate-400 text-xs">
                {formatDate(item.timestamp)}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleRegenerate(e, item)}
                disabled={!!regeneratingId}
                className={`p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all ${regeneratingId === item.id ? 'animate-spin text-indigo-600' : ''}`}
                title="Re-generate"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleCopy(e, item.output.script, item.id)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600"
                title="Copy Script"
              >
                {copiedId === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">
            {item.input.topic}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 italic">
            "{item.output.hook}"
          </p>
          
          <div className="mt-3 flex items-center gap-2 text-indigo-600 text-xs font-semibold">
            <ExternalLink className="w-3 h-3" />
            View Full Strategy
          </div>
        </motion.div>
      ))}
    </div>
  );
}
