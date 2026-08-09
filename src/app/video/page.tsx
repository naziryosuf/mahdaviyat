'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { VideoPlayerWithDescription } from '@/components/video/VideoPlayerWithDescription';
import { Video, Sparkles, Play, Clock, Eye } from 'lucide-react';

export default function VideoLibraryPage() {
  const { videos } = useStore();
  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || '');

  const activeVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  return (
    <div className="space-y-12 py-4">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-semibold border border-cyan-500/30">
            <Video className="w-3.5 h-3.5" />
            <span>رسانه تصویری & نشریه‌های ویدیویی</span>
          </div>
          <h1 className="text-3xl font-bold text-white">کتابخانه ویدیویی شناختی</h1>
          <p className="text-sm text-slate-300 font-serif-persian">
            مشاهده نشست‌های علمی، نقد تصویری مکاتب بشری، همراه با باکس اختصاصی «توضیحات ویدیو»، پیاده‌سازی متنی و زمان‌بندی مباحث.
          </p>
        </div>
      </div>

      {/* Main Video Player with Dedicated Description Component */}
      {activeVideo ? (
        <VideoPlayerWithDescription video={activeVideo} />
      ) : (
        <div className="text-center py-12 text-slate-400">ویدیویی یافت نشد.</div>
      )}

      {/* Video Playlist Grid */}
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>سایر ویدیوهای رسانه مهدویت</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const isSelected = vid.id === activeVideo?.id;
            return (
              <div
                key={vid.id}
                onClick={() => {
                  setSelectedVideoId(vid.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`bg-slate-900/80 border rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vid.thumbnail_url}
                    alt={vid.title_fa}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 mr-0.5 fill-current" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] text-white dir-ltr">
                    {vid.duration_fa}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {vid.category_fa}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {vid.title_fa}
                  </h4>
                  <p className="text-xs text-slate-400">سخنران: {vid.speaker_fa}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
