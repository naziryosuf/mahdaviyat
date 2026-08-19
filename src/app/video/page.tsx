'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { VideoPlayerWithDescription } from '@/components/video/VideoPlayerWithDescription';
import { Video, Sparkles, Play, Clock, Eye, X } from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';
import { VideoItem } from '@/types';

export default function VideoLibraryPage() {
  const { videos } = useStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <div className="space-y-10 py-6">
      
      {/* Header Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 modern-card">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full teal-badge text-xs font-semibold">
            <Video className="w-3.5 h-3.5 text-[#1B889A]" />
            <span>رسانه تصویری & نشریه‌های ویدیویی</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian">
            کتابخانه ویدیویی شناختی ایدئولوژی مهدویت
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            مشاهده نشست‌های علمی، نقد تصویری مکاتب بشری، همراه با باکس اختصاصی «توضیحات ویدیو»، پیاده‌سازی متنی و زمان‌بندی مباحث.
          </p>
        </div>
      </div>

      {/* Video Playlist Grid (Interactive Gallery - No Auto-Play on Initial Load) */}
      <div className="space-y-6">
        <div className="border-b border-[var(--card-border)] pb-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
            <Video className="w-5 h-5 text-[#1B889A]" />
            <span>گالری محتوای ویدیویی ({videos.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const ytEmbed = parseVideoUrl(vid.video_url);
            const thumbUrl = vid.thumbnail_url || ytEmbed.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

            return (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl group p-4 space-y-3 flex flex-col justify-between modern-card"
              >
                <div className="space-y-3">
                  {/* 16:9 HD Thumbnail Container */}
                  <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-2xl border border-[var(--card-border)] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl}
                      alt={vid.title_fa}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 bg-black/80 rounded-lg text-[10px] font-mono text-white dir-ltr font-bold border border-white/10">
                      {vid.duration_fa}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full teal-badge inline-block">
                      {vid.category_fa}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors line-clamp-2 font-serif-persian leading-snug">
                      {vid.title_fa}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] font-serif-persian">سخنران: {vid.speaker_fa}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)] font-bold">دیدن ویدیو</span>
                  <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold transition-colors shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>پخش آنی</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-0 relative max-h-[95vh] overflow-y-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B889A] animate-pulse shrink-0" />
                <h3 className="font-bold text-sm sm:text-base truncate font-serif-persian">{selectedVideo.title_fa}</h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VideoPlayerWithDescription video={selectedVideo} />
          </div>
        </div>
      )}

    </div>
  );
}
