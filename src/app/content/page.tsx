'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { FileText, Search, Clock, ArrowLeft, Bookmark, Sparkles, Headphones, Tag } from 'lucide-react';

function ContentCatalogInner() {
  const { articles, bookmarkedArticles, toggleBookmark } = useStore();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) {
      setSearchQuery(s);
    }
  }, [searchParams]);

  const categories = ['همه', 'سرمقاله‌ها', 'مقالات', 'تحلیل‌ها', 'تبصره‌ها', 'اشعار', 'و غیره...'];

  const filtered = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'همه' || art.category_fa === selectedCategory;
    const q = searchQuery.trim().toLowerCase().replace(/^#/, '');
    if (!q) return matchesCategory;
    const matchesTitle = art.title_fa.toLowerCase().includes(q);
    const matchesContent = art.content_fa.toLowerCase().includes(q);
    const matchesTags = art.tags?.some((t) => t.toLowerCase().includes(q));
    const matchesCategoryName = art.category_fa.toLowerCase().includes(q);
    return matchesCategory && (matchesTitle || matchesContent || matchesTags || matchesCategoryName);
  });

  return (
    <div className="space-y-8 py-4">
      
      {/* Header & Search */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 shadow-2xl space-y-6 modern-card">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full teal-badge text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1B889A]" />
            <span>آرشیف کامل مقالات و سایر متون</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] font-serif-persian">مقالات و سایر متون</h1>
          <p className="text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            مجموعه کامل سرمقاله‌ها، مقالات علمی، تحلیل‌ها، تبصره‌ها و اشعار نشریه ایدئولوژی مهدویت.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در مقالات، هشتگ‌ها و متون..."
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A] transition-colors shadow-inner"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--card-border)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                  : 'bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center space-y-4 modern-card">
          <FileText className="w-12 h-12 text-[#1B889A] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
            {searchQuery ? `هیچ مقاله‌ای با عنوان یا هشتگ «${searchQuery}» یافت نشد` : 'هنوز مقاله‌ای ثبت نگردیده است'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            می‌توانید عبارات جستجو را تغییر دهید یا از پنل مدیریت مقالات جدید انتشار دهید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <article
              key={art.id}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl hover:border-[#1B889A] transition-all duration-300 shadow-xl flex flex-col justify-between modern-card group overflow-hidden"
            >
              {/* ARTICLE COVER IMAGE DISPLAY (STRICT 16:9 HD RATIO & FLUSH ALIGNED EDGES) */}
              {art.image_url && !art.image_url.startsWith('file://') && art.image_url.trim() !== '' && (
                <Link
                  href={`/content/${art.id}`}
                  className="block relative w-full aspect-video overflow-hidden border-b border-[var(--card-border)] bg-slate-900 group/img cursor-pointer shrink-0"
                  title="برای مطالعه مقاله کلیک کنید"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.image_url}
                    alt={art.title_fa}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </Link>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">
                        {art.category_fa}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1 font-bold text-[#1B889A]">
                        <Clock className="w-3.5 h-3.5" />
                        {art.read_time_fa}
                      </span>
                      <button
                        onClick={() => toggleBookmark(art.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmarkedArticles.includes(art.id)
                            ? 'text-[#1B889A] bg-[#1B889A]/10'
                            : 'text-stone-400 hover:text-[#1B889A]'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                      <Link href={`/content/${art.id}`} className="hover:text-[#1B889A] transition-colors">
                        {art.title_fa}
                      </Link>
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed font-serif-persian">
                      {art.excerpt_fa}
                    </p>
                  </div>

                  {/* Hashtags display */}
                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--card-border)]">
                      {art.tags.map((t, idx) => (
                        <Link
                          key={idx}
                          href={`/?search=${encodeURIComponent(t.replace(/^#/, ''))}`}
                          className="px-2 py-0.5 rounded-full bg-[#1B889A]/10 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-mono text-[10px] font-bold cursor-pointer transition-all"
                          title={`جستجوی هشتگ ${t} در صفحه اصلی`}
                        >
                          {t.startsWith('#') ? t : `#${t}`}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-serif-persian">
                    نویسنده: {art.author_name_fa || 'M. Nazir Yosuf'}
                  </span>
                  <Link
                    href={`/content/${art.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B889A] hover:gap-2 transition-all"
                  >
                    <span>مطالعه مقاله</span>
                    <ArrowLeft className="w-3.5 h-3.5 dir-rtl-rotate" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContentCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-secondary)]">در حال بارگذاری مقالات...</div>}>
      <ContentCatalogInner />
    </Suspense>
  );
}
