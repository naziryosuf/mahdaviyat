'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const InitialSitePreloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // 1. STRICT SCROLL LOCK DURING PRELOADER
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }

    // 2. PRELOADER DURATION (~1.1 SECONDS)
    const timer = setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.touchAction = '';
      }
      onComplete();
    }, 1100);

    return () => {
      clearTimeout(timer);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.touchAction = '';
      }
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen min-h-screen z-[999999] bg-[var(--bg-color)] text-[var(--text-primary)] flex items-center justify-center dir-rtl select-none transition-colors duration-200 overflow-hidden"
    >
      
      {/* ONLY "ایدئولوژی مهدویت" WITH EXACT SAME FONT SIZE & STYLING AS HOMEPAGE MAIN TITLE */}
      <div className="relative flex flex-col items-center justify-center my-auto text-center px-4 dir-rtl">
        
        {/* TITLE ANIMATING BRIGHTNESS 0% TO 100% MATCHING HOMEPAGE TITLE SIZE */}
        <motion.h1 
          initial={{ opacity: 0, filter: 'brightness(0) blur(8px)', scale: 0.94 }}
          animate={{ opacity: 1, filter: 'brightness(1.1) blur(0px)', scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-5xl md:text-6xl font-black text-[var(--text-primary)] font-serif-persian tracking-tight leading-tight select-none"
        >
          ایدئولوژی مهدویت
        </motion.h1>

      </div>

    </motion.div>
  );
};
