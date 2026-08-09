'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Volume2, Play, Pause, Music, Sparkles, Clock, User, Headphones } from 'lucide-react';

export default function AudioLibraryPage() {
  const { audios, currentAudio, isPlayingAudio, playAudio, toggleAudioPlay } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  const categories = ['همه', 'پادکست‌ها', 'درس‌گفتارها'];

  const filtered = selectedCategory === 'همه'
    ? audios
    : audios.filter((a) => a.category_fa === selectedCategory);

  const featured = audios[0];

  return (
    <div className="space-y-12 py-4">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 text-teal-400 text-xs font-semibold border border-teal-500/30">
            <Headphones className="w-3.5 h-3.5" />
            <span>رسانه صوتی و پادکست‌های تخصصی</span>
          </div>
          <h1 className="text-3xl font-bold text-white">کتابخانه صوتی مهدویت</h1>
          <p className="text-sm text-slate-300 font-serif-persian">
            شنیدن درس‌گفتارها، پادکست‌های نقد مکاتب بشری و تحلیل‌های معرفتی در هر مکان و زمان.
          </p>
        </div>
      </div>

      {/* Featured Audio Spotlight Hero Card */}
      {featured && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.cover_image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                  <Music className="w-12 h-12 text-emerald-400 opacity-80" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                پادکست ویژه
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{featured.title_fa}</h2>
              <p className="text-sm text-slate-300 font-serif-persian leading-relaxed">
                {featured.description_fa}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>گوینده: <strong className="text-slate-200">{featured.speaker_fa}</strong></span>
                <span>•</span>
                <span>زمان: {featured.duration_fa}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (currentAudio?.id === featured.id) {
                      toggleAudioPlay();
                    } else {
                      playAudio(featured);
                    }
                  }}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all"
                >
                  {currentAudio?.id === featured.id && isPlayingAudio ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>توقف پخش</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>پخش پادکست ویژه</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Playlist Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-teal-400" />
            <span>لیست تمام قسمت‌های صوتی</span>
          </h3>

          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => {
            const isCurrent = currentAudio?.id === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-950 relative border border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.cover_image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{item.title_fa}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.speaker_fa} • {item.duration_fa} • {item.category_fa}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isCurrent) {
                      toggleAudioPlay();
                    } else {
                      playAudio(item);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    isCurrent && isPlayingAudio
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {isCurrent && isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>توقف</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>پخش صوتی</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
