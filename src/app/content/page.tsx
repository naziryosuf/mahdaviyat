'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { FileText, Search, Clock, ArrowLeft, Bookmark, Sparkles } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((art) => (
          <article
            key={art.id}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 hover:border-[#1B889A] transition-all duration-300 shadow-xl flex flex-col justify-between modern-card group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                  {art.category_fa}
                </span>
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

              <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                <Link href={`/content/${art.id}`}>{art.title_fa}</Link>
              </h3>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-serif-persian line-clamp-3">
                {art.excerpt_fa}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>نویسنده: <strong className="text-[var(--text-primary)]">{art.author_name_fa}</strong></span>
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

    </div>
  );
}
