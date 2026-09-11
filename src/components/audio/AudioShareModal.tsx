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
import { formatDurationNumeric } from '@/lib/audioUtils';

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

  // Strict page scroll lock & event trap while modal is open
  useEffect(() => {
    if (!audio) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouch = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.share-modal-dialog')) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.share-modal-dialog')) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouch;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [audio, onClose]);

  if (!mounted || !audio) return null;

  // Always use official live URL so WhatsApp, Twitter, Facebook, Eitaa crawlers get Open Graph meta and cover preview
  const shareUrl = `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(audio.id)}`;

  const whatsappMessage = `🎧 فایل صوتی: ${audio.title_fa}
گوینده: ${audio.speaker_fa || 'مجله ایدئولوژی مهدویت'}
مدت زمان: ${audio.duration_fa || formatDurationNumeric(audio.duration_fa)}

شنیدن آنلاین در مجله ایدئولوژی مهدویت:
${shareUrl}`;

  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa}\nگوینده: ${audio.speaker_fa || ''}`)}`;
  const eitaaHref = `https://eitaa.com/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa} - گوینده: ${audio.speaker_fa || ''}`)}`;
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa} - مجله ایدئولوژی مهدویت`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
        // User dismissed share
      }
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center p-3 sm:p-4 no-print select-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        zIndex: 99999999,
        backgroundColor: 'rgba(0, 0, 0, 0.70)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      {/* Compact Dialog Box */}
      <div 
        className="share-modal-dialog bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-2xl p-4 sm:p-5 max-w-[380px] w-full space-y-3.5 shadow-2xl relative my-auto animate-in zoom-in-95 fade-in duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1B889A]/15 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A] shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[var(--text-primary)] font-serif-persian leading-none">
                اشتراک‌گذاری فایل صوتی
              </h3>
              <span className="text-[10px] text-[var(--text-secondary)]">ارسال همراه با عنوان و پیش‌نمایش کاور</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-xs active:scale-95"
            title="بستن پنجره"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ultra-compact Audio Preview Card */}
        <div className="p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#1B889A]/30 shrink-0 bg-slate-900 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={audio.cover_image && !audio.cover_image.startsWith('file://') && audio.cover_image.trim() !== '' ? audio.cover_image : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
              alt={audio.title_fa}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5 text-right">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#1B889A] font-bold truncate">{audio.category_fa || 'محتوای صوتی'}</span>
              <span className="text-[var(--text-secondary)] font-mono dir-ltr shrink-0 font-bold">{formatDurationNumeric(audio.duration_fa)}</span>
            </div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] font-serif-persian line-clamp-1 leading-snug">
              {audio.title_fa}
            </h4>
            {audio.speaker_fa && (
              <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1">
                گوینده: {audio.speaker_fa}
              </p>
            )}
          </div>
        </div>

        {/* Social Share Grid (WhatsApp, Telegram, Eitaa, X/Twitter, Facebook) */}
        <div className="grid grid-cols-2 gap-2">
          {/* WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs shadow-2xs transition-all active:scale-95"
            title="اشتراک‌گذاری در واتساپ"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>واتساپ</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/30 font-bold text-xs shadow-2xs transition-all active:scale-95"
            title="اشتراک‌گذاری در تلگرام"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span>تلگرام</span>
          </a>

          {/* Eitaa */}
          <a
            href={eitaaHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#E85E26]/15 hover:bg-[#E85E26] text-[#E85E26] hover:text-white border border-[#E85E26]/30 font-bold text-xs shadow-2xs transition-all active:scale-95"
            title="اشتراک‌گذاری در ایتا"
          >
            <span className="font-extrabold text-[11px]">e</span>
            <span>ایتا</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={twitterHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-900/10 dark:bg-white/10 hover:bg-black dark:hover:bg-white text-[var(--text-primary)] hover:text-white dark:hover:text-black border border-[var(--card-border)] font-bold text-xs shadow-2xs transition-all active:scale-95"
            title="اشتراک‌گذاری در توییتر (ایکس)"
          >
            <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>ایکس</span>
          </a>
        </div>

        {/* Native Mobile Share (if supported) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--bg-color)] hover:bg-[#1B889A] text-[var(--text-primary)] hover:text-white border border-[var(--card-border)] hover:border-[#1B889A] font-bold text-xs transition-all shadow-2xs active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>اشتراک‌گذاری در سایر برنامه‌های گوشی</span>
          </button>
        )}

        {/* Direct Link Input Box & Copy */}
        <div className="pt-2 border-t border-[var(--card-border)] flex items-center gap-1.5">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full py-1.5 px-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-lg text-[11px] font-mono text-[var(--text-secondary)] dir-ltr truncate select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shrink-0 transition-colors shadow-xs flex items-center gap-1 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>کپی</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

