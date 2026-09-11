'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { AudioItem } from '@/types';

interface AudioShareModalProps {
  audio: AudioItem | null;
  onClose: () => void;
}

export function AudioShareModal({ audio, onClose }: AudioShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle escape key when modal is open
  useEffect(() => {
    if (!audio) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [audio, onClose]);

  if (!mounted || !audio) return null;

  // Always use official live URL so social crawlers (WhatsApp, Twitter, Facebook) can access Open Graph meta tags and cover image
  const shareUrl = `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(audio.id)}`;

  const whatsappMessage = `🎧 فایل صوتی: ${audio.title_fa}
گوینده: ${audio.speaker_fa || 'مجله ایدئولوژی مهدویت'}
مدت زمان: ${audio.duration_fa}

شنیدن آنلاین در مجله ایدئولوژی مهدویت:
${shareUrl}`;

  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa}\nگوینده: ${audio.speaker_fa || ''}`)}`;
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa} - مجله ایدئولوژی مهدویت`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: audio.title_fa,
          text: `🎧 ${audio.title_fa} - ${audio.speaker_fa || ''}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto no-print"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl modern-card relative my-auto animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-sm active:scale-95 z-10"
          title="بستن پنجره"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-3 pl-10">
          <div className="w-10 h-10 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A] shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="text-right min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian truncate">
              اشتراک‌گذاری فایل صوتی
            </h3>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              ارسال همراه با تصویر کاور و پخش آنلاین
            </p>
          </div>
        </div>

        {/* Audio Card Preview */}
        <div className="bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
          {audio.cover_image && !audio.cover_image.startsWith('file://') && audio.cover_image.trim() !== '' && (
            <div className="w-full aspect-[16/9] relative bg-slate-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={audio.cover_image}
                alt={audio.title_fa}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-bold">
                پیش‌نمایش در شبکه‌های اجتماعی
              </div>
            </div>
          )}
          <div className="p-3 space-y-1 text-right">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#1B889A] font-bold">
                مجله ایدئولوژی مهدویت • {audio.category_fa || 'محتوای صوتی'}
              </span>
              <span className="text-[var(--text-secondary)] font-bold">
                مدت: {audio.duration_fa}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
              {audio.title_fa}
            </h4>
            {audio.speaker_fa && (
              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                گوینده / سخنران: {audio.speaker_fa}
              </p>
            )}
          </div>
        </div>

        {/* Social Share Grid (WhatsApp, Telegram, Twitter/X, Facebook) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs shadow-xs transition-all active:scale-95"
            title="اشتراک‌گذاری در واتساپ"
          >
            <MessageCircle className="w-4 h-4" />
            <span>واتساپ</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/30 font-bold text-xs shadow-xs transition-all active:scale-95"
            title="اشتراک‌گذاری در تلگرام"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span>تلگرام</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={twitterHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-neutral-900/10 dark:bg-white/10 hover:bg-black dark:hover:bg-white text-[var(--text-primary)] hover:text-white dark:hover:text-black border border-[var(--card-border)] font-bold text-xs shadow-xs transition-all active:scale-95"
            title="اشتراک‌گذاری در ایکس (توییتر)"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>ایکس (توییتر)</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 font-bold text-xs shadow-xs transition-all active:scale-95"
            title="اشتراک‌گذاری در فیسبوک"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>فیسبوک</span>
          </a>
        </div>

        {/* Native Mobile Share (if supported) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-[var(--bg-color)] hover:bg-[#1B889A] text-[var(--text-primary)] hover:text-white border border-[var(--card-border)] hover:border-[#1B889A] font-bold text-xs transition-all shadow-xs active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>اشتراک‌گذاری در سایر برنامه‌های گوشی</span>
          </button>
        )}

        {/* Direct Link Input Box & Copy */}
        <div className="pt-2 border-t border-[var(--card-border)] flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono text-[var(--text-secondary)] dir-ltr truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shrink-0 transition-colors shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کپی لینک</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

