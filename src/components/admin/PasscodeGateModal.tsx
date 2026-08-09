'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Lock, ShieldAlert, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PasscodeGateModal: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const { loginAdmin } = useStore();

  const handleKeyClick = (num: string) => {
    if (passcode.length < 6) {
      setPasscode((prev) => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPasscode((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPasscode('');
    setError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(passcode);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--card-bg)] border-2 border-[#1B889A]/40 rounded-3xl p-8 space-y-6 shadow-2xl modern-card">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/30 text-[#1B889A] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] font-serif-persian">
            ورود به بخش مدیریت سامانه
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            جهت دسترسی به پنل مدیریت مجله ایدئولوژی مهدویت، کد عبور اختصاصی را وارد نمایید.
          </p>
        </div>

        {/* Passcode Display Dots */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center items-center gap-3 dir-ltr">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold font-mono transition-all ${
                  passcode[index]
                    ? 'border-[#1B889A] bg-[#1B889A]/10 text-[#1B889A] scale-105'
                    : 'border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--text-secondary)]'
                }`}
              >
                {passcode[index] ? '•' : ''}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold text-center flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>کد عبور واردشده اشتباه می‌باشد!</span>
            </div>
          )}

          {/* Numeric Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto dir-ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="py-3 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-lg font-bold text-[var(--text-primary)] hover:border-[#1B889A] hover:bg-[#1B889A]/10 active:scale-95 transition-all shadow-sm"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 hover:bg-red-500/20 active:scale-95 transition-all"
            >
              پاک کردن
            </button>

            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="py-3 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-lg font-bold text-[var(--text-primary)] hover:border-[#1B889A] hover:bg-[#1B889A]/10 active:scale-95 transition-all shadow-sm"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 rounded-xl bg-slate-800/20 border border-slate-700/30 text-xs font-bold text-[var(--text-secondary)] hover:bg-slate-800/40 active:scale-95 transition-all"
            >
              ⌫
            </button>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={passcode.length < 6}
            className="w-full py-3.5 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md shadow-[#1B889A]/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>تأیید و ورود به پنل مدیریت</span>
          </button>
        </form>

      </div>
    </div>
  );
};
