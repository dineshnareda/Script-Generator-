import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  RefreshCw, 
  History as HistoryIcon, 
  Trash2, 
  Settings as SettingsIcon,
  LayoutDashboard
} from 'lucide-react';
import Header from './components/Header';
import ScriptForm from './components/ScriptForm';
import ScriptOutput from './components/ScriptOutput';
import HistoryList from './components/HistoryList';
import ConfirmationModal from './components/ConfirmationModal';
import AdBanner from './components/AdBanner';
import SettingsSection from './components/SettingsSection';
import { ScriptInput, ScriptOutput as ScriptOutputType, SavedScript, User, AppView } from './types';
import { generateViralScript } from './services/gemini';
import { storage } from './lib/storage';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest User',
  email: 'guest@example.com',
  authMode: 'password',
  theme: 'light'
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ScriptOutputType | null>(null);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedScript[]>([]);
  const [view, setView] = useState<AppView>('generator');
  const [user, setUser] = useState<User>(GUEST_USER);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(storage.getHistory(user.id));
  }, [user.id]);

  useEffect(() => {
    if (user.theme) {
      document.documentElement.classList.remove('dark', 'emerald', 'sunset', 'midnight');
      if (user.theme !== 'light') {
        document.documentElement.classList.add(user.theme);
      }
    }
  }, [user.theme]);

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
      
      storage.saveScript(newSavedScript, user.id);
      setHistory(storage.getHistory(user.id));
      setCurrentScriptId(newSavedScript.id);

      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate script. Please try again.');
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

  const handleUpdateOutput = (updatedOutput: ScriptOutputType) => {
    if (!currentScriptId) return;
    const scriptToUpdate = history.find(s => s.id === currentScriptId);
    if (scriptToUpdate) {
      const updatedSavedScript: SavedScript = {
        ...scriptToUpdate,
        output: updatedOutput
      };
      storage.updateScript(currentScriptId, updatedSavedScript, user.id);
      setHistory(storage.getHistory(user.id));
      setOutput(updatedOutput);
    }
  };

  const handleDeleteScript = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      storage.deleteScript(deleteId, user.id);
      setHistory(storage.getHistory(user.id));
      if (currentScriptId === deleteId) {
        setOutput(null);
        setCurrentScriptId(null);
      }
      setDeleteId(null);
    }
  };

  const clearAllHistory = () => {
    storage.clearHistory(user.id);
    setHistory([]);
    setOutput(null);
    setCurrentScriptId(null);
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
      storage.updateScript(script.id, updatedScript, user.id);
      setHistory(storage.getHistory(user.id));
      setOutput(result);
      setCurrentScriptId(script.id);
    } catch (err) {
      console.error(err);
      setError('Failed to re-generate script.');
    }
  };

  const filteredHistory = history.filter(script => 
    script.input.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.output.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      user.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 
      user.theme === 'emerald' ? 'bg-emerald-950 text-emerald-50' : 
      user.theme === 'sunset' ? 'bg-[#2d1b2d] text-[#fff5f5]' :
      user.theme === 'midnight' ? 'bg-[#0a0a0a] text-[#f0f9ff]' :
      'bg-slate-50 text-slate-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <Header />

        <AdBanner adSlot="9266679211" className="max-w-4xl mx-auto" />

        {/* Navigation & User Info */}
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-[2rem] shadow-xl border border-white/10 flex flex-wrap justify-center gap-1">
            <NavButton 
              active={view === 'generator'} 
              onClick={() => setView('generator')} 
              icon={LayoutDashboard} 
              label="Studio" 
            />
            <NavButton 
              active={view === 'history'} 
              onClick={() => setView('history')} 
              icon={HistoryIcon} 
              label="History" 
              badge={history.length}
            />
            <NavButton 
              active={view === 'settings'} 
              onClick={() => setView('settings')} 
              icon={SettingsIcon} 
              label="Settings" 
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'generator' ? (
            <motion.main
              key="generator"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Form Section */}
              <div className={`lg:col-span-5 transition-all duration-500 ${output ? 'lg:col-span-4' : 'lg:col-span-8 lg:col-start-3'}`}>
                <div className="relative">
                  <ScriptForm 
                    onSubmit={handleGenerate} 
                    isLoading={isLoading} 
                    userId={user.id}
                  />
                </div>
                
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
                      onRegenerate={() => {
                        const script = history.find(s => s.id === currentScriptId);
                        if (script) handleRegenerateHistory(script);
                      }}
                    />
                    <AdBanner adSlot="9266679211" className="mt-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          ) : view === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-black text-slate-900">Script History</h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Search scripts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    />
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => setIsClearModalOpen(true)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                      title="Clear All"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <HistoryList 
                history={filteredHistory} 
                onSelect={handleSelectHistory}
                onDelete={handleDeleteScript}
                onRegenerate={handleRegenerateHistory}
              />
              <AdBanner adSlot="9266679211" className="mt-12" />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            >
              <SettingsSection 
                user={user} 
                onUpdate={(updated) => setUser(updated)} 
                onLogout={() => {}} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmationModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Delete Script?"
          message="This action cannot be undone. This script will be permanently removed from your history."
        />

        <ConfirmationModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={clearAllHistory}
          title="Clear All History?"
          message="Are you sure you want to delete all your saved scripts? This action is permanent."
        />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label, badge }: { active: boolean, onClick: () => void, icon: any, label: string, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-black text-sm transition-all group overflow-hidden"
    >
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 bg-indigo-600 shadow-lg shadow-indigo-500/30"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </AnimatePresence>
      
      <div className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${
        active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'
      }`}>
        <Icon className="w-4 h-4" />
        {label}
        {badge !== undefined && badge > 0 && (
          <span className={`ml-1 px-1.5 py-0.5 rounded-lg text-[10px] font-black transition-colors ${
            active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}
