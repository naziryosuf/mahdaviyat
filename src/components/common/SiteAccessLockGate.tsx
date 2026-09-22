'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Eye, EyeOff, Wrench, ArrowLeft } from 'lucide-react';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';

interface SiteAccessLockGateProps {
  onUnlock: () => void;
}

export const SiteAccessLockGate: React.FC<SiteAccessLockGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showText, setShowText] = useState(false);

  // Allowed Passcodes: 2026, 1234, 112233, or custom code
  const VALID_CODES = ['2026', '1234', '112233', '998877'];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passcode.trim();
    if (!clean) return;

    if (VALID_CODES.includes(clean)) {
      setIsSuccess(true);
      setError(false);
      setTimeout(() => {
        onUnlock();
      }, 350);
    } else {
      setError(true);
      setIsSuccess(false);
    }
  };

  const handleKeyClick = (num: string) => {
    setError(false);
    if (passcode.length < 8) {
      setPasscode(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(false);
    setPasscode('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--bg-color)] relative overflow-hidden select-none">
      
      {/* Background Animated Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 bg-[#1B889A]/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 bg-[#1B889A]/15 rounded-full blur-[90px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm bg-[var(--card-bg)] border-2 border-[#1B889A]/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl modern-card relative z-10"
      >
        
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="flex justify-center">
            <KaabaUnityLogo size="md" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-serif-persian tracking-tight">
            ایدئولوژی مهدویت
          </h1>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>وب‌سایت در دست آماده‌سازی است</span>
          </div>

          <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-serif-persian pt-0.5">
            دسترسی به سامانه صرفاً برای توسعه‌دهندگان و طراحان مجاز می‌باشد.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div className="relative flex items-center">
            <input
              type={showText ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              autoFocus
              placeholder="رمز عبور..."
              className="w-full py-3 pl-10 pr-4 text-center text-base sm:text-lg font-mono font-bold bg-[var(--bg-color)] border border-[var(--card-border)] focus:border-[#1B889A] rounded-2xl text-[var(--text-primary)] tracking-widest focus:outline-none transition-all shadow-inner"
            />
            
            <button
              type="button"
              onClick={() => setShowText(!showText)}
              className="absolute left-3 p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[#1B889A] transition-colors"
              title={showText ? 'مخفی کردن' : 'نمایش'}
            >
              {showText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تأیید شد. در حال ورود...</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>رمز عبور اشتباه است</span>
            </motion.div>
          )}

          {/* Numeric Touch Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto dir-ltr pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="py-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-base font-bold text-[var(--text-primary)] hover:border-[#1B889A] hover:bg-[#1B889A]/10 active:scale-95 transition-all shadow-2xs"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
            >
              پاک کردن
            </button>

            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="py-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-base font-bold text-[var(--text-primary)] hover:border-[#1B889A] hover:bg-[#1B889A]/10 active:scale-95 transition-all shadow-2xs"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-800/60 active:scale-95 transition-all"
            >
              ⌫
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!passcode.trim()}
            className="w-full py-3 px-4 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#1B889A]/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mt-1"
          >
            <span>ورود</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

        </form>

        <div className="pt-1 text-center text-[10px] text-[var(--text-secondary)] font-mono">
          © ۲۰۲۶ ایدئولوژی مهدویت
        </div>

      </motion.div>
    </div>
  );
};
