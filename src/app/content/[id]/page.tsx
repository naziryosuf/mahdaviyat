'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { 
  Clock, 
  User, 
  Bookmark, 
  Share2, 
  Printer,
  ArrowRight, 
  Type, 
  Sparkles, 
  Headphones, 
  Play, 
  Pause,
  VolumeX,
  Radio,
  ExternalLink,
  Download,
  CheckCircle2,
  X,
  Send,
  MessageCircle,
  Copy,
  Mail,
  Globe
} from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { articles, bookmarkedArticles, toggleBookmark, playAudio, currentAudio, isPlayingAudio, pauseAudio } = useStore();
  const [fontSize, setFontSize] = useState<number>(17); // optimal mobile/desktop reading font size
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const article = articles.find((a) => a.id === id) || articles[0];

  const isBookmarked = bookmarkedArticles.includes(article.id);
  const isPlayingThisAudio = currentAudio?.id === article.id && isPlayingAudio;

  const hasAudio = Boolean(article.audio_url && article.audio_url.trim().length > 0);
  const isYouTubeAudio = hasAudio && (article.audio_url?.includes('youtube.com') || article.audio_url?.includes('youtu.be'));
  const videoEmbedInfo = hasAudio ? parseVideoUrl(article.audio_url!) : null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('لینک مقاله با موفقیت کپی شد');
    }
  };

  const handlePrint = () => {
    showToast('در حال آماده‌سازی نسخه اختصاصی چاپ و پرینت مقاله...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleToggleBookmark = () => {
    toggleBookmark(article.id);
    if (!isBookmarked) {
      showToast('مقاله با موفقیت نشان‌گذاری و ذخیره گردید');
    } else {
      showToast('مقاله از لیست نشان‌شده‌ها حذف گردید');
    }
  };

  const handlePlayArticleAudio = () => {
    if (!article.audio_url) return;
    if (isPlayingThisAudio) {
      pauseAudio();
    } else {
      playAudio({
        id: article.id,
        title_fa: article.title_fa,
        speaker_fa: article.audio_speaker_fa || article.author_name_fa,
        audio_url: article.audio_url,
        duration_fa: article.read_time_fa,
        description_fa: article.excerpt_fa,
        category_fa: article.category_fa,
        cover_image: article.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
        published_at: article.published_at,
      });
    }
  };

  // Social Share Links Generator
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article.title_fa;

  const socialLinks = [
    {
      name: 'تلگرام (Telegram)',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: 'واتساپ (WhatsApp)',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n' + currentUrl)}`,
    },
    {
      name: 'توییتر / X',
      icon: Globe,
      color: 'bg-stone-900 dark:bg-stone-800 hover:bg-black text-white',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: 'فیس‌بوک (Facebook)',
      icon: Globe,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'ایمیل (Email)',
      icon: Mail,
      color: 'bg-stone-600 hover:bg-stone-700 text-white',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(currentUrl)}`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4 sm:py-6 relative">
      
      {/* BRAND CYAN CHECKMARK TOAST BADGE - TOP CENTERED */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] bg-[var(--card-bg)] border-2 border-[#1B889A] text-[#1B889A] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-extrabold animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-md whitespace-nowrap">
          <CheckCircle2 className="w-5 h-5 text-[#1B889A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* INTERACTIVE SOCIAL SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 no-print">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl modern-card">
            
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] font-serif-persian">
                    اشتراک‌گذاری مقاله در شبکه‌های اجتماعی
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">شبکه اجتماعی موردنظر جهت انتشار مقاله را انتخاب نمایید</p>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Social Sharing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3 rounded-2xl ${item.color} font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Direct Link Box */}
            <div className="pt-3 border-t border-[var(--card-border)] space-y-2">
              <span className="text-xs font-bold text-[var(--text-secondary)] block">کپی مستقیم آدرس لینک مقاله:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono text-[var(--text-secondary)] dir-ltr truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                  <span>کپی</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Back Button */}
      <Link
        href="/content"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#1B889A] hover:underline transition-colors no-print"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به آرشیو مقالات</span>
      </Link>

      {/* DEDICATED OFFICIAL PRINT HEADER (VERTICAL LINE-BY-LINE FORMATTING) */}
      <div className="hidden print:block mb-8 border-b-4 border-black pb-5 text-black font-serif-persian space-y-3">
        <div className="text-xs font-black text-stone-800 border-b border-gray-400 pb-2">
          مجله علمی - معنوی ایدئولوژی مهدویت | نسخه رسمی چاپی مقاله
        </div>
        
        {/* Line 1: Article Title */}
        <div>
          <span className="text-xs font-extrabold text-stone-700 block">عنوان مقاله:</span>
          <h1 className="text-2xl font-black text-black leading-relaxed mt-1">
            {article.title_fa}
          </h1>
        </div>

        {/* Line 2: Author Name & Title */}
        <div>
          <span className="text-xs font-extrabold text-stone-700 block">نویسنده و پژوهشگر:</span>
          <p className="text-base font-black text-black mt-0.5">
            {article.author_name_fa} {article.author_title_fa ? `(${article.author_title_fa})` : ''}
          </p>
        </div>

        {/* Line 3: Category & Date */}
        <div className="flex items-center justify-between text-xs font-black text-black pt-2 border-t border-gray-400">
          <span>دسته‌بندی: <strong className="font-black">{article.category_fa}</strong></span>
          <span>زمان مطالعه: <strong className="font-black">{article.read_time_fa}</strong></span>
          <span>تاریخ انتشار: <strong className="font-black">{article.published_at}</strong></span>
        </div>
      </div>

      {/* Article Header */}
      <header className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 modern-card printable-area">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3.5 py-1 rounded-full teal-badge text-xs font-bold">
            {article.category_fa}
          </span>

          {/* Reading Customization & Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[var(--bg-color)] p-1.5 rounded-2xl border border-[var(--card-border)] no-print">
            <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] px-1.5 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-[#1B889A]" />
              <span>قلم:</span>
            </span>
            <button
              onClick={() => setFontSize((s) => Math.max(s - 2, 14))}
              className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] hover:bg-[#1B889A]/10 text-xs text-[var(--text-primary)] font-bold border border-[var(--card-border)]"
              title="کوچک‌کردن قلم"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((s) => Math.min(s + 2, 26))}
              className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] hover:bg-[#1B889A]/10 text-xs text-[var(--text-primary)] font-bold border border-[var(--card-border)]"
              title="بزرگ‌کردن قلم"
            >
              A+
            </button>

            <div className="h-4 w-px bg-[var(--card-border)] mx-1" />

            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                isBookmarked ? 'text-[#1B889A] bg-[#1B889A]/15' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="نشان‌کردن و ذخیره مقاله"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#1B889A] transition-colors"
              title="چاپ و پرینت مقاله"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#1B889A] transition-colors"
              title="اشتراک‌گذاری در شبکه‌های اجتماعی"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-lg sm:text-3xl font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
          {article.title_fa}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#1B889A]" />
              <span>نویسنده: <strong className="text-[var(--text-primary)]">{article.author_name_fa}</strong> {article.author_title_fa && <span className="text-[#1B889A] font-semibold mr-1">({article.author_title_fa})</span>}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#1B889A]" />
              <span>زمان مطالعه: {article.read_time_fa}</span>
            </span>
          </div>

          <span>تاریخ انتشار: {article.published_at}</span>
        </div>
      </header>

      {/* Main Image Banner */}
      {article.image_url ? (
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[21/9] border border-[var(--card-border)] shadow-xl bg-stone-900 printable-area">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="w-full h-full object-cover"
            style={{ objectPosition: article.image_position || 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 no-print" />
        </div>
      ) : null}



      {/* Article Full Text Body */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-xl space-y-6 modern-card printable-area">
        <p className="text-[var(--text-primary)] font-bold leading-relaxed border-r-4 border-[#1B889A] pr-4 text-sm sm:text-base font-serif-persian">
          {article.excerpt_fa}
        </p>

        <div 
          className="text-[var(--text-primary)] font-serif-persian leading-loose whitespace-pre-line space-y-4"
          style={{ fontSize: `${fontSize}px` }}
        >
          {article.content_fa}
        </div>

        {/* KEYWORDS / TAGS SECTION */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-4 border-t border-[var(--card-border)] space-y-2">
            <span className="text-xs font-bold text-[var(--text-secondary)] block font-serif-persian">
              🏷️ کلمات کلیدی و تگ‌های مرتبط:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {article.tags.map((tag, idx) => {
                const clean = tag.replace(/^#/, '').trim();
                return (
                  <Link
                    key={idx}
                    href={`/?search=${encodeURIComponent(clean)}`}
                    className="px-3 py-1 rounded-full bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] hover:bg-[#1B889A] hover:text-white text-xs font-bold transition-all shadow-sm"
                    title={`جستجوی هشتگ ${clean} در صفحه اصلی`}
                  >
                    #{clean}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM ARTICLE ACTION BAR: SHARE & PRINT */}
        <div className="pt-6 mt-6 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>دسته: <strong className="text-[var(--text-primary)]">{article.category_fa}</strong></span>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleShareClick}
              className="px-4 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] text-[var(--text-primary)] font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1B889A]" />
              <span>اشتراک‌گذاری مقاله</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] text-[var(--text-primary)] font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-[#1B889A]" />
              <span>چاپ و پرینت مقاله</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
