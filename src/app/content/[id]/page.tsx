'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { 
  Clock, 
  User, 
  Bookmark, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Type, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { articles, bookmarkedArticles, toggleBookmark } = useStore();
  const [fontSize, setFontSize] = useState<number>(18); // default font size px

  const article = articles.find((a) => a.id === id) || articles[0];

  const isBookmarked = bookmarkedArticles.includes(article.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      alert('لینک مقاله با موفقیت در حافظه کپی گردید.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Back Button */}
      <Link
        href="/content"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به آرشیو مقالات</span>
      </Link>

      {/* Article Header */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            {article.category_fa}
          </span>

          {/* Reading Customization Bar */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span>اندازه قلم:</span>
            </span>
            <button
              onClick={() => setFontSize((s) => Math.max(s - 2, 14))}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((s) => Math.min(s + 2, 26))}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold"
            >
              A+
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                isBookmarked ? 'text-amber-400 bg-amber-950/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {article.title_fa}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              <span>نویسنده: <strong className="text-slate-200">{article.author_name_fa}</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>زمان مطالعه: {article.read_time_fa}</span>
            </span>
          </div>

          <span>تاریخ انتشار: {article.published_at}</span>
        </div>
      </header>

      {/* Main Image Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] border border-slate-800 shadow-2xl bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image_url}
          alt={article.title_fa}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      {/* Article Full Text Body */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
        <p className="text-slate-200 font-bold leading-relaxed border-r-4 border-emerald-500 pr-4 text-lg">
          {article.excerpt_fa}
        </p>

        <div 
          className="text-slate-300 font-serif-persian leading-loose whitespace-pre-line space-y-4"
          style={{ fontSize: `${fontSize}px` }}
        >
          {article.content_fa}
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>دسته: {article.category_fa}</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مجله ایدئولوژی مهدویت</span>
          </span>
        </div>
      </div>

    </div>
  );
}
