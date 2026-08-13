'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CalligraphyPenTitleProps {
  title: string;
}

export const CalligraphyPenTitle: React.FC<CalligraphyPenTitleProps> = ({ title }) => {
  return (
    <div className="relative inline-block py-2 px-1 text-center dir-rtl w-full">
      
      {/* 1. Main Title Text - Displayed Directly Without Text Writing Animation */}
      <div className="relative z-10">
        <h1 className="text-xl sm:text-4xl md:text-6xl font-black text-[var(--text-primary)] font-serif-persian tracking-tight leading-tight select-none max-w-full min-w-0">
          {title}
        </h1>
      </div>

      {/* 2. ELEGANT UNDERLINE CALLIGRAPHY STROKE REVEAL - ANIMATES SMOOTHLY UNDER TITLE */}
      <motion.svg
        viewBox="0 0 300 12"
        className="w-full h-3 sm:h-3.5 mt-1 text-[#1B889A] overflow-visible"
        initial={{ strokeDashoffset: 300 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.2 }}
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
