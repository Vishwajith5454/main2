
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight, Fingerprint } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

interface AccessDeniedProps {
  onAdminLogin: () => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ onAdminLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Artificial delay for "security check" feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === 'VISHWAJITH2010') {
      onAdminLogin();
    } else {
      setError('Invalid Authentication Token');
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden bg-[#0a0f1d] px-4">
      <AnimatedBackground />
      
      {/* Background Security Grid Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <div className="text-center p-8 bg-slate-950/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Scanner Line Animation */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-red-500/30 z-0 pointer-events-none"
          />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="p-5 bg-red-500/10 rounded-3xl border border-red-500/20">
                  <ShieldAlert className="w-12 h-12 text-red-500" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full -z-10"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Access Denied</h1>
            
            <AnimatePresence mode="wait">
              {!showLogin ? (
                <motion.div
                  key="message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-400 mb-10 text-sm leading-relaxed font-medium">
                    External navigation detected. Direct entry to the portal is restricted for security. Please initialize from the main application hub.
                  </p>

                  <div className="space-y-3">
                    <button 
                      onClick={() => window.history.back()}
                      className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all w-full"
                    >
                      Return to Hub
                    </button>
                    <button 
                      onClick={() => setShowLogin(true)}
                      className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all w-full border border-white/5"
                    >
                      <Lock className="w-4 h-4" />
                      Admin Login
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleLogin}
                  className="flex flex-col gap-5"
                >
                  <div className="text-left">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Identity Verification</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="••••••••••••"
                        className="w-full px-5 py-4 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-center tracking-[0.3em] font-black placeholder:text-gray-700"
                        autoFocus
                        disabled={isVerifying}
                      />
                    </div>
                  </div>

                  {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</motion.p>}

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setError('');
                        setPassword('');
                      }}
                      className="flex-1 py-4 bg-slate-900 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all border border-white/5"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isVerifying}
                      className="flex-[2] py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
                    >
                      {isVerifying ? 'Authenticating...' : <><Fingerprint className="w-4 h-4" /> Verify</>}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
