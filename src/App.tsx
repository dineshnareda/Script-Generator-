import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw, History as HistoryIcon, PlusCircle, Trash2 } from 'lucide-react';
import Header from './components/Header';
import ScriptForm from './components/ScriptForm';
import ScriptOutput from './components/ScriptOutput';
import HistoryList from './components/HistoryList';
import ConfirmationModal from './components/ConfirmationModal';
import AdBanner from './components/AdBanner';
import { ScriptInput, ScriptOutput as ScriptOutputType, SavedScript } from './types';
import { generateViralScript } from './services/gemini';
import { storage } from './lib/storage';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ScriptOutputType | null>(null);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedScript[]>([]);
  const [view, setView] = useState<'generator' | 'history'>('generator');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(storage.getHistory());
  }, []);

  const handleGenerate = async (input: ScriptInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateViralScript(input);
      setOutput(result);
      
      const newSavedScript: SavedScript = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        input,
        output: result
      };
      
      storage.saveScript(newSavedScript);
      setHistory(storage.getHistory());
      setCurrentScriptId(newSavedScript.id);

      // Scroll to output on mobile
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate script. Please check your API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOutput(null);
    setCurrentScriptId(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      storage.deleteScript(deleteId);
      setHistory(storage.getHistory());
      setDeleteId(null);
    }
  };

  const handleClearHistory = () => {
    setIsClearModalOpen(true);
  };

  const confirmClear = () => {
    storage.clearHistory();
    setHistory([]);
    setIsClearModalOpen(false);
  };

  const handleSelectHistory = (script: SavedScript) => {
    setOutput(script.output);
    setCurrentScriptId(script.id);
    setView('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegenerateHistory = async (script: SavedScript) => {
    try {
      const result = await generateViralScript(script.input);
      const updatedScript: SavedScript = {
        ...script,
        timestamp: Date.now(),
        output: result
      };
      storage.updateScript(script.id, updatedScript);
      setHistory(storage.getHistory());
      // Optionally show the new result immediately
      setOutput(result);
      setCurrentScriptId(script.id);
    } catch (err) {
      console.error(err);
      setError('Failed to re-generate script.');
    }
  };

  const handleUpdateOutput = (updatedOutput: ScriptOutputType) => {
    if (!currentScriptId) return;
    
    const scriptToUpdate = history.find(s => s.id === currentScriptId);
    if (scriptToUpdate) {
      const updatedSavedScript: SavedScript = {
        ...scriptToUpdate,
        output: updatedOutput
      };
      storage.updateScript(currentScriptId, updatedSavedScript);
      setHistory(storage.getHistory());
      setOutput(updatedOutput);
    }
  };

  const filteredHistory = history.filter(script => 
    script.input.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.output.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <Header />

        <AdBanner adSlot="9266679211" className="max-w-4xl mx-auto" />

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
            <button
              onClick={() => setView('generator')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                view === 'generator' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Generator
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                view === 'history' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              History
              {history.length > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                  view === 'history' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'generator' ? (
            <motion.main
              key="generator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Form Section */}
              <div className={`lg:col-span-5 transition-all duration-500 ${output ? 'lg:col-span-4' : 'lg:col-span-8 lg:col-start-3'}`}>
                <ScriptForm onSubmit={handleGenerate} isLoading={isLoading} />
                
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Output Section */}
              <AnimatePresence>
                {output && (
                  <motion.div
                    id="output-section"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="lg:col-span-7 lg:col-span-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Your Viral Strategy</h2>
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                    <ScriptOutput 
                      output={output} 
                      onUpdate={handleUpdateOutput}
                    />
                    <AdBanner adSlot="9266679211" className="mt-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto w-full"
            >
              <AdBanner adSlot="9266679211" className="mb-8" />
              
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by topic or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-4 pl-12 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">History</h2>
                  <p className="text-slate-500 text-sm">Last 50 generated scripts</p>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
              <HistoryList 
                history={filteredHistory} 
                onDelete={handleDeleteHistory} 
                onSelect={handleSelectHistory} 
                onRegenerate={handleRegenerateHistory}
              />
              {filteredHistory.length === 0 && history.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 font-medium">No scripts found matching "{searchTerm}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmClear}
        title="Clear All History"
        message="Are you sure you want to delete all saved scripts? This action cannot be undone."
        confirmText="Clear All"
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Script"
        message="Are you sure you want to delete this script? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

