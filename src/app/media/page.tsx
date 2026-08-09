'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { VideoPlayerWithDescription } from '@/components/video/VideoPlayerWithDescription';
import { 
  Layers, 
  Volume2, 
  Video, 
  Image as ImageIcon, 
  Grid, 
  Play, 
  Pause, 
  Clock, 
  Eye, 
  FileText, 
  Sparkles,
  Radio,
  BookOpenCheck,
  MonitorPlay
} from 'lucide-react';
import { translations } from '@/data/translations';

export default function MediaPage() {
  const { audios, videos, infographics, currentAudio, isPlayingAudio, playAudio, pauseAudio, language, initFromStorage } = useStore();
  const t = translations[language] || translations.fa;

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'videos' | 'lectures' | 'webinairs' | 'infographics'>('all');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedInfographicModal, setSelectedInfographicModal] = useState<any | null>(null);

  // Sync selected video once videos are available
  useEffect(() => {
    if (videos && videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  // Filtered lists for specialized categories
  const podcastAudios = audios.filter(a => a.category_fa === 'پادکست‌ها' || a.id === 'aud-rahbar-salim');
  const lectureAudios = audios.filter(a => a.category_fa === 'درس‌گفتارها');
  const lectureVideos = videos.filter(v => v.category_fa === 'درس‌گفتارها');

  const webinarVideos = videos.filter(v => v.category_fa === 'وبینارها' || v.category_fa === 'نقد مکاتب' || v.id === 'vid-webinar-1' || v.id === 'vid-yt-user-1');
  const webinarAudios = audios.filter(a => a.category_fa === 'وبینارها');

  const activeDisplayVideo = selectedVideo || videos[0];

  return (
    <div className="space-y-12 py-6">
      
      {/* Header Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center space-y-4 modern-card shadow-lg">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full emerald-badge text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>مرکز چندرسانه‌ای مجله ایدئولوژی مهدویت</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-serif-persian">
          {t.media} (پادکست‌ها، ویدیوها، درس‌گفتارها، وبینارها)
        </h1>
        
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
          آرشیو چندرسانه‌ای طبقه‌بندی‌شده شامل پادکست‌های صوتی، کلیپ‌های ویدیویی یوتیوب، درس‌گفتارهای علمی، وبینارهای تخصصی آنلاین و اینفوگرافیک‌ها.
        </p>

        {/* Specialized Sub-Tabs Filter Buttons: همه، پادکست‌ها، ویدیوها، درس‌گفتارها، وبینارها، اینفوگرافیک‌ها */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          
          {/* همه */}
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{t.all}</span>
          </button>

          {/* پادکست‌ها */}
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'podcasts'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{t.podcast} ({podcastAudios.length})</span>
          </button>

          {/* ویدیوها */}
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'videos'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{t.video} ({videos.length})</span>
          </button>

          {/* درس‌گفتارها */}
          <button
            onClick={() => setActiveTab('lectures')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'lectures'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>{t.lecture} ({lectureAudios.length + lectureVideos.length})</span>
          </button>

          {/* وبینارها */}
          <button
            onClick={() => setActiveTab('webinairs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'webinairs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <span>{t.webinar} ({webinarVideos.length + webinarAudios.length})</span>
          </button>

          {/* اینفوگرافیک‌ها */}
          <button
            onClick={() => setActiveTab('infographics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'infographics'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t.infographic} ({infographics.length})</span>
          </button>

        </div>
      </div>

      {/* 1. TAB: PODCASTS (پادکست‌ها) */}
      {(activeTab === 'all' || activeTab === 'podcasts') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400" />
              <span>پادکست‌های صوتی اختصاصی ({podcastAudios.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {podcastAudios.map((aud) => {
              const isCurrentPlaying = currentAudio?.id === aud.id && isPlayingAudio;
              return (
                <div
                  key={aud.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 modern-card flex flex-col justify-between space-y-4 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[var(--card-border)] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aud.cover_image} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => isCurrentPlaying ? pauseAudio() : playAudio(aud)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white hover:bg-emerald-600/80 transition-colors"
                      >
                        {isCurrentPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                      </button>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full emerald-badge text-[10px] font-bold">
                        پادکست
                      </span>
                      <h3 className="text-base font-bold text-[var(--text-primary)] truncate font-serif-persian mt-1">
                        {aud.title_fa}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">گوینده: {aud.speaker_fa} • {aud.duration_fa}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed line-clamp-2">
                    {aud.description_fa}
                  </p>

                  <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--text-secondary)]">تعداد پخش: {aud.plays} بار</span>
                    <button
                      onClick={() => isCurrentPlaying ? pauseAudio() : playAudio(aud)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                    >
                      {isCurrentPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>توقف پخش</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>شنیدن پادکست</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TAB: VIDEOS (ویدیوها) */}
      {(activeTab === 'all' || activeTab === 'videos') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-400" />
              <span>نشست‌های ویدیویی ({videos.length})</span>
            </h2>
          </div>

          {activeDisplayVideo && (
            <VideoPlayerWithDescription video={activeDisplayVideo} />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className={`bg-[var(--card-bg)] border rounded-3xl p-4 modern-card cursor-pointer transition-all ${
                  activeDisplayVideo?.id === vid.id ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-[var(--card-border)]'
                }`}
              >
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-stone-900 mb-3 border border-[var(--card-border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current mr-0.5" />
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full emerald-badge text-[10px] font-bold block w-fit mb-1">
                  {vid.category_fa}
                </span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] truncate font-serif-persian">{vid.title_fa}</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{vid.speaker_fa} • {vid.duration_fa}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: LECTURES (درس‌گفتارها) */}
      {(activeTab === 'all' || activeTab === 'lectures') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-emerald-400" />
              <span>درس‌گفتارهای علمی (صوتی و تصویری)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lectureAudios.map((aud) => (
              <div key={aud.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 modern-card flex items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full emerald-badge text-[10px] font-bold block w-fit mb-1">درس‌گفتار صوتی</span>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{aud.title_fa}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{aud.speaker_fa} • {aud.duration_fa}</p>
                </div>
                <button
                  onClick={() => playAudio(aud)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>پخش</span>
                </button>
              </div>
            ))}

            {lectureVideos.map((vid) => (
              <div key={vid.id} onClick={() => setSelectedVideo(vid)} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 modern-card cursor-pointer flex items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full emerald-badge text-[10px] font-bold block w-fit mb-1">درس‌گفتار تصویری</span>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{vid.title_fa}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{vid.speaker_fa} • {vid.duration_fa}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: WEBINARS (وبینارها) */}
      {(activeTab === 'all' || activeTab === 'webinairs') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-emerald-400" />
              <span>وبینارها و سمینارهای تخصصی آنلاین ({webinarVideos.length})</span>
            </h2>
          </div>

          {activeDisplayVideo && (
            <VideoPlayerWithDescription video={activeDisplayVideo} />
          )}
        </div>
      )}

      {/* 5. TAB: INFOGRAPHICS (اینفوگرافیک‌ها) */}
      {(activeTab === 'all' || activeTab === 'infographics') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              <span>اینفوگرافیک‌ها و داده‌نماهای تصویری ({infographics.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {infographics.map((info) => (
              <div
                key={info.id}
                onClick={() => setSelectedInfographicModal(info)}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 modern-card cursor-pointer space-y-4 shadow-md group"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-stone-900 border border-[var(--card-border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={info.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      مشاهده تصویر کیفیت بالا
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full emerald-badge text-[10px] font-bold">
                    {info.category_fa}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian pt-1">
                    {info.title_fa}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-serif-persian line-clamp-2">
                    {info.description_fa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Infographic Modal View */}
      {selectedInfographicModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">{selectedInfographicModal.title_fa}</h3>
              <button onClick={() => setSelectedInfographicModal(null)} className="text-slate-400 hover:text-[var(--text-primary)] font-bold text-xs">
                بستن
              </button>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-[var(--card-border)] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedInfographicModal.image_url} alt="" className="w-full h-auto object-contain max-h-[70vh] mx-auto" />
            </div>

            <p className="text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed">
              {selectedInfographicModal.description_fa}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
