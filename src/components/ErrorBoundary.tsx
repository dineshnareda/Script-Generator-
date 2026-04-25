import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border border-slate-100"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 font-medium mb-8">
              An unexpected error occurred. Don't worry, your data is safe.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left overflow-hidden">
              <p className="text-xs font-mono text-slate-400 uppercase mb-2 tracking-wider">Error Details</p>
              <p className="text-sm font-bold text-slate-700 break-words leading-relaxed">
                {this.state.error?.message || 'Unknown runtime error'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                TRY REFRESHING
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
              >
                <Home className="w-4 h-4" />
                BACK TO HOME
              </motion.button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
