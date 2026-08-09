'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';

export const InitialSitePreloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 250);
          return 100;
        }
        return prev + 10;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen min-h-screen z-[9999] bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center justify-center space-y-6 dir-rtl select-none transition-colors duration-300 overflow-hidden"
    >
      {/* 1. OFFICIAL KAABA LOGO WITH PULSING TEAL-GOLD SPINNER RING */}
      <div className="relative flex items-center justify-center">
        
        {/* Outer Spinning Teal-Gold Arc */}
        <div className="w-24 h-24 rounded-full border-2 border-[#1B889A]/20 border-t-[#1B889A] border-r-[#D4AF37] animate-spin shadow-[0_0_30px_#1B889A40]" style={{ animationDuration: '1.2s' }} />

        {/* Center Logo Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <KaabaUnityLogo size="md" />
        </div>
      </div>

      {/* 2. ONLY PERCENTAGE NUMBER DISPLAY MATCHING SYSTEM THEME (%۰ تا %۱۰۰) */}
      <div className="text-center space-y-3 max-w-xs w-full px-4">
        
        {/* PERCENTAGE DISPLAY ONLY */}
        <p className="text-sm font-extrabold text-[#1B889A] font-mono tracking-widest">
          {progress}%
        </p>

        {/* Progress Bar Meter */}
        <div className="w-full h-1.5 bg-[var(--card-bg)] rounded-full overflow-hidden border border-[var(--card-border)] p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1B889A] via-[#06b6d4] to-[#A32838] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};
