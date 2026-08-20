'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Volume2, Play, Pause, Music, Radio, Clock, Search, RotateCcw, RotateCw, FastForward } from 'lucide-react';
import { AudioItem } from '@/types';

export default function AudioPage() {
  const { audios, playAudio, pauseAudio, currentAudio, isPlayingAudio, toggleAudioPlay } = useStore();
  const [filterCategory, setFilterCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');

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
            
            {/* Cover Image */}
            <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#1B889A]/40 shadow-2xl relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeAudio.cover_image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Music className="w-12 h-12 text-[#1B889A] opacity-80" />
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-center md:text-right flex-1">
              <span className="px-3.5 py-1.5 rounded-full teal-badge text-xs font-bold inline-block">
                {activeAudio.category_fa} • گوینده: {activeAudio.speaker_fa}
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
                  className="flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-sm shadow-xl shadow-[#1B889A]/30 transition-all active:scale-95"
                >
                  {currentAudio?.id === activeAudio.id && isPlayingAudio ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>توقف پخش صوتی</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>پخش محتوای صوتی</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-stone-300 font-bold flex items-center gap-1 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-2xl">
                  <Clock className="w-4 h-4 text-[#1B889A]" />
                  مدت زمان: {activeAudio.duration_fa}
                </span>

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

            return (
              <div
                key={aud.id}
                className={`p-5 rounded-3xl bg-[var(--card-bg)] border transition-all modern-card shadow-md flex flex-col justify-between space-y-4 overflow-hidden group ${
                  isCurrent 
                    ? 'border-[#1B889A] ring-2 ring-[#1B889A]/30' 
                    : 'border-[var(--card-border)] hover:border-[#1B889A]'
                }`}
              >
                <div className="space-y-3">
                  {/* PODCAST COVER THUMBNAIL (STRICT 16:9 HD RATIO) */}
                  {aud.cover_image && (
                    <div 
                      onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                      className="relative w-full aspect-video -mx-5 -mt-5 mb-3 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer group/cover"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={aud.cover_image}
                        alt={aud.title_fa}
                        className="w-full h-full object-cover object-center group-hover/cover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/cover:bg-black/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-lg">
                          {isPlayingThis ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">
                      {aud.category_fa}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] font-bold">{aud.duration_fa}</span>
                  </div>

                  <h3 
                    onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                    className="text-base font-bold text-[var(--text-primary)] font-serif-persian line-clamp-2 cursor-pointer hover:text-[#1B889A] transition-colors"
                  >
                    {aud.title_fa}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    {aud.description_fa}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)] truncate">گوینده: {aud.speaker_fa}</span>
                  <button
                    onClick={() => {
                      if (isPlayingThis) {
                        pauseAudio();
                      } else {
                        playAudio(aud);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                      isPlayingThis
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                        : 'bg-[#1B889A] hover:bg-[#156d7b] text-white shadow-md'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>توقف</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>پخش</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
