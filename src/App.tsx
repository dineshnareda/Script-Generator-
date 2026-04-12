import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  RefreshCw, 
  History as HistoryIcon, 
  PlusCircle, 
  Trash2, 
  LogOut, 
  User as UserIcon, 
  Zap, 
  Settings as SettingsIcon,
  LayoutDashboard
} from 'lucide-react';
import Header from './components/Header';
import ScriptForm from './components/ScriptForm';
import ScriptOutput from './components/ScriptOutput';
import HistoryList from './components/HistoryList';
import ConfirmationModal from './components/ConfirmationModal';
import AdBanner from './components/AdBanner';
import AuthPage from './components/AuthPage';
import SettingsSection from './components/SettingsSection';
import LogoutModal from './components/LogoutModal';
import { ScriptInput, ScriptOutput as ScriptOutputType, SavedScript, User, AuthResponse, AppView } from './types';
import { generateViralScript } from './services/gemini';
import { storage } from './lib/storage';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ScriptOutputType | null>(null);
  const [currentScriptId, setCurrentScriptId] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedScript[]>([]);
  const [view, setView] = useState<AppView>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setHistory(storage.getHistory(user.id));
    } else {
      setHistory([]);
    }
    checkAuth();
  }, [user?.id]);

  useEffect(() => {
    if (user?.theme) {
      document.documentElement.classList.remove('dark', 'emerald');
      if (user.theme !== 'light') {
        document.documentElement.classList.add(user.theme);
      }
    }
  }, [user?.theme]);

  const checkAuth = async () => {
    const token = storage.getToken();
    if (!token) {
      setView('auth');
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setView('generator');
      } else {
        storage.removeToken();
        setView('auth');
      }
    } catch (err) {
      console.error('Auth check failed', err);
      setView('auth');
    }
  };

  const handleAuthSuccess = (auth: AuthResponse) => {
    storage.setToken(auth.token);
    setUser(auth.user);
    setView('generator');
  };

  const handleLogout = () => {
    storage.removeToken();
    setUser(null);
    setView('auth');
    setIsLogoutModalOpen(false);
  };

  const handleGenerate = async (input: ScriptInput) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      // 1. Check/Use Credits on Server
      const creditRes = await fetch('/api/user/credits/use', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${storage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: input.topic })
      });

      if (!creditRes.ok) {
        const creditData = await creditRes.json();
        throw new Error(creditData.error || 'Failed to use credits');
      }

      const updatedUserData = await creditRes.json();
      setUser({ ...user, ...updatedUserData });

      // 2. Generate Script
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

      // Scroll to output on mobile
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
    if (!currentScriptId || !user) return;
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
    if (deleteId && user) {
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
    if (user) {
      storage.clearHistory(user.id);
      setHistory([]);
      setOutput(null);
      setCurrentScriptId(null);
      setIsClearModalOpen(false);
    }
  };

  const handleSelectHistory = (script: SavedScript) => {
    setOutput(script.output);
    setCurrentScriptId(script.id);
    setView('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegenerateHistory = async (script: SavedScript) => {
    if (!user) return;
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
      user?.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 
      user?.theme === 'emerald' ? 'bg-emerald-950 text-emerald-50' : 
      'bg-slate-50 text-slate-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <Header />

        <AdBanner adSlot="9266679211" className="max-w-4xl mx-auto" />

        {/* Navigation & User Info */}
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          {user && (
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
          )}

          {user && (
            <div className="flex items-center gap-4">
              {/* Credit Badge */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/10 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1.5">Credits Available</p>
                  <p className="text-lg font-black leading-none">
                    {user.credits} <span className="text-slate-400 text-xs font-bold">/ {Math.floor(user.credits / 20)} scripts</span>
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {view === 'auth' ? (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          ) : view === 'generator' ? (
            <motion.main
              key="generator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Form Section */}
              <div className={`lg:col-span-5 transition-all duration-500 ${output ? 'lg:col-span-4' : 'lg:col-span-8 lg:col-start-3'}`}>
                <div className="relative">
                  {user && user.credits < 20 && (
                    <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                        <Zap className="w-8 h-8 fill-current" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">Credits Exhausted</h3>
                      <p className="text-slate-500 font-medium mb-6">You need at least 20 credits to generate a script.</p>
                      <button
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                      >
                        Buy Credits (Coming Soon)
                      </button>
                    </div>
                  )}
                  <ScriptForm onSubmit={handleGenerate} isLoading={isLoading} />
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
                    />
                    <AdBanner adSlot="9266679211" className="mt-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          ) : view === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
            <SettingsSection 
              user={user!} 
              onUpdate={(updated) => setUser(updated)} 
              onLogout={() => setIsLogoutModalOpen(true)}
            />
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

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label, badge }: { active: boolean, onClick: () => void, icon: any, label: string, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-black text-sm transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-500 hover:bg-white/10 hover:text-indigo-600'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {badge !== undefined && badge > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 rounded-lg text-[10px] font-black ${
          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
