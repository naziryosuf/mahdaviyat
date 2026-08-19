'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  X,
  BookMarked
} from 'lucide-react';
import { translations } from '@/data/translations';

function MagazineContentInner() {
  const { magazineIssues, language } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = translations[language] || translations.fa;

  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const read = searchParams.get('read');
    const download = searchParams.get('download');
    const issueId = searchParams.get('issue');

    if (magazineIssues.length > 0) {
      // Sort issues by issue_number descending to always target the latest issue
      const sortedIssues = [...magazineIssues].sort((a, b) => (b.issue_number || 0) - (a.issue_number || 0));
      const latestIssue = sortedIssues[0];

      if (read || issueId) {
        const found = issueId 
          ? magazineIssues.find(i => i.id === issueId || String(i.issue_number) === issueId) 
          : latestIssue;
        if (found) {
          setSelectedIssue(found);
        }
      }

      if (download) {
        const targetIssue = issueId
          ? magazineIssues.find(i => i.id === issueId || String(i.issue_number) === issueId) || latestIssue
          : latestIssue;

        if (targetIssue) {
          const pdfUrl = targetIssue.pdf_url || '/downloads/mahdism_issue_1.pdf';
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `مجله_ایدئولوژی_مهدویت_شماره_${targetIssue.issue_number || 1}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  }, [searchParams, magazineIssues]);

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

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/content?search=${encodeURIComponent(selectedTag.replace('#', ''))}`}
                  className="px-3 py-1.5 rounded-xl bg-[#1B889A] text-white hover:bg-[#156d7b] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>جستجو در کل مقالات سایت</span>
                </Link>

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
                const coverImageSrc = issue.cover_image && issue.cover_image.trim() !== '' 
                  ? issue.cover_image 
                  : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={issue.id}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 sm:p-10 modern-card shadow-xl space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* 1. بخش تصویر مجله (کلیک روی عکس مطالعه آنلاین را باز می‌کند) */}
                      <div className="lg:col-span-5 space-y-3">
                        <div 
                          onClick={() => setSelectedIssue(issue)}
                          className="relative w-full aspect-video overflow-hidden rounded-xl border-2 border-[#1B889A]/30 hover:border-[#1B889A] max-w-sm mx-auto bg-stone-900 shadow-2xl group cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center"
                          title="برای مطالعه آنلاین مجله کلیک نمایید"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coverImageSrc}
                            alt={issue.title_fa}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-4 py-2 rounded-xl bg-[#1B889A] text-white font-extrabold text-xs shadow-lg flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span>مطالعه آنلاین مجله</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2. مشخصات و توضیحات جامع مجله (بخش اختصاصی وسیع) */}
                      <div className="lg:col-span-7 space-y-6">
                        
                        {/* بج و مشخصات بالایی: شماره، تاریخ انتشار و تعداد صفحات */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--card-border)]">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3.5 py-1 rounded-full teal-badge text-xs font-extrabold shadow-sm">
                              شماره {issue.issue_number} - {issue.publish_date_fa}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-[#1B889A]/15 border border-[#1B889A]/30 text-[#1B889A] text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                              <BookMarked className="w-3.5 h-3.5 text-[#1B889A]" />
                              <span>{issue.page_count_fa || '۴۵ صفحه (قطع A4)'}</span>
                            </span>
                          </div>
                        </div>

                        {/* عنوان مجله (کلیک روی عنوان نیز مطالعه آنلاین را باز می‌کند) */}
                        <h2 
                          onClick={() => setSelectedIssue(issue)}
                          className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug cursor-pointer hover:text-[#1B889A] transition-colors"
                        >
                          {issue.title_fa}
                        </h2>

                        {/* بخش توضیحات جامع و وسیع با فضای کافی */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] space-y-2 shadow-inner">
                          <span className="block text-xs font-bold text-[#1B889A] font-serif-persian">خلاصه و توضیحات شماره مجله:</span>
                          <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-serif-persian whitespace-pre-line">
                            {issue.description_fa}
                          </p>
                        </div>

                        {/* کلمات کلیدی و هشتگ‌ها در انتهای بخش توضیحات */}
                        {issue.tags && issue.tags.length > 0 && (
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1 font-serif-persian">
                              <Tag className="w-3.5 h-3.5 text-[#1B889A]" />
                              کلمات کلیدی و هشتگ‌ها:
                            </span>
                            {issue.tags.map((tag, idx) => {
                              const cleanTagName = tag.startsWith('#') ? tag : `#${tag}`;
                              const searchKeyword = tag.replace(/^#/, '').trim();
                              return (
                                <Link
                                  key={idx}
                                  href={`/?search=${encodeURIComponent(searchKeyword)}`}
                                  className="px-3 py-1.5 rounded-full font-mono text-xs font-extrabold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer bg-[#1B889A]/15 border border-[#1B889A]/40 text-[#1B889A] hover:bg-[#1B889A] hover:text-white"
                                  title={`جستجوی هشتگ ${cleanTagName} در صفحه اصلی`}
                                >
                                  <span>{cleanTagName}</span>
                                  <Search className="w-3 h-3 opacity-70" />
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {/* دو دکمه اصلی: مطالعه آنلاین و دانلود مجله */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-[#1B889A]/30 active:scale-95"
                          >
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>مطالعه آنلاین</span>
                          </button>

                          <a
                            href={issue.pdf_url || '/downloads/mahdism_issue_1.pdf'}
                            download={`مجله_ایدئولوژی_مهدویت_شماره_${issue.issue_number}.pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[var(--bg-color)] hover:bg-[var(--muted-bg)] text-[var(--text-primary)] border border-[var(--card-border)] font-bold text-xs sm:text-sm transition-all active:scale-95"
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

export default function MagazinePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-secondary)] font-serif-persian">در حال بارگذاری مجله...</div>}>
      <MagazineContentInner />
    </Suspense>
  );
}
