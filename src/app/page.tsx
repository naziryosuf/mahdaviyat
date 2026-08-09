'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  BookOpen, 
  ArrowLeft, 
  Clock, 
  Search,
  Download,
  Newspaper, 
  Video, 
  Volume2, 
  Play,
  FileText,
  User,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  Filter,
  X
} from 'lucide-react';
import { translations } from '@/data/translations';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';
import { CalligraphyPenTitle } from '@/components/common/CalligraphyPenTitle';
import { InitialSitePreloader } from '@/components/common/InitialSitePreloader';

function HomeContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const { articles, magazineIssues, videos, audios, playAudio, language, toggleBookmark, bookmarkedArticles } = useStore();
  const t = translations[language] || translations.fa;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [isLoaded, setIsLoaded] = useState(false);
  const searchResultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
      setActiveSearch(urlSearch);
    }
  }, [urlSearch]);

  const categories = ['همه', 'سرمقاله‌ها', 'تحلیل‌ها', 'نقد مکاتب', 'شناخت مهدویت'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

  const queryToMatch = activeSearch.trim().toLowerCase();

  // Smooth scroll down to search results whenever search is active
  useEffect(() => {
    if (queryToMatch && searchResultsRef.current) {
      setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [queryToMatch]);

  // Site-Wide Deep Search Filtering
  const filteredArticles = articles.filter((art) => {
    if (!queryToMatch) return true;
    return (
      art.title_fa.toLowerCase().includes(queryToMatch) || 
      art.excerpt_fa.toLowerCase().includes(queryToMatch) ||
      art.content_fa.toLowerCase().includes(queryToMatch) ||
      art.author_name_fa.toLowerCase().includes(queryToMatch)
    );
  });

  const filteredAudios = audios.filter((aud) => {
    if (!queryToMatch) return true;
    return (
      aud.title_fa.toLowerCase().includes(queryToMatch) || 
      aud.speaker_fa.toLowerCase().includes(queryToMatch) ||
      aud.description_fa.toLowerCase().includes(queryToMatch)
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

  const featuredArticle = articles[0];
  const issueOne = magazineIssues[0];

  return (
    <div className="space-y-12 py-6 relative gpu-accelerate">
      
      {/* 1. INITIAL SITE PRELOADER WITH THEME MATCHED KAABA SPINNER */}
      <AnimatePresence>
        {!isLoaded && (
          <InitialSitePreloader onComplete={() => setIsLoaded(true)} />
        )}
      </AnimatePresence>

      {/* 2. HERO BANNER WITH ULTRA-SMOOTH ILLUMINATE REVEAL & PEN WRITING ANIMATION */}
      {isLoaded && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98, filter: 'brightness(0.4)' }}
          animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center space-y-6 modern-card shadow-xl"
        >
          
          {/* Glow Spheres Background Effects */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1B889A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#A32838]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Emblem (Official Kaaba Unity Emblem) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center space-y-3"
          >
            <KaabaUnityLogo size="lg" />
          </motion.div>

          {/* Headlines with Fast Right-to-Left Pen Writing Calligraphy Animation */}
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            
            {/* CALLIGRAPHY PEN WRITING ANIMATION FROM RIGHT TO LEFT */}
            <CalligraphyPenTitle title={t.siteTitle || 'ایدئولوژی مهدویت'} />

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base sm:text-xl font-bold teal-gradient-text"
            >
              {t.subTitle}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto"
            >
              {t.missionDesc}
            </motion.p>
          </div>

          {/* 3. FUNCTIONAL SEARCH BAR WITH SEARCH BUTTON INSIDE THE INPUT BOX */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveSearch(e.target.value);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full pl-28 pr-11 py-3.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A] focus:ring-2 focus:ring-[#1B889A]/20 transition-all shadow-inner font-serif-persian"
              />
              <Search className="w-5 h-5 text-[#1B889A] absolute right-4 top-4 pointer-events-none" />

              {/* EMBEDDED SEARCH ACTION BUTTON INSIDE THE INPUT BOX */}
              <button
                type="submit"
                className="absolute left-1.5 top-1.5 bottom-1.5 px-5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-xs shadow-md shadow-[#1B889A]/30 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>جستجو</span>
              </button>
            </form>

            {/* KEY HASHTAG BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--text-primary)]">موضوعات کلیدی:</span>
              <button onClick={() => { setSearchQuery('آب'); setActiveSearch('آب'); }} className="px-2.5 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all">#محیط زیست و آب</button>
              <button onClick={() => { setSearchQuery('خداشناسی'); setActiveSearch('خداشناسی'); }} className="px-2.5 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all">#خداشناسی</button>
              <button onClick={() => { setSearchQuery('خودشناسی'); setActiveSearch('خودشناسی'); }} className="px-2.5 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all">#خودشناسی</button>
              <button onClick={() => { setSearchQuery('اسلام شناسی'); setActiveSearch('اسلام شناسی'); }} className="px-2.5 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all">#اسلام شناسی</button>
              <button onClick={() => { setSearchQuery('حکمت و بیداری'); setActiveSearch('حکمت و بیداری'); }} className="px-2.5 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all">#حکمت و بیداری</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
            <Link
              href="/magazine"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-all shadow-md shadow-[#1B889A]/30 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>مطالعه شماره نخست مجله</span>
            </Link>

            <Link
              href="/magazine"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-color)] hover:bg-[var(--muted-bg)] text-[var(--text-primary)] border border-[var(--card-border)] font-bold text-xs transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4 text-[#A32838]" />
              <span>دانلود فایل PDF مجله</span>
            </Link>
          </div>

        </motion.section>
      )}

      {/* 4. DEDICATED VISIBLE SEARCH RESULTS SECTION WITH AUTOMATIC SMOOTH SCROLL */}
      {queryToMatch && (
        <section ref={searchResultsRef} className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl modern-card scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B889A] text-white flex items-center justify-center font-bold shadow-md">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                  نتایج جستجوی کلمه: «<span className="text-[#1B889A]">{activeSearch}</span>»
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
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

          {/* Search Results Grid */}
          <div className="space-y-8">
            
            {/* A. Matched Articles */}
            {filteredArticles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1B889A] flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  <FileText className="w-4 h-4" />
                  <span>مقالات و متون یافته‌شده ({filteredArticles.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map((art) => (
                    <article key={art.id} className="p-5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] transition-all space-y-3">
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">{art.category_fa}</span>
                        <span className="text-[#1B889A] font-bold">{art.read_time_fa}</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                        <Link href={`/content/${art.id}`} className="hover:text-[#1B889A] transition-colors">{art.title_fa}</Link>
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{art.excerpt_fa}</p>
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">نویسنده: {art.author_name_fa}</span>
                        <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1">
                          <span>مطالعه کامل</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* B. Matched Audio Podcasts */}
            {filteredAudios.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1B889A] flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>پادکست‌ها و شنیدنی‌های یافته‌شده ({filteredAudios.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredAudios.map((aud) => (
                    <div key={aud.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">{aud.title_fa}</h4>
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

            {/* C. Matched Videos */}
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
                      <div>
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
                <p className="text-[11px] text-[#1B889A]">لطفاً کلمات کلیدی دیگری مانند «آب»، «رهبری»، «اخوت»، «معیت» یا «خودشناسی» را امتحان نمایید.</p>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 5. Highlight Showcase: Issue 1 Magazine & Editorial Lead */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Issue 1 Showcase Card */}
        <div className="lg:col-span-5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 space-y-5 modern-card flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full crimson-badge text-xs font-bold">
                شماره نخست (تابستان ۱۴۰۴)
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#1B889A]" />
                تابستان ۱۴۰۴
              </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">
              {issueOne.title_fa}
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {issueOne.description_fa}
            </p>

            <div className="relative rounded-2xl overflow-hidden border border-[var(--card-border)] aspect-[4/3] bg-stone-900 group">
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
            <span className="text-xs text-[var(--text-secondary)]">تعداد دانلود: <strong className="text-[#1B889A] font-bold">{issueOne.download_count}</strong></span>
            <Link
              href="/magazine"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-colors shadow-md"
            >
              <span>ورق زدن آنلاین</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Lead Editorial Article */}
        {featuredArticle && (
          <div className="lg:col-span-7 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 space-y-5 modern-card flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#A32838] font-bold">
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

              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                <Link href={`/content/${featuredArticle.id}`} className="hover:text-[#1B889A] transition-colors">
                  {featuredArticle.title_fa}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {featuredArticle.excerpt_fa}
              </p>

              {/* Author & Metadata Pill */}
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#1B889A] shrink-0 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featuredArticle.author_avatar} alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                </div>
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">{featuredArticle.author_name_fa}</span>
                  <span className="text-[11px] text-[#1B889A] font-semibold">سردبیر مجله ایدئولوژی مهدویت</span>
                </div>
                <div className="mr-auto flex items-center gap-3">
                  <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.read_time_fa}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {featuredArticle.views}
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

      {/* 6. Main Stream: Articles Stream & Sidebars */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column: Articles Stream */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1B889A]" />
              <span>{t.latestArticles} ({articles.length})</span>
            </h2>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

          {/* Articles Stream */}
          <div className="space-y-5">
            {articles
              .filter(art => selectedCategory === 'همه' || art.category_fa === selectedCategory)
              .map((art) => (
                <article
                  key={art.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:border-[#1B889A] transition-all modern-card space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="px-2.5 py-0.5 rounded-full teal-badge text-xs font-bold">
                      {art.category_fa}
                    </span>
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

                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                    <Link href={`/content/${art.id}`} className="hover:text-[#1B889A] transition-colors">
                      {art.title_fa}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {art.excerpt_fa}
                  </p>

                  <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#1B889A]" />
                      <span>نویسنده: <strong className="text-[var(--text-primary)]">{art.author_name_fa}</strong></span>
                    </div>
                    <Link href={`/content/${art.id}`} className="text-[#1B889A] font-bold hover:underline flex items-center gap-1">
                      <span>مطالعه مقاله</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
          </div>

        </div>

        {/* Right Column: Archival Media Sidebars */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Archival Audio Podcasts */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 space-y-4 modern-card shadow-md">
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

          {/* Archival Video Lectures */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 space-y-4 modern-card shadow-md">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <Video className="w-4 h-4 text-[#A32838]" />
                <span>{t.topVideos}</span>
              </h3>
              <Link href="/media?tab=videos" className="text-xs text-[#A32838] font-bold hover:underline">
                آرشیو ویدیوها
              </Link>
            </div>

            <div className="space-y-2.5">
              {videos.map((vid) => (
                <Link
                  key={vid.id}
                  href="/media?tab=videos"
                  className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl flex items-center gap-3 hover:border-[#A32838] transition-colors block group"
                >
                  <div className="w-12 h-9 rounded-xl overflow-hidden shrink-0 bg-stone-900 relative border border-[var(--card-border)] shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[#A32838] transition-colors">{vid.title_fa}</h4>
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
