'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FlipBookViewer } from '@/components/magazine/FlipBookViewer';
import { useStore } from '@/store/useStore';
import { MagazineIssue } from '@/types';
import { 
  Newspaper, 
  Download, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ArrowLeft,
  Tag,
  Search,
  X
} from 'lucide-react';
import { translations } from '@/data/translations';

export default function MagazinePage() {
  const { magazineIssues, language } = useStore();
  const t = translations[language] || translations.fa;

  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const getTocForIssue = (issueNumber: number) => {
    if (issueNumber === 1) {
      return [
        { title: 'چرا ایدئولوژی مهدویت؟ (یادداشت سردبیر)', author: 'میر الهام الدین سادات', page: 4 },
        { title: 'رهبریت در اسلام؛ اصول، مبانی و مسئولیت‌ها', author: 'استاد عبدالظهور مدبر', page: 7 },
        { title: 'داشتن رهبری سلیم پس از توحید بزرگترین نعمت خداست', author: 'دکتر حبیب الله شریفی', page: 13 },
        { title: 'اخوت اسلامی و وحدت امت؛ مشکلات و راه حل', author: 'بیژن بهزاد', page: 15 },
        { title: 'اتصال به اصل؛ اصلِ نامیده شده‌ی ما چیست؟', author: 'محمد شهیر شریفی', page: 18 },
        { title: 'روشنگری چیست و روشنگر کیست؟', author: 'احسان الله عتیق', page: 22 },
        { title: 'معیت خدای متعال با انسان', author: 'زکریا رحیمی', page: 25 },
        { title: 'تفسیر کاربردی آیه: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', author: 'دکتر سید دستغیب صائب', page: 31 },
        { title: 'محیط زیست و تدابیر بهبود آن از منظر اسلام', author: 'تحقیق اختصاصی مجله', page: 37 },
      ];
    } else if (issueNumber === 2) {
      return [
        { title: 'راهکارهای علمی وحدت امت اسلامی', author: 'دکتر بیژن بهزاد', page: 4 },
        { title: 'نقد فرقه گرایی و تعصبات مادی', author: 'استاد عبدالظهور مدبر', page: 10 },
        { title: 'مبانی رشد اخلاقی در جامعه موعود', author: 'میر الهام الدین سادات', page: 18 },
        { title: 'تحلیل شناختی آرمان‌های مهدویت', author: 'دکتر حبیب الله شریفی', page: 26 },
      ];
    } else {
      return [
        { title: 'تبیین حقوق عامه در حکومت مهدوی', author: 'میر الهام الدین سادات', page: 4 },
        { title: 'نقد اومانیسم غربی و بحران معنویت', author: 'استاد عبدالظهور مدبر', page: 12 },
        { title: 'بازخوانی جایگاه انسان در هندسه آفرینش', author: 'زکریا رحیمی', page: 22 },
      ];
    }
  };

  // Filter magazine issues by selected hashtag
  const filteredIssues = magazineIssues.filter(issue => {
    if (!selectedTag) return true;
    const cleanTag = selectedTag.replace('#', '').toLowerCase();
    return (
      issue.tags?.some(t => t.toLowerCase().includes(cleanTag)) ||
      issue.title_fa.toLowerCase().includes(cleanTag) ||
      issue.description_fa.toLowerCase().includes(cleanTag)
    );
  });

  return (
    <div className="space-y-12 py-6">
      
      {/* Dynamic View */}
      {selectedIssue ? (
        <div className="space-y-6">
          <FlipBookViewer issue={selectedIssue} onBackToCatalog={() => setSelectedIssue(null)} />
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Header Banner */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 sm:p-12 text-center space-y-3 modern-card shadow-lg">
            <h1 className="text-xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
              فهرست و آرشیف کامل شماره‌های مجله ایدئولوژی مهدویت
            </h1>
            
            <p className="text-xs sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-serif-persian">
              فهرست شماره‌های نشر شده مجله برای مطالعه آنلاین و دانلود مستقیم فایل PDF.
            </p>
          </div>

          {/* ACTIVE HASHTAG SEARCH FILTER NOTIFICATION BAR */}
          {selectedTag && (
            <div className="bg-[#1B889A]/15 border-2 border-[#1B889A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                <Tag className="w-4 h-4 text-[#1B889A]" />
                <span>فیلتر فعال هشتگ:</span>
                <span className="px-2.5 py-1 rounded-full bg-[#1B889A] text-white font-mono">{selectedTag}</span>
                <span className="text-[var(--text-secondary)]">({filteredIssues.length} شماره مجله یافت شد)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>پاک‌سازی فیلتر</span>
                </button>
              </div>
            </div>
          )}

          {/* Catalog List of Magazine Issues */}
          <div className="space-y-8">
            {filteredIssues.length === 0 ? (
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center space-y-4 modern-card">
                <Newspaper className="w-12 h-12 text-[#1B889A] mx-auto opacity-70" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
                  {selectedTag ? `هیچ مجله‌ای با هشتگ ${selectedTag} یافت نشد` : 'هنوز شماره‌ای از مجله ثبت نگردیده است'}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  {selectedTag ? 'می‌توانید فیلتر هشتگ را لغو کنید تا همه شماره‌های مجله را مشاهده نمایید.' : 'می‌توانید با ورود به پنل مدیریت، اولین شماره مجله را آپلود و منتشر نمایید.'}
                </p>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="px-4 py-2 rounded-xl bg-[#1B889A] text-white font-bold text-xs"
                  >
                    نمایش همه مجله‌ها
                  </button>
                )}
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const toc = getTocForIssue(issue.issue_number);
                return (
                  <div
                    key={issue.id}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 sm:p-10 modern-card shadow-xl space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* 1. بخش تصویر مجله به همراه هشتگ‌های روی کاور */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-[#1B889A]/30 aspect-[16/9] sm:aspect-[3/4] max-w-sm mx-auto w-full bg-stone-900 shadow-2xl group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={issue.cover_image}
                            alt={issue.title_fa}
                            className={`w-full h-full object-${issue.cover_position || 'cover'} group-hover:scale-105 transition-transform duration-500`}
                          />

                          {/* HASHTAGS OVERLAY ON COVER IMAGE */}
                          {issue.tags && issue.tags.length > 0 && (
                            <div className="absolute bottom-3 right-3 left-3 flex flex-wrap gap-1.5 z-10 dir-rtl">
                              {issue.tags.map((tag, tIdx) => (
                                <button
                                  key={tIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTag(tag);
                                  }}
                                  className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-extrabold shadow-lg hover:bg-[#1B889A] hover:border-[#1B889A] transition-all active:scale-95 flex items-center gap-1"
                                >
                                  <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. مشخصات و فهرست مطالب مجله */}
                      <div className="lg:col-span-7 space-y-5">
                        
                        {/* بج و مشخصات دسکتاپ */}
                        <div className="hidden sm:flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--card-border)]">
                          <span className="px-3.5 py-1 rounded-full teal-badge text-xs font-extrabold shadow-sm">
                            شماره {issue.issue_number} - {issue.publish_date_fa}
                          </span>
                          {issue.author_name_fa && (
                            <span className="text-xs font-bold text-[#1B889A] bg-[#1B889A]/10 px-3 py-1 rounded-full">
                              نویسنده: {issue.author_name_fa} {issue.author_title_fa ? `(${issue.author_title_fa})` : ''}
                            </span>
                          )}
                          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1 font-bold">
                              <FileText className="w-4 h-4 text-[#1B889A]" />
                              صفحات A4 استاندارد
                            </span>
                          </div>
                        </div>

                        {/* عنوان و توضیحات اصلی مجله */}
                        <div className="space-y-2">
                          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                            {issue.title_fa}
                          </h2>
                          {issue.author_name_fa && (
                            <p className="text-xs font-bold text-[#1B889A] sm:hidden">
                              نویسنده: {issue.author_name_fa} {issue.author_title_fa ? `(${issue.author_title_fa})` : ''}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-serif-persian">
                            {issue.description_fa}
                          </p>

                          {/* HASHTAGS SECTION AT THE END OF BOTTOM DESCRIPTION */}
                          {issue.tags && issue.tags.length > 0 && (
                            <div className="pt-3 border-t border-[var(--card-border)] flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1 font-serif-persian">
                                <Tag className="w-3.5 h-3.5 text-[#1B889A]" />
                                کلمات کلیدی و هشتگ‌ها:
                              </span>
                              {issue.tags.map((tag, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedTag(tag)}
                                  className="px-3 py-1 rounded-full bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-mono text-xs font-extrabold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                                >
                                  <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                                  <Search className="w-3 h-3 opacity-60" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 3. باکس شیک فهرست گزیده عناوین مجله (TOC) */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] space-y-3">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-[var(--text-primary)] font-serif-persian border-b border-[var(--card-border)] pb-2">
                            <Sparkles className="w-4 h-4 text-[#1B889A]" />
                            <span>عناوین و مقالات شامل شده در این شماره:</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {toc.slice(0, 6).map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-[var(--card-bg)] transition-colors">
                                <span className="text-[var(--text-primary)] truncate font-serif-persian">
                                  • {item.title}
                                </span>
                                <span className="text-[#1B889A] font-mono shrink-0 font-bold text-[11px]">ص {item.page}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. دو آپشن اصلی: ۱. مطالعه آنلاین ۲. دانلود مجله */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                          
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-[#1B889A]/30 active:scale-95"
                          >
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>مطالعه آنلاین</span>
                          </button>

                          <a
                            href={issue.pdf_url || '/magazines/issue-1-mahdaviyat.pdf'}
                            download={`مجله_ایدئولوژی_مهدویت_شماره_${issue.issue_number}.pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[var(--bg-color)] hover:bg-[var(--muted-bg)] text-[var(--text-primary)] border border-[var(--card-border)] font-bold text-xs sm:text-sm transition-all active:scale-95"
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B889A]" />
                            <span>دانلود مجله (PDF)</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
