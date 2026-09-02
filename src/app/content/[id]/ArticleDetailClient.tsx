'use client';

import React, { useState } from 'react';
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
  Globe, 
  UserCheck, 
  Award, 
  BookMarked, 
  FileText, 
  Volume2, 
  Video 
} from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';
import { Article, TeamMember } from '@/types';

interface ArticleDetailClientProps {
  id: string;
  initialArticle?: Article | null;
}

export function ArticleDetailClient({ id, initialArticle }: ArticleDetailClientProps) {
  const { articles, teamMembers, audios, videos, bookmarkedArticles, toggleBookmark, playAudio, currentAudio, isPlayingAudio, pauseAudio } = useStore();
  const [fontSize, setFontSize] = useState<number>(17); // optimal mobile/desktop reading font size
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [selectedAuthorMember, setSelectedAuthorMember] = useState<TeamMember | null>(null);

  const article = articles.find((a) => a.id === id || a.slug === id) || initialArticle || (articles.length > 0 ? articles[0] : null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleNativeShare = async () => {
    if (!article) return;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.ideologymahdaviyat.org/content/${article.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: article.title_fa,
          text: `${article.title_fa}\n\n${article.excerpt_fa || ''}\n\nمجله مستقل فکری-شناختی ایدئولوژی مهدویت\n`,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // user cancelled or failed
      }
    }
    handleCopyLink();
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

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <div className="w-14 h-14 border-4 border-[#1B889A] border-t-transparent rounded-full animate-spin mx-auto shadow-lg" />
        <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
          در حال دریافت اطلاعات مقاله...
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">لطفاً چند لحظه منتظر بمانید</p>
        <div className="pt-2">
          <Link href="/content" className="px-5 py-2.5 rounded-xl bg-[#1B889A] text-white font-bold text-xs shadow-md inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به آرشیف مقالات</span>
          </Link>
        </div>
      </div>
    );
  }

  const authorName = article.author_name_fa || '';
  const authorMember = teamMembers.find((m) => {
    if (!m?.name_fa || !authorName) return false;
    const mName = m.name_fa.toLowerCase().trim();
    const aName = authorName.toLowerCase().trim();
    return mName.includes(aName) || aName.includes(mName);
  });

  const isBookmarked = bookmarkedArticles.includes(article.id);
  const isPlayingThisAudio = currentAudio?.id === article.id && isPlayingAudio;

  const hasAudio = Boolean(article.audio_url && article.audio_url.trim().length > 0);
  const isYouTubeAudio = hasAudio && (article.audio_url?.includes('youtube.com') || article.audio_url?.includes('youtu.be'));
  const videoEmbedInfo = hasAudio && article.audio_url ? parseVideoUrl(article.audio_url) : null;

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
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://www.ideologymahdaviyat.org/content/${article.id}`;
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

      {/* INTERACTIVE SOCIAL SHARE MODAL WITH COVER PREVIEW */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 no-print"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl modern-card relative animate-in zoom-in-95 fade-in slide-in-from-bottom-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 left-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-sm active:scale-95"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A] shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h3 className="text-base font-extrabold text-[var(--text-primary)] font-serif-persian">
                  اشتراک‌گذاری این مقاله
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">ارسال همراه با تصویر کاور و عنوان کامل در واتساپ و تلگرام</p>
              </div>
            </div>

            {/* Article Card Preview (Cover image + Title + Excerpt) */}
            <div className="bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
              {article.image_url && (
                <div className="w-full aspect-[16/9] relative bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image_url}
                    alt={article.title_fa}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-bold">
                    پیش‌نمایش کاور در واتساپ و تلگرام
                  </div>
                </div>
              )}
              <div className="p-3.5 space-y-1 text-right">
                <span className="text-[10px] text-[#1B889A] font-bold block">
                  مجله مستقل فکری-شناختی ایدئولوژی مهدویت
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-serif-persian line-clamp-2">
                  {article.title_fa}
                </h4>
                {article.excerpt_fa && (
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {article.excerpt_fa}
                  </p>
                )}
              </div>
            </div>

            {/* Social Sharing Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${article.title_fa}\n\n${article.excerpt_fa ? article.excerpt_fa + '\n\n' : ''}مطالعه در مجله ایدئولوژی مهدویت:\n${currentUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ارسال در واتساپ</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title_fa)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>ارسال در تلگرام</span>
              </a>

              {/* Eitaa */}
              <a
                href={`https://eitaa.com/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title_fa)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#E85E26]/15 hover:bg-[#E85E26] text-[#E85E26] hover:text-white border border-[#E85E26]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Globe className="w-4 h-4" />
                <span>ارسال در ایتا</span>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1B889A]/15 hover:bg-[#1B889A] text-[#1B889A] hover:text-white border border-[#1B889A]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>کپی لینک مستقیم</span>
              </button>
            </div>

            {/* Native Mobile Share if supported */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--bg-color)] hover:bg-[#1B889A] text-[var(--text-primary)] hover:text-white border border-[var(--card-border)] hover:border-[#1B889A] font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>اشتراک‌گذاری با سایر برنامه‌های گوشی</span>
              </button>
            )}

            {/* Direct Link Input */}
            <div className="pt-2 border-t border-[var(--card-border)] flex items-center gap-2">
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
      )}

      {/* Back Button */}
      <Link
        href="/content"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#1B889A] hover:underline transition-colors no-print"
      >
        <ArrowRight className="w-4 h-4" />
        <span>بازگشت به آرشیف مقالات</span>
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
            <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] px-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-[#1B889A]" />
              <span>قلم:</span>
            </span>

            <div className="flex items-center gap-1 bg-[var(--card-bg)] p-0.5 rounded-xl border border-[var(--card-border)]">
              <button
                onClick={() => setFontSize((s) => Math.max(s - 1, 12))}
                className="px-2 py-1 rounded-lg hover:bg-[#1B889A]/15 text-xs text-[var(--text-primary)] hover:text-[#1B889A] font-bold transition-all active:scale-90"
                title="کوچک‌کردن قلم (-A)"
                aria-label="کوچک‌کردن قلم"
              >
                -A
              </button>

              <span 
                onClick={() => setFontSize(17)}
                className="px-1.5 py-0.5 rounded-md bg-[#1B889A]/15 text-[#1B889A] font-mono text-[11px] sm:text-xs font-black min-w-[28px] text-center select-none cursor-pointer hover:bg-[#1B889A]/25 transition-colors"
                title="سایز فعلی قلم (کلیک برای بازنشانی)"
              >
                {fontSize}
              </span>

              <button
                onClick={() => setFontSize((s) => Math.min(s + 1, 32))}
                className="px-2 py-1 rounded-lg hover:bg-[#1B889A]/15 text-xs text-[var(--text-primary)] hover:text-[#1B889A] font-bold transition-all active:scale-90"
                title="بزرگ‌کردن قلم (+A)"
                aria-label="بزرگ‌کردن قلم"
              >
                +A
              </button>
            </div>

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
            <div
              onClick={() => setSelectedAuthorMember(authorMember || {
                id: 'author_temp',
                name_fa: article.author_name_fa,
                role_fa: article.author_title_fa || 'پژوهشگر / نویسنده',
                bio_fa: `نویسنده و پژوهشگر مقاله‌های علمی - شناختی مجله ایدئولوژی مهدویت.\nعنوان مقاله: ${article.title_fa}`,
                avatar_url: article.author_avatar || '',
                specialization_fa: article.category_fa || 'نویسنده'
              })}
              className="flex items-center gap-2 cursor-pointer group hover:bg-[#1B889A]/10 px-2.5 py-1 rounded-xl transition-all border border-transparent hover:border-[#1B889A]/30"
              title="مشاهده پروفایل و بیوگرافی نویسنده"
            >
              {authorMember?.avatar_url && !authorMember.avatar_url.includes('unsplash.com') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={authorMember.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover border border-[#1B889A] shrink-0 group-hover:scale-110 transition-transform" />
              ) : article.author_avatar && !article.author_avatar.includes('unsplash.com') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.author_avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-[#1B889A] shrink-0 group-hover:scale-110 transition-transform" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#1B889A] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {article.author_name_fa ? article.author_name_fa.trim().charAt(0) : 'ن'}
                </div>
              )}
              <span className="text-xs">
                نویسنده: <strong className="text-[var(--text-primary)] group-hover:text-[#1B889A] underline decoration-dotted font-bold">@{article.author_name_fa}</strong> {article.author_title_fa && <span className="text-[#1B889A] font-semibold mr-1">({article.author_title_fa})</span>}
              </span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#1B889A]" />
              <span>زمان مطالعه: {article.read_time_fa}</span>
            </span>
          </div>

          <span>تاریخ انتشار: {article.published_at}</span>
        </div>
      </header>

      {/* Main Image Banner (Responsive 16:9 Aspect Ratio) */}
      {article.image_url ? (
        <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center printable-area">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt={article.title_fa}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 no-print" />
        </div>
      ) : null}

      {/* Article Full Text Body */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-xl space-y-6 modern-card printable-area">
        {article.excerpt_fa && (
          <p className="text-[var(--text-primary)] font-bold leading-relaxed border-r-4 border-[#1B889A] pr-4 text-sm sm:text-base font-serif-persian">
            {article.excerpt_fa}
          </p>
        )}

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

      {/* Author Lightbox Profile Modal */}
      {selectedAuthorMember && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in no-print">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl modern-card relative transition-all duration-300 animate-in zoom-in-95 fade-in slide-in-from-bottom-4">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedAuthorMember(null)}
              className="absolute top-5 left-5 p-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-md active:scale-95"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header Box */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[var(--card-border)] pb-6 text-center sm:text-right">
              {/* CIRCULAR ROUNDED PROFILE IMAGE */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#1B889A] shrink-0 shadow-2xl ring-4 ring-[#1B889A]/20">
                {selectedAuthorMember.avatar_url && !selectedAuthorMember.avatar_url.includes('unsplash.com') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={selectedAuthorMember.avatar_url} 
                    alt={selectedAuthorMember.name_fa} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#1B889A] text-white flex items-center justify-center font-extrabold text-4xl font-serif-persian">
                    {selectedAuthorMember.name_fa ? selectedAuthorMember.name_fa.trim().charAt(0) : 'ن'}
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                    {selectedAuthorMember.name_fa}
                  </h3>
                  <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                    {selectedAuthorMember.role_fa}
                  </span>
                </div>
                
                {selectedAuthorMember.specialization_fa && (
                  <p className="text-xs sm:text-sm text-[#1B889A] font-bold flex items-center justify-center sm:justify-start gap-1.5 font-serif-persian">
                    <Award className="w-4 h-4 text-[#1B889A]" />
                    <span>تخصص: {selectedAuthorMember.specialization_fa}</span>
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold">
                  <Link
                    href={`/about?author=${encodeURIComponent(selectedAuthorMember.name_fa)}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>پروفایل کامل و تمام آثار در «درباره ما» ↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Detailed Biography Box */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1B889A]" />
                <span>بیوگرافی و معرفی جامع</span>
              </h4>
              <div className="bg-[var(--bg-color)] p-5 sm:p-6 rounded-2xl border border-[var(--card-border)] space-y-3 shadow-inner">
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-loose font-serif-persian whitespace-pre-line tracking-wide leading-relaxed">
                  {selectedAuthorMember.bio_fa}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
