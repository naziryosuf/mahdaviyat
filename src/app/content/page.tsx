'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { FileText, Search, Clock, ArrowLeft, Bookmark, Sparkles, Headphones } from 'lucide-react';

export default function ContentCatalogPage() {
  const { articles, bookmarkedArticles, toggleBookmark } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');

  const categories = ['همه', 'سرمقاله‌ها', 'مقالات', 'تحلیل‌ها', 'تبصره‌ها', 'اشعار', 'و غیره...'];

  const filtered = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'همه' || art.category_fa === selectedCategory;
    const matchesSearch = art.title_fa.includes(searchQuery) || art.content_fa.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-4">
      
      {/* Header & Search */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 shadow-2xl space-y-6 modern-card">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full teal-badge text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1B889A]" />
            <span>آرشیو کامل مقالات و سایر متون</span>
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
            placeholder="جستجو در مقالات و سایر متون..."
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
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">هنوز مقاله‌ای ثبت نگردیده است</h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            می‌توانید با ورود به پنل مدیریت، مقالات و متون جدید را انتشار دهید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((art) => (
            <article
              key={art.id}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 hover:border-[#1B889A] transition-all duration-300 shadow-xl flex flex-col justify-between modern-card group"
            >
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
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {art.image_url ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] w-full border border-[var(--card-border)] bg-stone-900 shadow-sm group-hover:shadow-md transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.image_url}
                      alt={art.title_fa}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: art.image_position || 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  </div>
                ) : null}

                <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                  <Link href={`/content/${art.id}`}>{art.title_fa}</Link>
                </h3>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-serif-persian line-clamp-3">
                  {art.excerpt_fa}
                </p>

                {/* Clickable Tags Chips (Max 3) */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {art.tags.slice(0, 3).map((tag, idx) => (
                      <Link
                        key={idx}
                        href={`/?search=${encodeURIComponent(tag)}`}
                        className="px-2.5 py-0.5 rounded-full bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] hover:bg-[#1B889A] hover:text-white text-[11px] font-bold transition-all shadow-sm"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>نویسنده: <strong className="text-[var(--text-primary)]">{art.author_name_fa}</strong> {art.author_title_fa && <span className="text-[#1B889A] font-semibold text-[11px] mr-1">({art.author_title_fa})</span>}</span>
                <Link
                  href={`/content/${art.id}`}
                  className="flex items-center gap-1 text-[#1B889A] font-bold hover:underline"
                >
                  <span>مطالعه کامل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}
