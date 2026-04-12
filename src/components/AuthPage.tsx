import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Key, ArrowRight, Sparkles, ShieldCheck, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User, AuthResponse } from '../types';
import { storage } from '../lib/storage';

interface AuthPageProps {
  onAuthSuccess: (auth: AuthResponse) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const passwordRequirements = [
    { label: '8+ Characters', test: (p: string) => p.length >= 8 },
    { label: 'One Uppercase', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One Number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One Symbol', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    { label: 'No Hindi Chars', test: (p: string) => p.length > 0 && !/[\u0900-\u097F]/.test(p) },
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('Password reset email sent! Please check your inbox.');
        setIsForgotPassword(false);
        return;
      }

      if (isLogin) {
        if (authMode === 'password') {
          // Firebase Login
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Get token and sync with backend
          const idToken = await firebaseUser.getIdToken();
          const res = await fetch('/api/auth/firebase-sync', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Sync failed');
          onAuthSuccess(data);
        } else {
          // OTP logic remains simulated or can be extended to Firebase Phone Auth
          if (!isOtpSent) {
            const res = await fetch('/api/auth/otp/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
            setIsOtpSent(true);
          } else {
            const res = await fetch('/api/auth/otp/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, code: otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid OTP');
            onAuthSuccess(data);
          }
        }
      } else {
        // Firebase Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Update profile name
        await updateProfile(firebaseUser, { displayName: name });
        
        // Sync with backend
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch('/api/auth/firebase-sync', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration sync failed');
        
        // Sign out after registration so they have to log in
        await auth.signOut();
        
        setSuccessMessage('Account created successfully! Please login with your credentials.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      let message = err.message;
      
      // Handle Firebase specific error codes
      if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password. Please try again.';
      if (err.code === 'auth/invalid-credential') message = 'Invalid email or password. Please check your credentials.';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered. Please login instead.';
      if (err.code === 'auth/weak-password') message = 'Password is too weak. Please use a stronger password.';
      if (err.code === 'auth/too-many-requests') message = 'Too many failed attempts. Please try again later.';
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p className="text-slate-500 font-medium">
            {isForgotPassword ? 'Enter your email to receive a reset link' : (isLogin ? 'Dominate social media with AI' : 'Start your viral journey today')}
          </p>
        </div>

        {/* Auth Mode Toggle (Login Only) */}
        {isLogin && !isForgotPassword && (
          <div className="flex p-1 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
            <button
              onClick={() => { setAuthMode('password'); setIsOtpSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                authMode === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Lock className="w-4 h-4" />
              Password
            </button>
            <button
              onClick={() => { setAuthMode('otp'); setIsOtpSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                authMode === 'otp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              Email OTP
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium outline-none"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isOtpSent}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium outline-none"
              />
            </div>


            {(authMode === 'password' || !isLogin) && !isForgotPassword && (
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required={authMode === 'password' || !isLogin}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isLogin && authMode === 'password' && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors py-1 px-3 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      Forgot Password?
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {passwordRequirements.map((req, i) => {
                      const isMet = req.test(password);
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isMet ? 'bg-green-500' : 'bg-slate-300'}`} />
                          <span className={`text-[10px] font-bold ${isMet ? 'text-green-600' : 'text-slate-400'}`}>
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {authMode === 'otp' && isLogin && isOtpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative"
              >
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="6-Digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium outline-none"
                />
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-sm font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isForgotPassword ? 'Send Reset Link' : (isLogin ? (isOtpSent ? 'Verify & Login' : (authMode === 'otp' ? 'Send OTP' : 'Login Now')) : 'Create Account')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <LogIn className="w-4 h-4" />
              Back to <span className="text-indigo-600">Login</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMessage(null);
                setIsOtpSent(false);
                setAuthMode('password');
              }}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Don't have an account? <span className="text-indigo-600">Sign Up</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Already have an account? <span className="text-indigo-600">Login</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Secure Authentication</span>
        </div>
      </motion.div>
    </div>
  );
}
