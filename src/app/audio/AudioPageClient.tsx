'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { 
  Volume2, 
  Play, 
  Pause, 
  Radio, 
  Clock, 
  Search, 
  Share2, 
  CheckCircle2, 
  MessageCircle, 
  Send, 
  Globe, 
  Copy, 
  ExternalLink, 
  X 
} from 'lucide-react';
import { AudioItem } from '@/types';
import { AudioShareModal } from '@/components/audio/AudioShareModal';
import { formatDurationNumeric, parseDurationToSeconds, formatRemainingCountdown } from '@/lib/audioUtils';

// Natural WhatsApp Voice Wave Heights (extracted directly from user reference waveform)
const AUDIO_WAVE_HEIGHTS = [28, 50, 20, 18, 57, 85, 20, 48, 100, 78, 12, 25, 88, 28, 28, 55, 72, 12, 22, 38, 95, 65, 18, 45, 22];

function AudioContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');
  const { audios, playAudio, pauseAudio, currentAudio, isPlayingAudio, audioCurrentTime, audioDuration } = useStore();
  const [filterCategory, setFilterCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');
  const [sharingAudio, setSharingAudio] = useState<AudioItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // If a specific audio ID was shared in query params, select and play it
  useEffect(() => {
    if (targetId && audios.length > 0) {
      const match = audios.find(a => a.id === targetId);
      if (match && currentAudio?.id !== targetId) {
        playAudio(match);
      }
    }
  }, [targetId, audios, currentAudio?.id, playAudio]);

  const sortedAudios = React.useMemo(() => {
    return [...audios].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [audios]);

  const dynamicCategories = ['همه', ...Array.from(new Set(sortedAudios.map(a => a.category_fa || 'محتوای صوتی')))];

  const filteredAudios = sortedAudios.filter((aud) => {
    const matchesCategory = filterCategory === 'همه' || aud.category_fa === filterCategory;
    const matchesQuery = 
      aud.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.speaker_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.description_fa.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeAudio = currentAudio || sortedAudios[0];

  return (
    <div className="space-y-10 py-6">
      
      {/* Audio Player Banner */}
      {activeAudio && (
        <div className="bg-gradient-to-r from-stone-950 via-slate-900 to-slate-900 border-2 border-[#1B889A]/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#1B889A]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            
            {/* Cover Image with Interactive Play/Pause Overlay */}
            <div 
              onClick={() => {
                if (currentAudio?.id === activeAudio.id && isPlayingAudio) {
                  pauseAudio();
                } else {
                  playAudio(activeAudio);
                }
              }}
              className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#1B889A]/40 shadow-2xl relative shrink-0 cursor-pointer group/hero"
              title={currentAudio?.id === activeAudio.id && isPlayingAudio ? "توقف پخش" : "پخش محتوای صوتی"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeAudio.cover_image} alt="" className="w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/30 group-hover/hero:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xl group-hover/hero:scale-110 transition-transform">
                  {currentAudio?.id === activeAudio.id && isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-[1px]" />
                  )}
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-center md:text-right flex-1">
              <span className="px-3.5 py-1.5 rounded-full teal-badge text-xs font-bold inline-block">
                {activeAudio.category_fa} • {activeAudio.speaker_fa?.includes('،') || activeAudio.speaker_fa?.includes(',') || (activeAudio.speaker_fa?.match(/@/g) || []).length > 1 ? 'گویندگان:' : 'گوینده:'} {activeAudio.speaker_fa}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-persian leading-snug">
                {activeAudio.title_fa}
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
                {activeAudio.description_fa}
              </p>

              {/* ENHANCED AUDIO CONTROLS */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                
                <button
                  onClick={() => {
                    if (currentAudio?.id === activeAudio.id && isPlayingAudio) {
                      pauseAudio();
                    } else {
                      playAudio(activeAudio);
                    }
                  }}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#1B889A]/30 transition-all active:scale-95"
                >
                  {currentAudio?.id === activeAudio.id && isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>توقف</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current translate-x-[0.5px]" />
                      <span>شنیدن</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-stone-300 font-bold flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-2xl">
                  <Clock className="w-4 h-4 text-[#1B889A]" />
                  <span>مدت زمان:</span>
                  <span className="dir-ltr font-mono text-[#1B889A]">{formatDurationNumeric(activeAudio.duration_fa)}</span>
                </span>

                {/* Share Button in Hero Banner */}
                <button
                  type="button"
                  onClick={() => setSharingAudio(activeAudio)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-[#1B889A] text-white border border-white/20 hover:border-[#1B889A] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  title="اشتراک‌گذاری فایل صوتی"
                >
                  <Share2 className="w-4 h-4" />
                  <span>اشتراک‌گذاری</span>
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--card-border)] pb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-[#1B889A] text-white shadow-md'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در آرشیف صوتی..."
            className="w-full pl-4 pr-10 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A]"
          />
          <Search className="w-4 h-4 text-[#1B889A] absolute right-3.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Audios Grid */}
      {filteredAudios.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center space-y-4 modern-card">
          <Radio className="w-12 h-12 text-[#1B889A] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">هنوز فایل صوتی ثبت نگردیده است</h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            می‌توانید با ورود به پنل مدیریت، محتوای صوتی جدید را ثبت نمایید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudios.map((aud) => {
            const isCurrent = currentAudio?.id === aud.id;
            const isPlayingThis = isCurrent && isPlayingAudio;
            const durationNumeric = formatDurationNumeric(aud.duration_fa);
            const effectiveTotalSec = (isCurrent && audioDuration > 0)
              ? audioDuration
              : parseDurationToSeconds(aud.duration_fa);
            const remainingSec = isCurrent
              ? Math.max(0, effectiveTotalSec - audioCurrentTime)
              : effectiveTotalSec;
            const countdownText = isCurrent
              ? formatRemainingCountdown(remainingSec, effectiveTotalSec)
              : durationNumeric;
            const coverSrc = aud.cover_image && aud.cover_image.trim() !== ''
              ? aud.cover_image
              : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

            return (
              <article
                key={aud.id}
                className={`bg-[var(--card-bg)] border rounded-2xl sm:rounded-3xl hover:border-[#1B889A] transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden group ${
                  isCurrent 
                    ? 'border-[#1B889A] ring-2 ring-[#1B889A]/30' 
                    : 'border-[var(--card-border)]'
                }`}
              >
                {/* 1. COVER IMAGE WITH INTERACTIVE PLAY BUTTON & CENTERED ON-COVER WAVE */}
                <div
                  onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                  className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0 select-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverSrc}
                    alt={aud.title_fa}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                    }}
                    className={`w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 ${
                      isPlayingThis ? 'scale-105' : 'group-hover/img:scale-105'
                    }`}
                  />
                  {/* Deeper / Darker backdrop on cover (خیره تر هنگام پخش) */}
                  <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
                    isPlayingThis 
                      ? 'bg-black/75 backdrop-blur-[1px]' 
                      : 'bg-gradient-to-t from-black/75 via-black/25 to-transparent'
                  }`} />

                  {/* Centered Audio Wave or Play Button (NO ENCLOSING BOX / قالب پاک شده) */}
                  {isPlayingThis ? (
                    /* WHEN PLAYING: Free-floating Natural Wave in Center of Cover without any box */
                    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10">
                      <div className="w-full max-w-[340px] flex items-center justify-between gap-3 sm:gap-4 select-none animate-fade-in">
                        {/* Round Glowing Pause Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            pauseAudio();
                          }}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1B889A] hover:bg-[#156d7b] text-white flex items-center justify-center shadow-[0_0_20px_rgba(27,136,154,0.7)] ring-4 ring-white/20 shrink-0 transition-transform active:scale-95 cursor-pointer"
                          title="توقف پخش"
                        >
                          <Pause className="w-5 h-5 fill-current" />
                        </button>

                        {/* Natural WhatsApp Style Animated Waveform (Larger, Taller, NO Container Box) */}
                        <div className="flex-1 flex items-center justify-center gap-[3px] sm:gap-[4px] h-12 sm:h-14 px-1 pointer-events-none">
                          {AUDIO_WAVE_HEIGHTS.map((heightPercent, bIdx) => {
                            const animDuration = 0.45 + ((bIdx % 5) * 0.1);
                            const animDelay = (bIdx % 7) * 0.08;
                            return (
                              <span
                                key={bIdx}
                                className="w-[3px] sm:w-[3.5px] rounded-full bg-[#1B889A] drop-shadow-[0_0_8px_rgba(27,136,154,0.6)]"
                                style={{
                                  height: `${heightPercent}%`,
                                  transformOrigin: 'center',
                                  animation: `whatsappWave ${animDuration}s ease-in-out infinite alternate ${animDelay}s`,
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Clean Numeric Countdown Time without box (e.g. 11.59, 11.58) */}
                        <span className="text-xs sm:text-sm font-mono font-bold text-white dir-ltr shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wider pointer-events-none">
                          {countdownText}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* WHEN IDLE: Center Circular Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(aud);
                          }}
                          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl bg-black/60 text-white group-hover/img:scale-110 group-hover/img:bg-[#1B889A] border border-white/20 cursor-pointer"
                          title="شنیدن محتوای صوتی"
                        >
                          <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-current translate-x-0.5" />
                        </button>
                      </div>

                      {/* Category Badge & Numeric Duration Over Cover */}
                      <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-white pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-bold">
                          {aud.category_fa || 'محتوای صوتی'}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-bold font-mono dir-ltr">
                          <Clock className="w-3 h-3 text-[#1B889A]" />
                          <span>{durationNumeric}</span>
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Card Content Body - Standard Height Matching Other Cards */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A]/10 text-[#1B889A] text-[10px] font-bold border border-[#1B889A]/30">
                        {aud.category_fa || 'محتوای صوتی'}
                      </span>
                      <span className="text-[var(--text-secondary)] font-mono text-[11px] font-bold flex items-center gap-1 dir-ltr">
                        <Clock className="w-3 h-3 text-[#1B889A]" />
                        <span>{durationNumeric}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                      className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-serif-persian leading-snug group-hover:text-[#1B889A] transition-colors cursor-pointer line-clamp-1"
                      title={aud.title_fa}
                    >
                      {aud.title_fa}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-serif-persian">
                      {aud.speaker_fa 
                        ? `${aud.speaker_fa?.includes('،') || aud.speaker_fa?.includes(',') || (aud.speaker_fa?.match(/@/g) || []).length > 1 ? 'ارائه‌دهندگان:' : 'گوینده:'} ${aud.speaker_fa}`
                        : aud.description_fa
                      }
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2.5 border-t border-[var(--card-border)] flex items-center justify-between text-xs font-serif-persian">
                    <span className="text-[var(--text-secondary)] text-[11px] font-bold line-clamp-1 max-w-[130px] sm:max-w-[150px]">
                      {aud.speaker_fa ? aud.speaker_fa.split('،')[0].split(',')[0] : 'سلسله مباحث مهدویت'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingAudio(aud);
                        }}
                        className="p-1.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-secondary)] hover:text-[#1B889A] transition-all shadow-xs active:scale-95"
                        title="اشتراک‌گذاری فایل صوتی"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (isPlayingThis) {
                            pauseAudio();
                          } else {
                            playAudio(aud);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                          isPlayingThis
                            ? 'bg-[#1B889A] text-white shadow-[#1B889A]/30'
                            : 'bg-[#1B889A]/10 text-[#1B889A] hover:bg-[#1B889A] hover:text-white border border-[#1B889A]/30'
                        }`}
                      >
                        {isPlayingThis ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>توقف</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                            <span>شنیدن</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999999] px-6 py-3 rounded-2xl bg-emerald-700/95 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AUDIO SHARE LIGHTBOX MODAL */}
      <AudioShareModal audio={sharingAudio} onClose={() => setSharingAudio(null)} />

    </div>
  );
}

export function AudioPageClient() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400 font-serif-persian">در حال بارگذاری آرشیو صوتی...</div>}>
      <AudioContent />
    </Suspense>
  );
}
