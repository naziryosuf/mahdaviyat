'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, 
  CheckCircle2, 
  Video, 
  Phone, 
  Mail, 
  ExternalLink,
  BookOpen,
  Newspaper,
  FileText,
  Layers,
  Info
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/data/translations';

export const Footer: React.FC = () => {
  const { language, designerName, designerWebsiteUrl, initFromStorage } = useStore();
  const t = translations[language] || translations.fa;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer aria-label="پای‌برگ وب‌سایت" className="bg-[var(--card-bg)] border-t border-[var(--card-border)] text-[var(--text-secondary)] mt-12 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
        
        {/* Quick Links, Contact Links & Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* 1. Quick Navigation Links Card */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-r-2 border-[#1B889A] pr-2.5 leading-tight">
                {t.quickLinks || 'دسترسی سریع'}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{t.home || 'صفحه اصلی'}</span>
              </Link>

              <Link
                href="/magazine"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Newspaper className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{t.magazine || 'آرشیف مجله'}</span>
              </Link>

              <Link
                href="/content"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{t.content || 'مقالات'}</span>
              </Link>

              <Link
                href="/media"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{t.media || 'چندرسانه‌ای'}</span>
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{t.about || 'درباره ما'}</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{t.contact || 'ارتباط با ما'}</span>
              </Link>
            </div>
          </div>

          {/* 2. Official Social & Contact Card */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-r-2 border-[#1B889A] pr-2.5 leading-tight">
                {t.contact}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <a
                href="https://www.youtube.com/@ideology-mahdaviyat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold block text-[var(--text-primary)] text-xs">کانال یوتیوب</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono truncate block">@ideology-mahdaviyat</span>
                </div>
              </a>

              <a
                href="https://wa.me/4917689062903"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold block text-[var(--text-primary)] text-xs">واتساپ مستقیم</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono dir-ltr text-right truncate block">+49 176 89062903</span>
                </div>
              </a>

              <a
                href="https://t.me/IdeologyMahdaviyat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold block text-[var(--text-primary)] text-xs">کانال تلگرام</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono truncate block">@IdeologyMahdaviyat</span>
                </div>
              </a>

              <a
                href="mailto:ideology.mahdaviyat@gmail.com"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all shadow-sm group min-w-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold block text-[var(--text-primary)] text-xs">ایمیل رسمی</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono truncate block">ideology.mahdaviyat@...</span>
                </div>
              </a>
            </div>
          </div>

          {/* 3. Newsletter Subscription Box */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-r-2 border-[#1B889A] pr-2.5 leading-tight">
                اشتراک در خبرنامه الکترونیک
              </h4>
            </div>

            <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                جهت دریافت نسخه دیجیتال مجله و تازه‌ترین سرمقاله‌ها، ایمیل خود را وارد نمایید:
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="آدرس ایمیل شما..."
                  required
                  aria-label="آدرس ایمیل خبرنامه"
                  className="w-full min-w-0 px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A] font-mono"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>عضویت</span>
                </button>
              </form>

              {subscribed && (
                <div className="p-2 rounded-xl bg-[#1B889A]/15 border border-[#1B889A]/40 text-[#1B889A] text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>ایمیل شما با موفقیت ثبت شد!</span>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="pt-3 border-t border-[var(--card-border)] text-center space-y-1">
          <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-serif-persian">{t.copyright}</p>
          <div className="text-[10px] sm:text-[11px] text-stone-400 font-mono tracking-wider dir-ltr flex items-center justify-center gap-1.5 flex-wrap">
            <span>design by</span>
            {designerWebsiteUrl && designerWebsiteUrl.trim() !== '' ? (
              <a
                href={designerWebsiteUrl.startsWith('http') ? designerWebsiteUrl : `https://${designerWebsiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#1B889A] hover:text-[#156d7b] font-bold hover:underline transition-all"
                title="وب‌سایت شخصی طراح"
              >
                <span>{designerName || 'M. Nazir Yosufi'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : (
              <span className="text-[#1B889A] font-bold">{designerName || 'M. Nazir Yosufi'}</span>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
