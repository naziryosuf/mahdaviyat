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

const AUDIO_WAVE_HEIGHTS = [32, 60, 42, 85, 100, 68, 92, 48, 72, 95, 58, 42, 88, 94, 52, 78, 100, 72, 44, 86, 62, 38, 76, 54, 32];

function AudioContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');
  const { audios, playAudio, pauseAudio, currentAudio, isPlayingAudio } = useStore();
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

  const dynamicCategories = ['همه', ...Array.from(new Set(audios.map(a => a.category_fa || 'محتوای صوتی')))];

  const filteredAudios = audios.filter((aud) => {
    const matchesCategory = filterCategory === 'همه' || aud.category_fa === filterCategory;
    const matchesQuery = 
      aud.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.speaker_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aud.description_fa.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeAudio = currentAudio || audios[0];

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

                <span className="text-xs text-stone-300 font-bold flex items-center gap-1 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-2xl">
                  <Clock className="w-4 h-4 text-[#1B889A]" />
                  مدت زمان: {activeAudio.duration_fa}
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
                {/* 1. COVER IMAGE (RED ZONE) */}
                <div
                  onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                  className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverSrc}
                    alt={aud.title_fa}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Center Interactive Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isPlayingThis 
                        ? 'bg-[#1B889A] text-white scale-100 ring-4 ring-white/30' 
                        : 'bg-black/50 text-white group-hover/img:scale-110 group-hover/img:bg-[#1B889A]'
                    }`}>
                      {isPlayingThis ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Category Badge & Duration */}
                  <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-white pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-bold">
                      {aud.category_fa || 'محتوای صوتی'}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-bold">
                      <Clock className="w-3 h-3 text-[#1B889A]" />
                      <span>{aud.duration_fa}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5">
                    {/* 2. WHATSAPP VOICE NOTE WAVEFORM (YELLOW ZONE) */}
                    <div
                      onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                      className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                        isPlayingThis 
                          ? 'bg-[#1B889A]/10 border-[#1B889A]/50 shadow-xs ring-1 ring-[#1B889A]/20' 
                          : 'bg-[var(--bg-color)] border-[var(--card-border)] hover:border-[#1B889A]/40'
                      }`}
                      title={isPlayingThis ? 'توقف پخش' : 'پخش ویس صوتی'}
                    >
                      {/* Round WhatsApp Play/Pause Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          isPlayingThis ? pauseAudio() : playAudio(aud);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm active:scale-95 ${
                          isPlayingThis 
                            ? 'bg-[#1B889A] text-white ring-4 ring-[#1B889A]/20 shadow-md' 
                            : 'bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white'
                        }`}
                        aria-label={isPlayingThis ? 'توقف پخش' : 'پخش ویس'}
                      >
                        {isPlayingThis ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        )}
                      </button>

                      {/* Zigzag Sound Waveform Bars (Equalizer) */}
                      <div className="flex-1 flex items-center justify-between gap-[2px] sm:gap-[3px] h-7 px-1">
                        {AUDIO_WAVE_HEIGHTS.map((heightPercent, bIdx) => {
                          const animDuration = 0.45 + ((bIdx % 5) * 0.1);
                          const animDelay = (bIdx % 7) * 0.08;

                          return (
                            <span
                              key={bIdx}
                              className={`w-[2.5px] sm:w-[3px] rounded-full transition-all duration-150 ${
                                isPlayingThis
                                  ? 'bg-[#1B889A]'
                                  : 'bg-stone-300 dark:bg-stone-600'
                              }`}
                              style={{
                                height: `${heightPercent}%`,
                                transformOrigin: 'center',
                                animation: isPlayingThis 
                                  ? `whatsappWave ${animDuration}s ease-in-out infinite alternate ${animDelay}s` 
                                  : 'none',
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Playback indicator / Duration */}
                      <div className="shrink-0 text-left">
                        {isPlayingThis ? (
                          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#1B889A] animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-[#1B889A]" />
                            <span>در حال پخش</span>
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[var(--text-secondary)]">
                            {aud.duration_fa?.split(' ')[0] || 'ویس'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. AUDIO TITLE & SPEAKER (GREEN ZONE) */}
                    <div className="space-y-1.5">
                      <h3
                        onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                        className="text-base font-bold text-[var(--text-primary)] font-serif-persian leading-snug group-hover:text-[#1B889A] transition-colors cursor-pointer line-clamp-1"
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
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs font-serif-persian">
                    <span className="text-[var(--text-secondary)] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1B889A]" />
                      {aud.duration_fa}
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
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                          isPlayingThis
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-[#1B889A] hover:bg-[#156d7b] text-white'
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
