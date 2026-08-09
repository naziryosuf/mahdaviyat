'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Play, Pause, X, Volume2, VolumeX, Music } from 'lucide-react';

export const PersistentAudioBar: React.FC = () => {
  const { currentAudio, isPlayingAudio, toggleAudioPlay, closeAudioPlayer } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingAudio, currentAudio]);

  if (!currentAudio) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekPercent = Number(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (seekPercent / 100) * audioRef.current.duration;
      setProgress(seekPercent);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-bg)] backdrop-blur-md border-t border-[#65abcb]/40 shadow-lg py-2 transition-all">
      <audio
        ref={audioRef}
        src={currentAudio.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => toggleAudioPlay()}
      />
      
      {/* Top progress line */}
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="absolute -top-1 left-0 right-0 w-full h-1 bg-stone-300 dark:bg-neutral-800 accent-[#65abcb] cursor-pointer"
      />

      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        
        {/* Track Metadata */}
        <div className="flex items-center gap-3 min-w-0 max-w-xs md:max-w-md">
          <div className="w-10 h-10 rounded border border-[var(--card-border)] overflow-hidden shrink-0 bg-[var(--bg-color)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentAudio.cover_image} 
              alt={currentAudio.title_fa}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">
              {currentAudio.title_fa}
            </h5>
            <p className="text-[11px] text-[var(--text-secondary)] truncate">
              {currentAudio.speaker_fa} • {currentAudio.duration_fa}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudioPlay}
            className="w-9 h-9 rounded-full bg-[#65abcb] hover:bg-[#5097b6] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
            aria-label="پخش/توقف"
          >
            {isPlayingAudio ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 mr-0.5 fill-current" />
            )}
          </button>
        </div>

        {/* Volume & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[#65abcb] transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#65abcb]" />}
          </button>
          <button
            onClick={closeAudioPlayer}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
