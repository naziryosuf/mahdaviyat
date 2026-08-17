'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PersistentAudioBar } from "@/components/audio/PersistentAudioBar";
import { InitialSitePreloader } from "@/components/common/InitialSitePreloader";
import { ThemeTransitionWave } from "@/components/common/ThemeTransitionWave";
import { useStore } from "@/store/useStore";

export const AppClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial Storage & Supabase Backend Sync
    const store = useStore.getState();
    store.initFromStorage();
    store.fetchFromBackend();

    // Auto-Sync Polling every 10 seconds & Window Focus for instant Mobile Sync
    const interval = setInterval(() => {
      useStore.getState().fetchFromBackend();
    }, 10000);

    const handleSyncOnFocus = () => {
      useStore.getState().fetchFromBackend();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleSyncOnFocus);
      window.addEventListener('visibilitychange', handleSyncOnFocus);
      window.addEventListener('online', handleSyncOnFocus);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleSyncOnFocus);
        window.removeEventListener('visibilitychange', handleSyncOnFocus);
        window.removeEventListener('online', handleSyncOnFocus);
      }
    };
  }, []);

  return (
    <>
      <ThemeTransitionWave />

      {/* 1. ROOT LEVEL ULTRA-FAST 1.0 SECOND CLEAN PRELOADER */}
      <AnimatePresence>
        {!isLoaded && (
          <InitialSitePreloader onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* 2. ENTIRE WEBSITE CONTENT COMPLETELY HIDDEN (NO BLUR, NO PEEKING) UNTIL PRELOADER FINISHES */}
      <div className={`min-h-screen flex flex-col justify-between transition-opacity duration-300 ${
        isLoaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex-1">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Footer />
        <PersistentAudioBar />
      </div>
    </>
  );
};
