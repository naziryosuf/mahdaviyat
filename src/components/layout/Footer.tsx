'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, Globe, ArrowLeft, Video, MessageCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/data/translations';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';

export const Footer: React.FC = () => {
  const { language } = useStore();
  const t = translations[language] || translations.fa;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--card-border)] text-[var(--text-secondary)] mt-24 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12 border-b border-[var(--card-border)]">
          
          {/* Col 1: Mission Statement & Kaaba Unity Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <KaabaUnityLogo size="sm" />
              <span className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
                {t.siteTitle}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed">
              {t.missionDesc}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#1B889A] font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>فارسی دری | پښتو | English</span>
            </div>
          </div>

          {/* Col 2: Journal Sections */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-r-2 border-[#1B889A] pr-2">
              لینک‌های سریع
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#1B889A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 text-stone-400" />
                  <span>صفحه اصلی</span>
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="hover:text-[#1B889A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 text-stone-400" />
                  <span>آرشیف مجله</span>
                </Link>
              </li>
              <li>
                <Link href="/content" className="hover:text-[#1B889A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 text-stone-400" />
                  <span>مقالات</span>
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:text-[#1B889A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 text-stone-400" />
                  <span>چندرسانه‌ای</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1B889A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 text-stone-400" />
                  <span>درباره ما</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#1B889A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3 text-stone-400" />
                  <span>ارتباط با ما</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Official Channels (Telegram, WhatsApp, YouTube) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-r-2 border-[#1B889A] pr-2">
              کانال‌های رسمی مجله
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://t.me/IdeologyMahdaviyat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] hover:text-[#1B889A] transition-all"
              >
                <Send className="w-4 h-4 text-[#1B889A]" />
                <div>
                  <span className="font-bold block text-[var(--text-primary)]">کانال تلگرام</span>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">@IdeologyMahdaviyat</span>
                </div>
              </a>

              <a
                href="https://www.youtube.com/@ideology-mahdivity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#A32838] hover:text-[#A32838] transition-all"
              >
                <Video className="w-4 h-4 text-[#A32838]" />
                <div>
                  <span className="font-bold block text-[var(--text-primary)]">کانال یوتیوب</span>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">@ideology-mahdivity</span>
                </div>
              </a>

              <a
                href="https://wa.me/4917689062903"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="font-bold block text-[var(--text-primary)]">واتساپ مستقیم دفتر</span>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">+49 176 89062903</span>
                </div>
              </a>
            </div>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-r-2 border-[#1B889A] pr-2">
              اشتراک در خبرنامه الکترونیک
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              جهت دریافت نسخه دیجیتال مجله و تازه‌ترین سرمقاله‌ها، ایمیل خود را وارد نمایید.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="آدرس ایمیل شما..."
                required
                className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A] transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-xs shadow-md shadow-[#1B889A]/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>عضویت در خبرنامه</span>
              </button>
            </form>

            {subscribed && (
              <div className="p-2.5 rounded-xl bg-[#1B889A]/15 border border-[#1B889A]/40 text-[#1B889A] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>ایمیل شما با موفقیت ثبت شد!</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>کد شناسایی رسمی: <strong>ISSN 2940-8812</strong></span>
            <span>ارتباط با تحریریه: <strong>ideology.mahdaviyat@gmail.com</strong></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
