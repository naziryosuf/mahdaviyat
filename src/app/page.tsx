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
  FileText,
  User,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  X,
  Info,
  Pin
} from 'lucide-react';
import { translations } from '@/data/translations';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';
import { CalligraphyPenTitle } from '@/components/common/CalligraphyPenTitle';

function HomeContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const { articles, magazineIssues, videos, audios, playAudio, language, toggleBookmark, bookmarkedArticles, aboutUsMission } = useStore();
  const t = translations[language] || translations.fa;

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

  const featuredArticle = articles[0];
  const issueOne = magazineIssues[0];

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
              {aboutUsMission || t.missionDesc}
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
              <span>مطالعه شماره نخست مجله</span>
            </Link>

            <Link
              href="/magazine"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-color)] hover:bg-[var(--muted-bg)] text-[var(--text-primary)] border border-[var(--card-border)] font-bold text-xs transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4 text-[#1B889A]" />
              <span>دانلود فایل PDF مجله</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map((art) => (
                      <article key={art.id} className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all space-y-3">
                        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                          <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">{art.category_fa}</span>
                          <span className="text-[#1B889A] font-bold">{art.read_time_fa}</span>
                        </div>
                        <h4 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                          <Link href={`/content/${art.id}`} className="hover:text-[#1B889A] transition-colors">{art.title_fa}</Link>
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                        <div className="pt-2 flex items-center justify-between text-xs">
                          <span className="text-[var(--text-secondary)] truncate max-w-[180px]">نویسنده: {art.author_name_fa}</span>
                          <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                            <span>مطالعه کامل</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Link>
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
                    <span>پادکست‌ها و شنیدنی‌های یافته‌شده ({filteredAudios.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredAudios.map((aud) => (
                      <div key={aud.id} className="p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{aud.title_fa}</h4>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-1">{aud.speaker_fa} • {aud.duration_fa}</p>
                        </div>
                        <button
                          onClick={() => playAudio(aud)}
                          className="w-9 h-9 rounded-xl bg-[#1B889A] text-white flex items-center justify-center shrink-0 shadow-md hover:bg-[#156d7b] transition-colors"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredVideos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#A32838] flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <Video className="w-4 h-4" />
                    <span>ویدیوها و درس‌گفتارهای یافته‌شده ({filteredVideos.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredVideos.map((vid) => (
                      <Link key={vid.id} href="/media?tab=videos" className="p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center gap-3 hover:border-[#A32838] transition-colors">
                        <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-[var(--card-border)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{vid.title_fa}</h4>
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
                      مطالب پین‌شده و ویژه
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                      برگزیده متون، مجلات و رسانه‌ها در صفحه اول
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-center px-3 py-1 rounded-full bg-[#1B889A]/20 text-[#1B889A] text-[11px] font-extrabold border border-[#1B889A]/40 whitespace-nowrap shrink-0">
                  منتخب تحریریه 🌟
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.filter(art => art.featured).map(art => (
                  <article key={art.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm group">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>مقاله پین‌شده</span>
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{art.read_time_fa}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                      <Link href={`/content/${art.id}`}>{art.title_fa}</Link>
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                    
                    <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span className="truncate">نویسنده: {art.author_name_fa}</span>
                      <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                        <span>مطالعه</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}

                {magazineIssues.filter(iss => iss.featured).map(iss => (
                  <div key={iss.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>شماره مجله پین‌شده</span>
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{iss.publish_date_fa}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{iss.title_fa}</h3>
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
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>ویدیو پین‌شده</span>
                      </span>
                      <span className="text-[#1B889A] font-bold text-[11px]">{vid.duration_fa}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{vid.title_fa}</h3>
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
              </div>
            </section>
          )}
        </>
      ) : (
        /* DEFAULT ORDER: PINNED SECTION FIRST WHEN NO SEARCH ACTIVE */
        (articles.some(a => a.featured) || magazineIssues.some(m => m.featured) || videos.some(v => v.featured) || audios.some(au => au.featured)) && (
          <section className="bg-gradient-to-br from-[#1B889A]/15 via-[var(--card-bg)] to-[var(--bg-color)] border-2 border-[#1B889A] rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-5 shadow-2xl modern-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#1B889A] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Pin className="w-5 h-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
                    مطالب پین‌شده و ویژه
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                    برگزیده متون، مجلات و رسانه‌ها در صفحه اول
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-[#1B889A]/20 text-[#1B889A] text-[11px] font-extrabold border border-[#1B889A]/40 whitespace-nowrap shrink-0">
                منتخب تحریریه 🌟
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.filter(art => art.featured).map(art => (
                <article key={art.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>مقاله پین‌شده</span>
                    </span>
                    <span className="text-[#1B889A] font-bold text-[11px]">{art.read_time_fa}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                    <Link href={`/content/${art.id}`}>{art.title_fa}</Link>
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                  
                  <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="truncate">نویسنده: {art.author_name_fa}</span>
                    <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                      <span>مطالعه</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}

              {magazineIssues.filter(iss => iss.featured).map(iss => (
                <div key={iss.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border-2 border-[#1B889A]/40 hover:border-[#1B889A] transition-all space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>شماره مجله پین‌شده</span>
                    </span>
                    <span className="text-[#1B889A] font-bold text-[11px]">{iss.publish_date_fa}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{iss.title_fa}</h3>
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
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>ویدیو پین‌شده</span>
                    </span>
                    <span className="text-[#1B889A] font-bold text-[11px]">{vid.duration_fa}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{vid.title_fa}</h3>
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
            </div>
          </section>
        )
      )}

      {/* HIGHLIGHT SHOWCASE SECTION */}
      {(issueOne || featuredArticle) && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Issue 1 Showcase Card */}
          {issueOne && (
            <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 modern-card flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full teal-badge text-[11px] sm:text-xs font-bold">
                    شماره نخست مجله
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1B889A]" />
                    {issueOne.publish_date_fa || 'تابستان ۱۴۰۴'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] font-serif-persian">
                  {issueOne.title_fa}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {issueOne.description_fa}
                </p>

                <div className="relative rounded-2xl overflow-hidden border border-[var(--card-border)] aspect-[16/9] sm:aspect-[4/3] bg-stone-900 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={issueOne.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B889A]" />
                      شامل ۴۵ صفحه کامل و تمامی ۹ مقاله اختصاصی
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">تعداد دانلود: <strong className="text-[#1B889A] font-bold">{issueOne.download_count || 0}</strong></span>
                <Link
                  href="/magazine"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-colors shadow-md"
                >
                  <span>ورق زدن آنلاین</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Lead Editorial Article */}
          {featuredArticle && (
            <div className={`${issueOne ? 'lg:col-span-7' : 'lg:col-span-12'} bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-5 modern-card flex flex-col justify-between shadow-lg`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#1B889A] font-bold">
                    <FileText className="w-4 h-4" />
                    <span>سرمقاله‌ها</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(featuredArticle.id)}
                    className={`p-1.5 rounded-xl border transition-all ${
                      bookmarkedArticles.includes(featuredArticle.id)
                        ? 'bg-[#1B889A] text-white border-[#1B889A]'
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                    }`}
                    title="نشان‌کردن مقاله"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                  <Link href={`/content/${featuredArticle.id}`} className="hover:text-[#1B889A] transition-colors">
                    {featuredArticle.title_fa}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {featuredArticle.excerpt_fa}
                </p>

                <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#1B889A] shrink-0 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featuredArticle.author_avatar} alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-[var(--text-primary)] block truncate">{featuredArticle.author_name_fa}</span>
                    <span className="text-[11px] text-[#1B889A] font-semibold block truncate">سردبیر مجله ایدئولوژی مهدویت</span>
                  </div>
                  <div className="mr-auto flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.read_time_fa}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {featuredArticle.views || 1}
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
            </div>
          )}

        </section>
      )}

      {/* ARTICLES STREAM & SIDEBARS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1B889A]" />
              <span>{t.latestArticles} ({articles.length})</span>
            </h2>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                      : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {articles
              .filter(art => selectedCategory === 'همه' || art.category_fa === selectedCategory)
              .map((art) => (
                <article
                  key={art.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 sm:p-5 hover:border-[#1B889A] transition-all modern-card space-y-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] sm:text-xs font-bold">
                        {art.category_fa}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                        <Clock className="w-3.5 h-3.5" />
                        {art.read_time_fa}
                      </span>
                      <button
                        onClick={() => toggleBookmark(art.id)}
                        className={`p-1 rounded transition-colors ${
                          bookmarkedArticles.includes(art.id) ? 'text-[#1B889A]' : 'text-stone-400 hover:text-[#1B889A]'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                    <Link href={`/content/${art.id}`} className="hover:text-[#1B889A] transition-colors">
                      {art.title_fa}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {art.excerpt_fa}
                  </p>

                  <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-3.5 h-3.5 text-[#1B889A] shrink-0" />
                      <span className="truncate">نویسنده: <strong className="text-[var(--text-primary)]">{art.author_name_fa}</strong></span>
                    </div>
                    <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1 shrink-0">
                      <span>مطالعه مقاله</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
          </div>

        </div>

        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4 modern-card shadow-md">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#1B889A]" />
                <span>{t.topAudios}</span>
              </h3>
              <Link href="/media?tab=podcasts" className="text-xs text-[#1B889A] font-bold hover:underline">
                آرشیو پادکست‌ها
              </Link>
            </div>

            <div className="space-y-2.5">
              {audios.map((aud) => (
                <div
                  key={aud.id}
                  className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-3 hover:border-[#1B889A] transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{aud.title_fa}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{aud.speaker_fa} • {aud.duration_fa}</p>
                  </div>
                  <button
                    onClick={() => playAudio(aud)}
                    className="w-8 h-8 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-all"
                    title="شنیدن صوتی"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4 modern-card shadow-md">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <Video className="w-4 h-4 text-[#1B889A]" />
                <span>{t.topVideos}</span>
              </h3>
              <Link href="/media?tab=videos" className="text-xs text-[#1B889A] font-bold hover:underline">
                آرشیو ویدیوها
              </Link>
            </div>

            <div className="space-y-2.5">
              {videos.map((vid) => (
                <Link
                  key={vid.id}
                  href="/media?tab=videos"
                  className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl flex items-center gap-3 hover:border-[#1B889A] transition-colors block group"
                >
                  <div className="w-12 h-9 rounded-xl overflow-hidden shrink-0 bg-stone-900 relative border border-[var(--card-border)] shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[#1B889A] transition-colors">{vid.title_fa}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{vid.speaker_fa} • {vid.duration_fa}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </section>

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
