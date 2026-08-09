'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CalligraphyPenTitleProps {
  title: string;
}

export const CalligraphyPenTitle: React.FC<CalligraphyPenTitleProps> = ({ title }) => {
  return (
    <div className="relative inline-block py-2 px-1 text-center dir-rtl">
      
      {/* 1. Main Calligraphy Text with Ultra-Smooth Right-to-Left Pen Reveal */}
      <motion.div
        initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', opacity: 0.1, filter: 'blur(10px)' }}
        animate={{ clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <h1 className="text-4xl sm:text-6xl font-black text-[var(--text-primary)] font-serif-persian tracking-tight leading-tight select-none">
          {title}
        </h1>
      </motion.div>

      {/* 2. GLOWING CALLIGRAPHY PEN NIB CURSOR LEADING THE STROKE FROM RIGHT TO LEFT */}
      <motion.div
        initial={{ right: '0%', opacity: 1, scale: 1.4 }}
        animate={{ right: '100%', opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
      >
        {/* Calligraphy Pen Tip Glow & Shimmering Spark */}
        <div className="w-6 h-6 -mr-3 bg-[#1B889A] rounded-full blur-md animate-ping opacity-80" />
        <div className="w-3.5 h-3.5 -mr-1.5 bg-amber-300 rounded-full shadow-[0_0_16px_#D4AF37] border-2 border-white" />
      </motion.div>

      {/* 3. ELEGANT UNDERLINE CALLIGRAPHY STROKE REVEAL */}
      <motion.svg
        viewBox="0 0 300 12"
        className="w-full h-3.5 mt-1 text-[#1B889A] overflow-visible"
        initial={{ strokeDashoffset: 300 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.6 }}
      >
        <path
          d="M 300 6 C 200 12, 100 0, 0 6"
          fill="none"
          stroke="url(#strokeGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="300"
        />
        <defs>
          <linearGradient id="strokeGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#1B889A" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#A32838" />
          </linearGradient>
        </defs>
      </motion.svg>

    </div>
  );
};
