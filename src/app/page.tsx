'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  BookOpen, 
  ArrowLeft, 
  Clock, 
  Search,
  Download,
  Video, 
  Volume2, 
  Play,
  Pause,
  FileText,
  User,
  Eye,
  Calendar,
  CheckCircle2,
  X,
  Info,
  Pin,
  Share2,
  Newspaper
} from 'lucide-react';
import { translations } from '@/data/translations';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';
import { CalligraphyPenTitle } from '@/components/common/CalligraphyPenTitle';
import { AudioShareModal } from '@/components/audio/AudioShareModal';
import { AudioItem } from '@/types';
import { formatDurationNumeric, parseDurationToSeconds, formatRemainingCountdown } from '@/lib/audioUtils';

// Natural WhatsApp Voice Wave Heights (extracted directly from user reference waveform)
const AUDIO_WAVE_HEIGHTS = [28, 50, 20, 18, 57, 85, 20, 48, 100, 78, 12, 25, 88, 28, 28, 55, 72, 12, 22, 38, 95, 65, 18, 45, 22];

function HomeContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const { articles, magazineIssues, videos, audios, playAudio, pauseAudio, currentAudio, isPlayingAudio, audioCurrentTime, audioDuration, language, incrementMagazineDownloads } = useStore();
  const t = translations[language] || translations.fa;

  const [sharingAudio, setSharingAudio] = useState<AudioItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const categories = ['همه', 'سرمقاله‌ها', 'تحلیل‌ها', 'نقد مکاتب', 'شناخت مهدویت'];

  const triggerSearchExecution = (queryStr: string) => {
    const trimmed = queryStr.trim();
    setSearchQuery(trimmed);
    setActiveSearch(trimmed);
    if (trimmed) {
      setTimeout(() => {
        if (searchResultsRef.current) {
          const yOffset = -90; // Offset for sticky navbar / header
          const element = searchResultsRef.current;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 150);
    }
  };

  useEffect(() => {
    if (urlSearch) {
      triggerSearchExecution(urlSearch);
    }
  }, [urlSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearchExecution(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

  const queryToMatch = activeSearch.trim().toLowerCase();

  // Site-Wide Deep Search Filtering
  const filteredArticles = articles.filter((art) => {
    if (!queryToMatch) return true;
    return (
      art.title_fa.toLowerCase().includes(queryToMatch) || 
      art.excerpt_fa.toLowerCase().includes(queryToMatch) ||
      art.content_fa.toLowerCase().includes(queryToMatch) ||
      art.author_name_fa.toLowerCase().includes(queryToMatch) ||
      art.tags?.some(t => t.toLowerCase().includes(queryToMatch))
    );
  });

  const filteredAudios = audios.filter((aud) => {
    if (!queryToMatch) return true;
    return (
      aud.title_fa.toLowerCase().includes(queryToMatch) || 
      aud.speaker_fa.toLowerCase().includes(queryToMatch) ||
      aud.description_fa.toLowerCase().includes(queryToMatch) ||
      aud.category_fa.toLowerCase().includes(queryToMatch) ||
      aud.tags?.some(t => t.toLowerCase().includes(queryToMatch))
    );
  });

  const filteredVideos = videos.filter((vid) => {
    if (!queryToMatch) return true;
    return (
      vid.title_fa.toLowerCase().includes(queryToMatch) || 
      vid.speaker_fa.toLowerCase().includes(queryToMatch) ||
      vid.description_fa.toLowerCase().includes(queryToMatch)
    );
  });

  // Dynamically compute top 3 most popular tags across all content
  const allTags = [
    ...articles.flatMap(a => a.tags || []),
    ...magazineIssues.flatMap(m => m.tags || []),
    ...videos.flatMap(v => v.tags || []),
    ...audios.flatMap(au => au.tags || []),
  ];

  const tagCounts: Record<string, number> = {};
  allTags.forEach(t => {
    if (!t) return;
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  });

  const computedTop3 = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 3);

  // Fallback to top 3 tags: مهدویت, جامعه, انسان
  const displayTop3Tags = computedTop3.length >= 3 ? computedTop3 : ['مهدویت', 'جامعه', 'انسان'];

  const featuredArticle = articles.find(art => art.is_editorial === true || art.category_fa === 'سرمقاله‌ها' || art.category_fa === 'سرمقاله');
  const sortedMagazines = [...magazineIssues].sort((a, b) => {
    const numA = Number(a.issue_number) || 0;
    const numB = Number(b.issue_number) || 0;
    return numB - numA;
  });

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

  return (
    <div className="space-y-8 sm:space-y-12 py-4 sm:py-6 relative gpu-accelerate">
      
      {/* HERO BANNER WITH WIDER FLOATING ANIMATED BLUE & RED AMBIENT GLOW SPHERES */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-12 text-center space-y-5 sm:space-y-6 modern-card shadow-xl"
      >
          
          <motion.div 
            animate={{ 
              x: [0, 80, -45, 0], 
              y: [0, -70, 50, 0], 
              scale: [1, 1.45, 0.85, 1],
              opacity: [0.4, 0.8, 0.5, 0.4]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="absolute -top-20 -left-20 w-72 sm:w-[550px] h-72 sm:h-[550px] bg-[#1B889A]/35 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none z-0 max-w-full" 
          />

          <motion.div 
            animate={{ 
              x: [0, -85, 55, 0], 
              y: [0, 75, -45, 0], 
              scale: [1, 1.5, 0.8, 1],
              opacity: [0.45, 0.85, 0.5, 0.45]
            }}
            transition={{ 
              duration: 14, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="absolute -bottom-20 -right-20 w-72 sm:w-[550px] h-72 sm:h-[550px] bg-[#1B889A]/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none z-0 max-w-full" 
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center space-y-3"
          >
            <KaabaUnityLogo size="lg" />
          </motion.div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-3 sm:space-y-4">
            
            <CalligraphyPenTitle title={t.siteTitle || 'ایدئولوژی مهدویت'} />

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-sm sm:text-xl font-bold teal-gradient-text"
            >
              {t.subTitle}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto"
            >
              {t.missionDesc}
            </motion.p>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-24 sm:pl-28 pr-9 sm:pr-11 py-3 sm:py-3.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A] focus:ring-2 focus:ring-[#1B889A]/20 transition-all shadow-inner font-serif-persian"
              />
              <Search className="w-4 sm:w-5 h-4 sm:h-5 text-[#1B889A] absolute right-3 sm:right-4 top-3.5 sm:top-4 pointer-events-none" />

              <button
                type="submit"
                className="absolute left-1.5 top-1.5 bottom-1.5 px-3.5 sm:px-5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-[11px] sm:text-xs shadow-md shadow-[#1B889A]/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>جستجو</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[var(--text-secondary)] py-1 px-1">
              <span className="font-bold text-[var(--text-primary)] shrink-0">موضوعات پرجستجو:</span>
              {displayTop3Tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerSearchExecution(tag)}
                  className="px-2.5 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all font-bold shrink-0"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/magazine"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-all shadow-md shadow-[#1B889A]/30 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>مطالعه مجله</span>
            </Link>

            <Link
              href="/magazine"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-color)] hover:bg-[var(--muted-bg)] text-[var(--text-primary)] border border-[var(--card-border)] font-bold text-xs transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4 text-[#1B889A]" />
              <span>دانلود مجله</span>
            </Link>
          </div>

      </motion.section>

      {/* DYNAMICALLY REORDERED SECTIONS BASED ON ACTIVE SEARCH STATE */}
      {queryToMatch ? (
        <>
          {/* 1. SEARCH RESULTS SECTION (PLACED AT TOP WHEN SEARCH IS ACTIVE) */}
          <section ref={searchResultsRef} className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-2xl modern-card scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B889A] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                    نتایج جستجوی کلمه: «<span className="text-[#1B889A]">{activeSearch}</span>»
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">
                    مجموعاً {filteredArticles.length + filteredAudios.length + filteredVideos.length} مورد متناسب در بخش‌های مختلف یافت گردید.
                  </p>
                </div>
              </div>

              <button
                onClick={clearSearch}
                className="px-4 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-xs text-[var(--text-secondary)] hover:text-white hover:border-[#A32838] transition-colors flex items-center gap-1.5 w-fit"
              >
                <X className="w-4 h-4 text-[#A32838]" />
                <span>بستن نتایج جستجو</span>
              </button>
            </div>

            <div className="space-y-8">
              {filteredArticles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#1B889A] flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <FileText className="w-4 h-4" />
                    <span>مقالات و متون یافته‌شده ({filteredArticles.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredArticles.map((art) => (
                      <article key={art.id} className="rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden group">
                        {art.image_url && !art.image_url.startsWith('file://') && art.image_url.trim() !== '' && (
                          <Link href={`/content/${art.id}`} className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={art.image_url}
                              alt={art.title_fa}
                              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </Link>
                        )}

                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                              <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">{art.category_fa}</span>
                              <span className="text-[#1B889A] font-bold">{art.read_time_fa}</span>
                            </div>
                            <h4 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                              <Link href={`/content/${art.id}`} className="hover:text-[#1B889A] transition-colors">{art.title_fa}</Link>
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                          </div>

                          <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">
                              {art.author_name_fa?.includes('،') || art.author_name_fa?.includes(',') || (art.author_name_fa?.match(/@/g) || []).length > 1 ? 'نویسندگان:' : 'نویسنده:'} {art.author_name_fa}
                            </span>
                            <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                              <span>مطالعه کامل</span>
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {filteredAudios.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#1B889A] flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <Volume2 className="w-4 h-4" />
                    <span>پادکست‌ها و محتوای صوتی یافته‌شده ({filteredAudios.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAudios.map((aud) => {
                      const isCurrent = currentAudio?.id === aud.id;
                      const isPlayingThis = isCurrent && isPlayingAudio;
                      const coverSrc = aud.cover_image && aud.cover_image.trim() !== '' 
                        ? aud.cover_image 
                        : 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&auto=format&fit=crop&q=80';

                      return (
                        <div 
                          key={aud.id} 
                          className={`p-3.5 rounded-2xl bg-[var(--bg-color)] border transition-all modern-card shadow-sm flex items-center justify-between gap-3 group ${
                            isCurrent 
                              ? 'border-[#1B889A] ring-2 ring-[#1B889A]/30' 
                              : 'border-[var(--card-border)] hover:border-[#1B889A]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Podcast Cover Image with Play/Pause Overlay */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#1B889A]/40 shrink-0 relative bg-slate-900 shadow-md">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={coverSrc} 
                                alt={aud.title_fa} 
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&auto=format&fit=crop&q=80';
                                }}
                              />
                              <button
                                onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                                className="absolute inset-0 bg-black/40 hover:bg-[#1B889A]/80 transition-colors flex items-center justify-center text-white"
                                title={isPlayingThis ? "توقف" : "شنیدن"}
                              >
                                <div className="w-7 h-7 rounded-full bg-[#1B889A] flex items-center justify-center shadow-md">
                                  {isPlayingThis ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current translate-x-[0.5px]" />
                                  )}
                                </div>
                              </button>
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="px-2 py-0.5 rounded-full teal-badge text-[9px] font-bold block w-fit mb-0.5">
                                {aud.category_fa}
                              </span>
                              <h4 
                                onClick={() => isPlayingThis ? pauseAudio() : playAudio(aud)}
                                className="text-xs font-bold text-[var(--text-primary)] leading-snug font-serif-persian cursor-pointer hover:text-[#1B889A] transition-colors"
                                title={aud.title_fa}
                              >
                                {aud.title_fa}
                              </h4>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-serif-persian">
                                {aud.speaker_fa} • <span className="dir-ltr font-mono">{formatDurationNumeric(aud.duration_fa)}</span>
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSharingAudio(aud)}
                            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 transition-colors shrink-0"
                            title="اشتراک‌گذاری فایل صوتی"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredVideos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#A32838] flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <Video className="w-4 h-4" />
                    <span>محتوای ویدیویی یافته‌شده ({filteredVideos.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVideos.map((vid) => (
                      <Link key={vid.id} href="/media?tab=videos" className="p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center gap-3 hover:border-[#A32838] transition-colors">
                        <div className="w-20 aspect-video rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-[var(--card-border)] flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover object-center" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[var(--text-primary)] leading-snug">{vid.title_fa}</h4>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-1">{vid.speaker_fa} • {vid.duration_fa}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredArticles.length === 0 && filteredAudios.length === 0 && filteredVideos.length === 0 && (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)] space-y-2">
                  <p>هیچ موردی متناسب با عبارت <strong>«{activeSearch}»</strong> در وب‌سایت یافت نشد.</p>
                  <p className="text-[11px] text-[#1B889A]">لطفاً کلمات کلیدی دیگری مانند «انسان»، «جامعه»، «تاریخ»، «هستی» یا «خالق هستی» را امتحان نمایید.</p>
                </div>
              )}

            </div>
          </section>

          {/* 2. PINNED CONTENT SHOWCASE SECTION (PLACED BELOW SEARCH RESULTS WHEN SEARCH IS ACTIVE) */}
          {(articles.some(a => a.featured) || magazineIssues.some(m => m.featured) || videos.some(v => v.featured) || audios.some(au => au.featured)) && (
            <section className="bg-gradient-to-br from-[#1B889A]/15 via-[var(--card-bg)] to-[var(--bg-color)] border-2 border-[#1B889A] rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 shadow-2xl modern-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#1B889A] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    <Pin className="w-5 h-5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
                      پیشنهادهای ویژه
                    </h2>
                  </div>
                </div>
                <span className="self-start sm:self-center px-3 py-1 rounded-full bg-[#1B889A]/20 text-[#1B889A] text-[11px] font-extrabold border border-[#1B889A]/40 whitespace-nowrap shrink-0">
                  منتخب تحریریه 🌟
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.filter(art => art.featured).map(art => (
                  <article key={art.id} className="rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden group">
                    {art.image_url && !art.image_url.startsWith('file://') && art.image_url.trim() !== '' && (
                      <Link href={`/content/${art.id}`} className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.image_url}
                          alt={art.title_fa}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </Link>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                            <Pin className="w-3.5 h-3.5 fill-current" />
                          </span>
                          <span className="text-[#1B889A] font-bold text-[11px]">{art.read_time_fa}</span>
                        </div>

                        <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                          <Link href={`/content/${art.id}`}>{art.title_fa}</Link>
                        </h3>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>{art.author_name_fa?.includes('،') || art.author_name_fa?.includes(',') || (art.author_name_fa?.match(/@/g) || []).length > 1 ? 'نویسندگان:' : 'نویسنده:'} {art.author_name_fa}</span>
                        <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                          <span>مطالعه</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}

                {magazineIssues.filter(iss => iss.featured).map(iss => (
                  <div key={iss.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm overflow-hidden group">
                    {iss.cover_image && !iss.cover_image.startsWith('file://') && iss.cover_image.trim() !== '' && (
                      <Link href="/magazine" className="block relative w-full aspect-video -mx-4 -mt-4 mb-2.5 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border-b border-[var(--card-border)] group/img cursor-pointer flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={iss.cover_image}
                          alt={iss.title_fa}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </Link>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{iss.publish_date_fa}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                      <Link href="/magazine" className="hover:text-[#1B889A] transition-colors">{iss.title_fa}</Link>
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{iss.description_fa}</p>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>شماره {iss.issue_number}</span>
                      <Link href="/magazine" className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                        <span>ورق زدن آنلاین</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {videos.filter(vid => vid.featured).map(vid => (
                  <div key={vid.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm overflow-hidden group">
                    {vid.thumbnail_url && !vid.thumbnail_url.startsWith('file://') && vid.thumbnail_url.trim() !== '' && (
                      <Link href="/media?tab=videos" className="block relative w-full aspect-video -mx-4 -mt-4 mb-2.5 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border-b border-[var(--card-border)] group/img cursor-pointer flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vid.thumbnail_url}
                          alt={vid.title_fa}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </Link>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{vid.duration_fa}</span>
                    </div>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{vid.category_fa}</span>
                      <Link href="/media?tab=videos" className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                        <span>مشاهده</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {audios.filter(aud => aud.featured).map(aud => (
                  <div key={aud.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm overflow-hidden group">
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px] font-mono dir-ltr">{formatDurationNumeric(aud.duration_fa)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">{aud.title_fa}</h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{aud.speaker_fa}</p>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{aud.category_fa}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSharingAudio(aud)}
                          className="p-1 rounded-lg bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-secondary)] hover:text-[#1B889A] transition-all shadow-xs active:scale-95 flex items-center justify-center"
                          title="اشتراک‌گذاری فایل صوتی"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <Link href="/audio" className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                          <span>شنیدن</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        /* DEFAULT ORDER: 1. PINNED ITEMS, 2. 3 LATEST ARTICLES, 3. 3 LATEST PODCASTS, 4. 3 LATEST VIDEOS */
        <>
          {/* 1. PINNED CONTENT SHOWCASE SECTION */}
          {(articles.some(a => a.featured) || magazineIssues.some(m => m.featured) || videos.some(v => v.featured) || audios.some(au => au.featured)) && (
            <section className="bg-gradient-to-br from-[#1B889A]/15 via-[var(--card-bg)] to-[var(--bg-color)] border-2 border-[#1B889A] rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 shadow-2xl modern-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#1B889A] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    <Pin className="w-5 h-5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
                      پیشنهادهای ویژه
                    </h2>
                  </div>
                </div>
                <span className="self-start sm:self-center px-3 py-1 rounded-full bg-[#1B889A]/20 text-[#1B889A] text-[11px] font-extrabold border border-[#1B889A]/40 whitespace-nowrap shrink-0">
                  منتخب تحریریه 🌟
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.filter(art => art.featured).map(art => (
                  <article key={art.id} className="rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden group">
                    {art.image_url && !art.image_url.startsWith('file://') && art.image_url.trim() !== '' && (
                      <Link href={`/content/${art.id}`} className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.image_url}
                          alt={art.title_fa}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </Link>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                            <Pin className="w-3.5 h-3.5 fill-current" />
                          </span>
                          <span className="text-[#1B889A] font-bold text-[11px]">{art.read_time_fa}</span>
                        </div>

                        <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                          <Link href={`/content/${art.id}`}>{art.title_fa}</Link>
                        </h3>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>{art.author_name_fa?.includes('،') || art.author_name_fa?.includes(',') || (art.author_name_fa?.match(/@/g) || []).length > 1 ? 'نویسندگان:' : 'نویسنده:'} {art.author_name_fa}</span>
                        <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                          <span>مطالعه</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}

                {magazineIssues.filter(iss => iss.featured).map(iss => (
                  <div key={iss.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{iss.publish_date_fa}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">{iss.title_fa}</h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{iss.description_fa}</p>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>شماره {iss.issue_number}</span>
                      <Link href="/magazine" className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                        <span>ورق زدن آنلاین</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {videos.filter(vid => vid.featured).map(vid => (
                  <div key={vid.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{vid.duration_fa}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">{vid.title_fa}</h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{vid.speaker_fa}</p>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{vid.category_fa}</span>
                      <Link href="/media?tab=videos" className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                        <span>مشاهده</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {audios.filter(aud => aud.featured).map(aud => (
                  <div key={aud.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm overflow-hidden group">
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-xs shrink-0" title="پین‌شده">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px] font-mono dir-ltr">{formatDurationNumeric(aud.duration_fa)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">{aud.title_fa}</h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{aud.speaker_fa}</p>

                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{aud.category_fa}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSharingAudio(aud)}
                          className="p-1 rounded-lg bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-secondary)] hover:text-[#1B889A] transition-all shadow-xs active:scale-95 flex items-center justify-center"
                          title="اشتراک‌گذاری فایل صوتی"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <Link href="/audio" className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                          <span>شنیدن</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. LATEST ARTICLES SECTION */}
          {articles.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                <h2 className="text-base sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                  <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-[#1B889A]" />
                  <span>نوشته‌های اخیر</span>
                </h2>
                <Link
                  href="/content"
                  className="text-xs text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>مشاهده آرشیف کامل نوشته‌ها</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 6).map((art) => (
                  <article
                    key={art.id}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl hover:border-[#1B889A] transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden group"
                  >
                    {art.image_url && !art.image_url.startsWith('file://') && art.image_url.trim() !== '' && (
                      <Link href={`/content/${art.id}`} className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.image_url}
                          alt={art.title_fa}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </Link>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                          <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">
                            {art.category_fa}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                            <Clock className="w-3.5 h-3.5" />
                            {art.read_time_fa}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian leading-snug group-hover:text-[#1B889A] transition-colors">
                          <Link href={`/content/${art.id}`}>
                            {art.title_fa}
                          </Link>
                        </h3>

                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed font-serif-persian">
                          {art.excerpt_fa}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-serif-persian">
                        <span>{art.author_name_fa?.includes('،') || art.author_name_fa?.includes(',') || (art.author_name_fa?.match(/@/g) || []).length > 1 ? 'نویسندگان:' : 'نویسنده:'} <strong className="text-[var(--text-primary)]">{art.author_name_fa}</strong></span>
                        <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                          <span>مطالعه</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 3. LATEST PODCASTS SECTION */}
          {audios.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                <h2 className="text-base sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                  <Volume2 className="w-5 sm:w-6 h-5 sm:h-6 text-[#1B889A]" />
                  <span>صوتی‌های اخیر</span>
                </h2>
                <Link
                  href="/media?tab=podcasts"
                  className="text-xs text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>مشاهده آرشیف کامل محتوای صوتی</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAudios.slice(0, 6).map((aud) => {
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

                      {/* Card Content Body - Standard Height Matching Articles & Videos */}
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

          {/* 4. LATEST VIDEOS SECTION */}
          {sortedVideos.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                  <Video className="w-4.5 h-4.5 text-[#1B889A]" />
                  <span>ویدیوهای اخیر</span>
                </h2>
                <Link
                  href="/media?tab=videos"
                  className="text-xs text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>مشاهده آرشیف کامل محتوای ویدیویی</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedVideos.slice(0, 6).map((vid) => (
                  <Link
                    key={vid.id}
                    href="/media?tab=videos"
                    className="p-4 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all modern-card shadow-md space-y-3 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-[var(--card-border)] shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={vid.thumbnail_url} 
                          alt={vid.title_fa} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                        <p className="text-xs text-[var(--text-secondary)] mt-1 font-serif-persian">
                          {vid.speaker_fa?.includes('،') || vid.speaker_fa?.includes(',') || (vid.speaker_fa?.match(/@/g) || []).length > 1 ? 'سخنرانان / ارائه‌دهندگان:' : 'سخنران:'} {vid.speaker_fa}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[#1B889A] font-bold">
                      <span>مشاهده ویدیو</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Editorial Article (if present) */}
          {featuredArticle && (
            <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-5 modern-card flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#1B889A] font-bold">
                    <FileText className="w-4 h-4" />
                    <span>سرمقاله‌ها</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                  <Link href={`/content/${featuredArticle.id}`} className="hover:text-[#1B889A] transition-colors">
                    {featuredArticle.title_fa}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {featuredArticle.excerpt_fa}
                </p>

                {featuredArticle.image_url && !featuredArticle.image_url.startsWith('file://') && featuredArticle.image_url.trim() !== '' && (
                  <Link href={`/content/${featuredArticle.id}`} className="block relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--card-border)] bg-slate-900 shadow-md group/img cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featuredArticle.image_url} alt={featuredArticle.title_fa} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </Link>
                )}

                <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#1B889A] shrink-0 shadow-md bg-slate-800 flex items-center justify-center">
                    {featuredArticle.author_avatar && !featuredArticle.author_avatar.includes('unsplash.com') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featuredArticle.author_avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1B889A] text-white flex items-center justify-center font-bold text-sm font-serif-persian">
                        {featuredArticle.author_name_fa ? featuredArticle.author_name_fa.trim().charAt(0) : 'ن'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[var(--text-primary)] block truncate">{featuredArticle.author_name_fa}</span>
                    <span className="text-[11px] text-[#1B889A] font-semibold block truncate">{featuredArticle.author_title_fa || 'نویسنده و پژوهشگر'}</span>
                  </div>
                  <div className="mr-auto flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.read_time_fa}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">تاریخ انتشار: {featuredArticle.published_at}</span>
                <Link
                  href={`/content/${featuredArticle.id}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#1B889A] hover:underline"
                >
                  <span>مطالعه کامل سرمقاله</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>
          )}

          {/* 5. ALL MAGAZINES SECTION (MATCHING SIZES & STYLES OF OTHER CARDS) */}
          {sortedMagazines.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                <h2 className="text-base sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                  <Newspaper className="w-5 sm:w-6 h-5 sm:h-6 text-[#1B889A]" />
                  <span>شماره‌های مجلهٔ ایدئولوژی مهدویت</span>
                </h2>
                <Link
                  href="/magazine"
                  className="text-xs text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>مشاهده آرشیف کامل مجلات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMagazines.map((issue, idx) => {
                  const coverSrc = issue.cover_image && issue.cover_image.trim() !== ''
                    ? issue.cover_image
                    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

                  return (
                    <article
                      key={issue.id}
                      className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl hover:border-[#1B889A] transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden group"
                    >
                      <Link href={`/magazine?issue=${issue.id}`} className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverSrc}
                          alt={issue.title_fa}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-white pointer-events-none">
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-bold">
                            <BookOpen className="w-3 h-3 text-[#1B889A]" />
                            <span>{issue.page_count_fa || '۴۵ صفحه کامل'}</span>
                          </span>
                          {idx === 0 && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#1B889A] text-[10px] font-bold text-white shadow-xs">
                              جدیدترین شماره
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                            <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">
                              شماره {issue.issue_number}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                              <Calendar className="w-3.5 h-3.5" />
                              {issue.publish_date_fa || '۱۴۰۴'}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian leading-snug group-hover:text-[#1B889A] transition-colors line-clamp-1">
                            <Link href={`/magazine?issue=${issue.id}`}>
                              {issue.title_fa}
                            </Link>
                          </h3>

                          <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed font-serif-persian">
                            {issue.description_fa}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-serif-persian">
                          <a
                            href={issue.pdf_url || '/downloads/mahdism_issue_1.pdf'}
                            download={`مجله_ایدئولوژی_مهدویت_شماره_${issue.issue_number}.pdf`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => incrementMagazineDownloads(issue.id)}
                            className="text-[var(--text-secondary)] hover:text-[#1B889A] font-bold flex items-center gap-1.5 transition-colors"
                            title="دانلود نسخه PDF مجله"
                          >
                            <Download className="w-3.5 h-3.5 text-[#1B889A]" />
                            <span>دانلود (PDF)</span>
                          </a>

                          <Link
                            href={`/magazine?issue=${issue.id}`}
                            className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0"
                          >
                            <span>ورق زدن آنلاین</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {/* Audio Share Modal */}
      <AudioShareModal audio={sharingAudio} onClose={() => setSharingAudio(null)} />

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-secondary)]">در حال بارگذاری...</div>}>
      <HomeContent />
    </Suspense>
  );
}
