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
  Download,
  Share2,
  CheckCircle2,
  MessageCircle,
  Send,
  Globe,
  Copy,
  ExternalLink
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const speedOptions = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
  const prevAudioUrlRef = useRef<string | null>(null);
  const lastSecondRef = useRef<number>(-1);
  const lastDurationRef = useRef<number>(-1);

  useEffect(() => {
    if (audioRef.current && currentAudio) {
      if (prevAudioUrlRef.current !== currentAudio.audio_url) {
        prevAudioUrlRef.current = currentAudio.audio_url;
        lastSecondRef.current = -1;
        lastDurationRef.current = -1;
        audioRef.current.load();
      }
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = muted ? 0 : volume;
      if (isPlayingAudio) {
        const p = audioRef.current.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingAudio, currentAudio?.id, currentAudio?.audio_url, playbackRate, volume, muted]);

  if (!currentAudio) return null;

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (!isNaN(duration) && isFinite(duration) && duration > 0) {
        setDurationFormatted(formatSeconds(duration));
        lastDurationRef.current = duration;
        useStore.getState().setAudioTime(current, duration);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
      setCurrentTimeFormatted(formatSeconds(current));
      setDurationFormatted(formatSeconds(duration));

      const sec = Math.floor(current);
      if (sec !== lastSecondRef.current || Math.abs(duration - lastDurationRef.current) > 0.5) {
        lastSecondRef.current = sec;
        lastDurationRef.current = duration;
        useStore.getState().setAudioTime(current, duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekPercent = Number(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (seekPercent / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(seekPercent);
      setCurrentTimeFormatted(formatSeconds(newTime));
      lastSecondRef.current = Math.floor(newTime);
      useStore.getState().setAudioTime(newTime, audioRef.current.duration);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTimeFormatted(formatSeconds(newTime));
      lastSecondRef.current = Math.floor(newTime);
      useStore.getState().setAudioTime(newTime, audioRef.current.duration || 0);
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
    <aside aria-label="پخش‌کننده صوتی" className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-bg)]/95 backdrop-blur-xl border-t-2 border-[#1B889A]/50 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] py-1.5 sm:py-2 transition-all pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <audio
        ref={audioRef}
        src={currentAudio.audio_url}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleLoadedMetadata}
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
          aria-label="زمان‌پیمای پادکست"
          className="w-full h-1.5 bg-stone-300 dark:bg-neutral-800 accent-[#1B889A] cursor-pointer block"
        />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1 flex items-center justify-between gap-1.5 sm:gap-6 min-w-0">
        
        {/* Track Details */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[100px] xs:max-w-[130px] sm:max-w-xs md:max-w-md shrink">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl border border-[#1B889A]/40 overflow-hidden shrink-0 bg-[var(--bg-color)] shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentAudio.cover_image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80'} 
              alt={currentAudio.title_fa}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] sm:text-sm font-extrabold text-[var(--text-primary)] truncate font-serif-persian" title={currentAudio.title_fa}>
              {currentAudio.title_fa}
            </h5>
            <p className="text-[9px] sm:text-xs text-[var(--text-secondary)] truncate">
              {currentAudio.speaker_fa}
            </p>
          </div>
        </div>

        {/* Playback Controls (10s Backward, Play/Pause, 10s Forward, Live Time Counter) */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          
          {/* Rewind 10s (-10s) */}
          <button
            onClick={() => skipTime(-10)}
            className="p-1 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 transition-all active:scale-90 flex items-center gap-0.5"
            title="۱۰ ثانیه عقب زدن"
            aria-label="۱۰ ثانیه عقب زدن"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="text-[9px] font-bold font-mono hidden sm:inline">-10s</span>
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={toggleAudioPlay}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white flex items-center justify-center shadow-lg shadow-[#1B889A]/30 transition-all active:scale-95 shrink-0"
            aria-label={isPlayingAudio ? "توقف پخش محتوای صوتی" : "پخش محتوای صوتی"}
          >
            {isPlayingAudio ? (
              <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current translate-x-[0.5px]" />
            )}
          </button>

          {/* Forward 10s (+10s) */}
          <button
            onClick={() => skipTime(10)}
            className="p-1 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 transition-all active:scale-90 flex items-center gap-0.5"
            title="۱۰ ثانیه جلو زدن"
            aria-label="۱۰ ثانیه جلو زدن"
          >
            <RotateCw className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="text-[9px] font-bold font-mono hidden sm:inline">+10s</span>
          </button>

          {/* LIVE TIME COUNTER */}
          <div className="px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-[#1B889A] font-mono font-bold text-[10px] sm:text-sm shadow-inner shrink-0 dir-ltr">
            {currentTimeFormatted} / {durationFormatted}
          </div>

        </div>

        {/* Share Button, Speed Selector, Download Button, Interactive Volume Slider & Close */}
        <div className="flex items-center gap-1 sm:gap-2 relative shrink-0">
          
          {/* Audio Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-secondary)] hover:text-[#1B889A] transition-all shadow-sm flex items-center justify-center shrink-0"
            title="اشتراک‌گذاری فایل صوتی"
            aria-label="اشتراک‌گذاری فایل صوتی"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B889A]" />
          </button>

          {/* Audio Download Button */}
          <a
            href={currentAudio.audio_url}
            download={`${currentAudio.title_fa}.mp3`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 sm:p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-secondary)] hover:text-[#1B889A] transition-all shadow-sm flex items-center justify-center shrink-0"
            title="دانلود فایل صوتی"
            aria-label="دانلود فایل صوتی"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B889A]" />
          </a>

          {/* Speed Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-[10px] sm:text-xs font-bold font-mono flex items-center gap-0.5 transition-all shadow-sm"
              title="سرعت پخش"
              aria-label="تنظیم سرعت پخش"
            >
              <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1B889A]" />
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

          {/* VOLUME SLIDER (DESKTOP / TABLET) */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--bg-color)] border border-[var(--card-border)] px-2 py-1 rounded-xl">
            <button
              onClick={toggleMute}
              className="text-[var(--text-secondary)] hover:text-[#1B889A] transition-colors"
              title={muted ? 'وصل صدا' : 'قطع صدا'}
              aria-label="قطع/وصل صدا"
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
              aria-label="تنظیم میزان صدا"
              className="w-16 h-1.5 bg-stone-300 dark:bg-neutral-800 accent-[#1B889A] cursor-pointer rounded-full"
              title={`ولوم صدا: ${Math.round((muted ? 0 : volume) * 100)}%`}
            />
          </div>

          {/* Close Player Button */}
          <button
            onClick={closeAudioPlayer}
            className="p-1.5 sm:p-2 rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="بستن پلیر"
            aria-label="بستن پخش‌کننده صوتی"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999999] px-6 py-3 rounded-2xl bg-emerald-700/95 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Audio Share Lightbox Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200 animate-in fade-in no-print"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl modern-card relative animate-in zoom-in-95 fade-in slide-in-from-bottom-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 left-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-sm active:scale-95"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A] shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian">
                  اشتراک‌گذاری این فایل صوتی
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  ارسال لینک آنلاین همراه با تصویر کاور در شبکه‌های اجتماعی
                </p>
              </div>
            </div>

            {/* Audio Preview Card */}
            <div className="bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
              {currentAudio.cover_image && (
                <div className="w-full aspect-[16/9] relative bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentAudio.cover_image}
                    alt={currentAudio.title_fa}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-bold">
                    پیش‌نمایش کاور صوتی در شبکه‌های اجتماعی
                  </div>
                </div>
              )}
              <div className="p-3.5 space-y-1.5 text-right">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#1B889A] font-bold">
                    مجله ایدئولوژی مهدویت • {currentAudio.category_fa || 'محتوای صوتی'}
                  </span>
                  <span className="text-[var(--text-secondary)] font-bold">
                    مدت: {currentAudio.duration_fa}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                  {currentAudio.title_fa}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                  گوینده / سخنران: {currentAudio.speaker_fa}
                </p>
              </div>
            </div>

            {/* Social Share Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🎧 فایل صوتی: ${currentAudio.title_fa}\nگوینده: ${currentAudio.speaker_fa}\nمدت: ${currentAudio.duration_fa}\n\nشنیدن آنلاین در مجله ایدئولوژی مهدویت:\n${
                    typeof window !== 'undefined' 
                      ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                      : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`
                  }`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ارسال در واتساپ</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  typeof window !== 'undefined' 
                    ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                    : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`
                )}&text=${encodeURIComponent(`🎧 ${currentAudio.title_fa} - گوینده: ${currentAudio.speaker_fa}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>ارسال در تلگرام</span>
              </a>

              {/* Eitaa */}
              <a
                href={`https://eitaa.com/share/url?url=${encodeURIComponent(
                  typeof window !== 'undefined' 
                    ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                    : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`
                )}&text=${encodeURIComponent(`🎧 ${currentAudio.title_fa} - گوینده: ${currentAudio.speaker_fa}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#E85E26]/15 hover:bg-[#E85E26] text-[#E85E26] hover:text-white border border-[#E85E26]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Globe className="w-4 h-4" />
                <span>ارسال در ایتا</span>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' 
                    ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                    : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`;
                  navigator.clipboard?.writeText(url);
                  showToast('لینک فایل صوتی کپی شد');
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1B889A]/15 hover:bg-[#1B889A] text-[#1B889A] hover:text-white border border-[#1B889A]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>کپی لینک مستقیم</span>
              </button>
            </div>

            {/* Native Mobile Share */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={async () => {
                  const url = typeof window !== 'undefined' 
                    ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                    : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`;
                  try {
                    await navigator.share({
                      title: currentAudio.title_fa,
                      text: `شنیدن فایل صوتی «${currentAudio.title_fa}» با صدای ${currentAudio.speaker_fa} در مجله ایدئولوژی مهدویت`,
                      url,
                    });
                  } catch (e) {
                    // dismissed
                  }
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--bg-color)] hover:bg-[#1B889A] text-[var(--text-primary)] hover:text-white border border-[var(--card-border)] hover:border-[#1B889A] font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>اشتراک‌گذاری با سایر برنامه‌های گوشی</span>
              </button>
            )}

            {/* Direct Link Input */}
            <div className="pt-2 border-t border-[var(--card-border)] flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={
                  typeof window !== 'undefined' 
                    ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                    : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`
                }
                className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono text-[var(--text-secondary)] dir-ltr truncate"
              />
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' 
                    ? `${window.location.origin}/audio?id=${encodeURIComponent(currentAudio.id)}` 
                    : `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(currentAudio.id)}`;
                  navigator.clipboard?.writeText(url);
                  showToast('لینک فایل صوتی کپی شد');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>کپی</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
};
