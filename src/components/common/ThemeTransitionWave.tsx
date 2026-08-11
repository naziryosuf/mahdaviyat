'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

export const ThemeTransitionWave: React.FC = () => {
  const { theme } = useStore();
  const [activeTransition, setActiveTransition] = useState<{
    id: number;
    targetTheme: 'dark' | 'light';
  } | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Trigger pure color curtain matching target theme with zero cross-flashing
    setActiveTransition({
      id: Date.now(),
      targetTheme: theme
    });

    const timer = setTimeout(() => {
      setActiveTransition(null);
    }, 600);

    return () => clearTimeout(timer);
  }, [theme, mounted]);

  if (!mounted) return null;

  const isDarkTarget = activeTransition?.targetTheme === 'dark';

  return (
    <AnimatePresence>
      {activeTransition && (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[999999] pointer-events-none overflow-hidden select-none">
          
          {/* PURE CURTAIN MATCHING TARGET THEME COLOR (ZERO WHITE FLASH ON DARK SWITCH) */}
          <motion.div
            key={`wave-${activeTransition.id}`}
            initial={{
              x: isDarkTarget ? '100%' : '-100%',
              opacity: 1
            }}
            animate={{
              x: '0%',
              opacity: 1
            }}
            exit={{
              x: isDarkTarget ? '-100%' : '100%',
              opacity: 0,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            className={`absolute inset-0 w-full h-full shadow-2xl gpu-accelerate ${
              isDarkTarget
                ? 'bg-[#0f172a]' // Pure Dark curtain (Zero white flash)
                : 'bg-[#fafafa]' // Pure Light curtain (Zero dark flash)
            }`}
            style={{
              willChange: 'transform'
            }}
          />

        </div>
      )}
    </AnimatePresence>
  );
};
