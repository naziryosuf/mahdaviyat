'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  MessageCircle, 
  Send, 
  Globe, 
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!audio) return null;

  // Always use official live URL so WhatsApp crawlers can access Open Graph meta tags and cover image
  const shareUrl = `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(audio.id)}`;

  const whatsappMessage = `🎧 فایل صوتی: ${audio.title_fa}
گوینده: ${audio.speaker_fa || 'مجله ایدئولوژی مهدویت'}
مدت زمان: ${audio.duration_fa}

شنیدن آنلاین در مجله ایدئولوژی مهدویت:
${shareUrl}`;

  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa}\nگوینده: ${audio.speaker_fa || ''}`)}`;
  const eitaaHref = `https://eitaa.com/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎧 ${audio.title_fa}\nگوینده: ${audio.speaker_fa || ''}`)}`;

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

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200 animate-in fade-in no-print"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-4 sm:space-y-5 shadow-2xl modern-card relative animate-in zoom-in-95 fade-in slide-in-from-bottom-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-sm active:scale-95"
          title="بستن پنجره"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A] shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="text-right min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian truncate">
              اشتراک‌گذاری فایل صوتی
            </h3>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              ارسال همراه با تصویر کاور، عنوان و پخش آنلاین
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
                پیش‌نمایش کاور در واتساپ و شبکه‌های اجتماعی
              </div>
            </div>
          )}
          <div className="p-3.5 space-y-1.5 text-right">
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

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
            title="اشتراک‌گذاری در واتساپ با تصویر کاور و عنوان"
          >
            <MessageCircle className="w-4 h-4" />
            <span>ارسال در واتساپ</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
            title="اشتراک‌گذاری در تلگرام"
          >
            <Send className="w-4 h-4" />
            <span>ارسال در تلگرام</span>
          </a>

          {/* Eitaa */}
          <a
            href={eitaaHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#E85E26]/15 hover:bg-[#E85E26] text-[#E85E26] hover:text-white border border-[#E85E26]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
            title="اشتراک‌گذاری در پیام‌رسان ایتا"
          >
            <Globe className="w-4 h-4" />
            <span>ارسال در ایتا</span>
          </a>

          {/* Copy Direct Link */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1B889A]/15 hover:bg-[#1B889A] text-[#1B889A] hover:text-white border border-[#1B889A]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
            title="کپی لینک مستقیم فایل صوتی"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">لینک کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کپی لینک فایل</span>
              </>
            )}
          </button>
        </div>

        {/* Native Mobile Share (if supported) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--bg-color)] hover:bg-[#1B889A] text-[var(--text-primary)] hover:text-white border border-[var(--card-border)] hover:border-[#1B889A] font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>اشتراک‌گذاری با سایر برنامه‌های گوشی</span>
          </button>
        )}

        {/* Direct Link Input Box */}
        <div className="pt-2 border-t border-[var(--card-border)] flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono text-[var(--text-secondary)] dir-ltr truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
          >
            {copied ? 'کپی شد' : 'کپی'}
          </button>
        </div>
      </div>
    </div>
  );
}
