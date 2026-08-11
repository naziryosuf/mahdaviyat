'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Play, 
  Pause, 
  X, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Gauge, 
  Volume1,
  Download
} from 'lucide-react';

export const PersistentAudioBar: React.FC = () => {
  const { currentAudio, isPlayingAudio, toggleAudioPlay, closeAudioPlayer } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('00:00');
  const [durationFormatted, setDurationFormatted] = useState('00:00');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const speedOptions = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = muted ? 0 : volume;
      if (isPlayingAudio) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingAudio, currentAudio, playbackRate, volume, muted]);

  if (!currentAudio) return null;

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
      setCurrentTimeFormatted(formatSeconds(current));
      setDurationFormatted(formatSeconds(duration));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekPercent = Number(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (seekPercent / 100) * audioRef.current.duration;
      setProgress(seekPercent);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + seconds;
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, newTime));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !muted;
      audioRef.current.muted = newMuteState;
      setMuted(newMuteState);
    }
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        audioRef.current.muted = true;
        setMuted(true);
      } else {
        audioRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-bg)]/95 backdrop-blur-xl border-t-2 border-[#1B889A]/50 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] py-2 transition-all">
      <audio
        ref={audioRef}
        src={currentAudio.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => toggleAudioPlay()}
      />
      
      {/* Interactive Seek Bar */}
      <div className="absolute -top-1.5 left-0 right-0 w-full group cursor-pointer">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1.5 bg-stone-300 dark:bg-neutral-800 accent-[#1B889A] cursor-pointer block"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Track Details */}
        <div className="flex items-center gap-3 min-w-0 max-w-[130px] sm:max-w-xs md:max-w-md">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#1B889A]/40 overflow-hidden shrink-0 bg-[var(--bg-color)] shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentAudio.cover_image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80'} 
              alt={currentAudio.title_fa}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] truncate font-serif-persian">
              {currentAudio.title_fa}
            </h5>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">
              {currentAudio.speaker_fa}
            </p>
          </div>
        </div>

        {/* Playback Controls (10s Backward, Play/Pause, 10s Forward, Live Time Counter) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Rewind 10s (-10s) */}
          <button
            onClick={() => skipTime(-10)}
            className="p-1.5 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 transition-all active:scale-90 flex items-center gap-1"
            title="۱۰ ثانیه عقب زدن"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold font-mono hidden sm:inline">-10s</span>
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={toggleAudioPlay}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white flex items-center justify-center shadow-lg shadow-[#1B889A]/30 transition-all active:scale-95 shrink-0"
            aria-label="پخش/توقف"
          >
            {isPlayingAudio ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 mr-0.5 fill-current" />
            )}
          </button>

          {/* Forward 10s (+10s) */}
          <button
            onClick={() => skipTime(10)}
            className="p-1.5 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 transition-all active:scale-90 flex items-center gap-1"
            title="۱۰ ثانیه جلو زدن"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold font-mono hidden sm:inline">+10s</span>
          </button>

          {/* LIVE TIME COUNTER PLACED RIGHT NEXT TO PLAY BUTTON WITH FULL VISIBILITY */}
          <div className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-[#1B889A] font-mono font-bold text-xs sm:text-sm shadow-inner shrink-0 dir-ltr">
            {currentTimeFormatted} / {durationFormatted}
          </div>

        </div>

        {/* Speed Selector, Download Button, Interactive Volume Slider & Close */}
        <div className="flex items-center gap-2 relative">
          
          {/* Audio Download Button */}
          <a
            href={currentAudio.audio_url}
            download={`${currentAudio.title_fa}.mp3`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-secondary)] hover:text-[#1B889A] transition-all shadow-sm flex items-center justify-center shrink-0"
            title="دانلود فایل صوتی پادکست"
          >
            <Download className="w-4 h-4 text-[#1B889A]" />
          </a>

          {/* Speed Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold font-mono flex items-center gap-1 transition-all shadow-sm"
              title="سرعت پخش پادکست"
            >
              <Gauge className="w-3.5 h-3.5 text-[#1B889A]" />
              <span>{playbackRate}x</span>
            </button>

            {/* Speed Options Dropdown */}
            {showSpeedMenu && (
              <div className="absolute bottom-11 left-0 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-1.5 shadow-2xl space-y-1 min-w-[90px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`w-full text-center px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      playbackRate === rate
                        ? 'bg-[#1B889A] text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-color)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INTERACTIVE VOLUME SLIDER (کم و زیاد کردن ولوم صدا) */}
          <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-color)] border border-[var(--card-border)] px-2.5 py-1 rounded-xl">
            <button
              onClick={toggleMute}
              className="text-[var(--text-secondary)] hover:text-[#1B889A] transition-colors"
              title={muted ? 'وصل صدا' : 'قطع صدا'}
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-[#1B889A]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#1B889A]" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeSliderChange}
              className="w-16 sm:w-20 h-1.5 bg-stone-300 dark:bg-neutral-800 accent-[#1B889A] cursor-pointer rounded-full"
              title={`ولوم صدا: ${Math.round((muted ? 0 : volume) * 100)}%`}
            />
            
            <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] min-w-[26px]">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Close Player Button */}
          <button
            onClick={closeAudioPlayer}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="بستن پلیر"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
