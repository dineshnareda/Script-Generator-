import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import ScriptForm from './components/ScriptForm';
import ScriptOutput from './components/ScriptOutput';
import { ScriptInput, ScriptOutput as ScriptOutputType } from './types';
import { generateViralScript } from './services/gemini';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ScriptOutputType | null>(null);

  const handleGenerate = async (input: ScriptInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateViralScript(input);
      setOutput(result);
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
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
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
                <ScriptOutput output={output} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}

