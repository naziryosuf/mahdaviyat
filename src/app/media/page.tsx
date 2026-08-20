'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { 
  Sparkles, 
  Volume2, 
  Video, 
  Play, 
  Download, 
  Search, 
  FileText, 
  Image as ImageIcon,
  Radio,
  Clock,
  Layers,
  BookOpenCheck,
  MonitorPlay,
  ArrowLeft,
  X
} from 'lucide-react';
import { AudioItem, VideoItem, InfographicItem } from '@/types';
import { VideoPlayerWithDescription } from '@/components/video/VideoPlayerWithDescription';
import { parseVideoUrl } from '@/utils/videoEmbed';

export default function MediaPage() {
  const { audios, videos, infographics, playAudio, currentAudio, isPlayingAudio } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'videos' | 'infographics'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDisplayVideo, setActiveDisplayVideo] = useState<VideoItem | null>(null);

  const currentDisplayVideo = activeDisplayVideo || videos[0];

  const filteredAudios = audios.filter(a => 
    a.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.speaker_fa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(v => 
    v.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.speaker_fa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInfographics = infographics.filter(i => 
    i.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.description_fa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 py-6">
      
      {/* Header Banner */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 modern-card">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full teal-badge text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-[#1B889A]" />
          <span>آرشیف جامع چندرسانه‌ای</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian">
          چندرسانه‌ای مجله <span className="teal-gradient-text">ایدئولوژی مهدویت</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          دسترسی به محتوای صوتی، محتوای ویدیویی، محتوای تصویری و گرافیکی و مطالب شنیداری.
        </p>

        {/* Tab Filters */}
        <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-[var(--card-border)]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
            }`}
          >
            همه بخش‌ها
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'podcasts'
                ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
            }`}
          >
            محتوای صوتی
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'videos'
                ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
            }`}
          >
            محتوای ویدیویی
          </button>
          <button
            onClick={() => setActiveTab('infographics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'infographics'
                ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
            }`}
          >
            محتوای تصویری و گرافیکی
          </button>
        </div>
      </section>

      {/* AUDIO PODCASTS SECTION */}
      {(activeTab === 'all' || activeTab === 'podcasts') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#1B889A]" />
              <span>محتوای صوتی ({filteredAudios.length})</span>
            </h2>
            <Link href="/audio" className="text-xs text-[#1B889A] font-bold hover:underline">
              صفحه اختصاصی آرشیف صوتی
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudios.map((aud) => (
              <div key={aud.id} className="p-5 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all modern-card shadow-md space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#1B889A]/40 shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={aud.cover_image} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => playAudio(aud)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center text-white hover:bg-[#1B889A]/80 transition-colors"
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] font-bold">
                      {aud.category_fa}
                    </span>
                    <h3 
                      onClick={() => playAudio(aud)}
                      className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate mt-1 cursor-pointer hover:text-[#1B889A] transition-colors"
                      title="پخش محتوای صوتی"
                    >
                      {aud.title_fa}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{aud.speaker_fa}</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {aud.description_fa}
                </p>

                {/* Clickable Tags Chips (Max 3) */}
                {aud.tags && aud.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {aud.tags.slice(0, 3).map((tag, idx) => (
                      <Link
                        key={idx}
                        href={`/?search=${encodeURIComponent(tag)}`}
                        className="px-2 py-0.5 rounded-full bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] hover:bg-[#1B889A] hover:text-white text-[10px] font-bold transition-all shadow-sm"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)] font-bold">{aud.duration_fa}</span>
                  <button
                    onClick={() => playAudio(aud)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>پخش صوتی</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIDEO SECTION (INTERACTIVE GRID GALLERY - NO INITIAL AUTO-PLAY) */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Video className="w-5 h-5 text-[#1B889A]" />
              <span>محتوای ویدیویی ({filteredVideos.length})</span>
            </h2>
            <Link href="/video" className="text-xs text-[#1B889A] font-bold hover:underline">
              صفحه اختصاصی ویدیویی
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => {
              const ytEmbed = parseVideoUrl(vid.video_url);
              const thumbUrl = vid.thumbnail_url || ytEmbed.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveDisplayVideo(vid)}
                  className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all modern-card shadow-md space-y-3 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* 16:9 HD THUMBNAIL CONTAINER */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-[var(--card-border)] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbUrl}
                        alt={vid.title_fa}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 bg-black/80 rounded-lg text-[10px] font-mono text-white dir-ltr font-bold border border-white/10">
                        {vid.duration_fa}
                      </span>
                    </div>

                    <div>
                      <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] font-bold block w-fit mb-1.5">
                        {vid.category_fa}
                      </span>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug line-clamp-2">
                        {vid.title_fa}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 font-serif-persian">سخنران: {vid.speaker_fa}</p>

                      {/* Clickable Tags Chips (Max 3) */}
                      {vid.tags && vid.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          {vid.tags.slice(0, 3).map((tag, idx) => (
                            <Link
                              key={idx}
                              href={`/?search=${encodeURIComponent(tag)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded-full bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] hover:bg-[#1B889A] hover:text-white text-[10px] font-bold transition-all shadow-sm"
                            >
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--text-secondary)]">درس‌گفتار تصویری</span>
                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md hover:bg-[#156d7b] transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>پخش ویدیو</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* INFOGRAPHICS SECTION */}
      {(activeTab === 'all' || activeTab === 'infographics') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#1B889A]" />
              <span>محتوای تصویری و گرافیکی ({filteredInfographics.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfographics.map((info) => (
              <div key={info.id} className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all modern-card shadow-md space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 border border-[var(--card-border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={info.image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#1B889A]" />
                    <span className="text-xs font-bold text-[#1B889A]">{info.category_fa}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">
                    {info.title_fa}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {info.description_fa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIDEO PLAYBACK LIGHTBOX MODAL */}
      {activeDisplayVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-0 relative max-h-[95vh] overflow-y-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B889A] animate-pulse shrink-0" />
                <h3 className="font-bold text-sm sm:text-base truncate font-serif-persian">{activeDisplayVideo.title_fa}</h3>
              </div>
              <button
                onClick={() => setActiveDisplayVideo(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="بستن ویدیودان"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VideoPlayerWithDescription video={activeDisplayVideo} />
          </div>
        </div>
      )}

    </div>
  );
}
