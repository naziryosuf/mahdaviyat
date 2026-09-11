'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { 
  Sparkles, 
  Volume2, 
  Video, 
  Play, 
  Pause,
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
  X,
  Share2
} from 'lucide-react';
import { AudioItem, VideoItem, InfographicItem } from '@/types';
import { VideoPlayerWithDescription } from '@/components/video/VideoPlayerWithDescription';
import { AudioShareModal } from '@/components/audio/AudioShareModal';
import { parseVideoUrl } from '@/utils/videoEmbed';
import { 
  AUDIO_WAVE_HEIGHTS, 
  formatDurationNumeric, 
  formatRemainingCountdown, 
  parseDurationToSeconds 
} from '@/lib/audioUtils';

export function MediaPageClient() {
  const { 
    audios, 
    videos, 
    infographics, 
    playAudio, 
    pauseAudio, 
    currentAudio, 
    isPlayingAudio,
    audioCurrentTime,
    audioDuration
  } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'videos' | 'infographics'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDisplayVideo, setActiveDisplayVideo] = useState<VideoItem | null>(null);
  const [sharingAudio, setSharingAudio] = useState<AudioItem | null>(null);

  const sortedAudios = React.useMemo(() => {
    return [...audios].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [audios]);

  const sortedVideos = React.useMemo(() => {
    return [...videos].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [videos]);

  const currentDisplayVideo = activeDisplayVideo || sortedVideos[0];

  const filteredAudios = sortedAudios.filter(a => 
    a.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.speaker_fa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = sortedVideos.filter(v => 
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
                    <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
                      isPlayingThis 
                        ? 'bg-black/75 backdrop-blur-[1px]' 
                        : 'bg-gradient-to-t from-black/75 via-black/25 to-transparent'
                    }`} />

                    {/* Centered Audio Wave or Play Button */}
                    {isPlayingThis ? (
                      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10">
                        <div className="w-full max-w-[340px] flex items-center justify-between gap-3 sm:gap-4 select-none animate-fade-in">
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

                          <span className="text-xs sm:text-sm font-mono font-bold text-white dir-ltr shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wider pointer-events-none">
                            {countdownText}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
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

                  {/* Card Content Body */}
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
                          onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 ${
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
                              <Play className="w-3.5 h-3.5 fill-current translate-x-[0.5px]" />
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
        </section>
      )}

      {/* VIDEO SECTION (INTERACTIVE GRID GALLERY - NO INITIAL AUTO-PLAY) */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Video className="w-4.5 h-4.5 text-[#1B889A]" />
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
                        <div className="w-9 h-9 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <Play className="w-4 h-4 fill-current" />
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
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
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
                <h3 className="font-bold text-sm sm:text-base leading-snug font-serif-persian">{activeDisplayVideo.title_fa}</h3>
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

      {/* Audio Share Modal */}
      <AudioShareModal audio={sharingAudio} onClose={() => setSharingAudio(null)} />

    </div>
  );
}
