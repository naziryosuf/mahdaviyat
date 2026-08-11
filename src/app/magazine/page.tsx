'use client';

import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { translations } from '@/data/translations';

export default function MagazinePage() {
  const { magazineIssues, language } = useStore();
  const t = translations[language] || translations.fa;

  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);

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

  return (
    <div className="space-y-12 py-6">
      
      {/* Dynamic View */}
      {selectedIssue ? (
        <div className="space-y-6">
          <FlipBookViewer issue={selectedIssue} onBackToCatalog={() => setSelectedIssue(null)} />
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Header Banner */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 sm:p-12 text-center space-y-3 modern-card shadow-lg">
            <h1 className="text-xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
              فهرست و آرشیف کامل شماره‌های مجله ایدئولوژی مهدویت
            </h1>
            
            <p className="text-xs sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-serif-persian">
              فهرست شماره‌های نشر شده مجله برای مطالعه آنلاین و دانلود مستقیم فایل PDF.
            </p>
          </div>

          {/* Catalog List of ALL Magazine Issues */}
          <div className="space-y-8">
            {magazineIssues.map((issue) => {
              const toc = getTocForIssue(issue.issue_number);
              return (
                <div
                  key={issue.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 sm:p-10 modern-card shadow-xl space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* 1. بخش تصویر مجله */}
                    <div className="lg:col-span-5 space-y-3">
                      {/* بج و مشخصات بالای عکس مخصوص موبایل */}
                      <div className="sm:hidden flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                          شماره {issue.issue_number} - {issue.publish_date_fa}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] font-bold">
                          صفحات A4
                        </span>
                      </div>

                      {/* عکس مجله (در موبایل کاملاً تمیز بدون متن روی تصویر) */}
                      <div className="relative rounded-2xl overflow-hidden border-2 border-[#1B889A]/30 aspect-[16/9] sm:aspect-[3/4] max-w-sm mx-auto w-full bg-stone-900 shadow-2xl group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={issue.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* متن روی تصویر فقط برای دسکتاپ */}
                        <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex-col justify-end p-5">
                          <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold w-fit mb-2">
                            شماره {issue.issue_number} - {issue.publish_date_fa}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white font-serif-persian">
                            {issue.title_fa}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1">صفحات چاپی A4 • تعداد دانلود: {issue.download_count}</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. درباره همان شماره و 3. فهرست مطالب آن */}
                    <div className="lg:col-span-7 space-y-5">
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                            شماره {issue.issue_number} مجله
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-[#1B889A]" />
                            انتشار: {issue.publish_date_fa}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-serif-persian leading-snug">
                          {issue.title_fa}
                        </h2>

                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-serif-persian">
                          {issue.description_fa}
                        </p>
                      </div>

                      {/* فهرست مطالب اختصاصی همان شماره */}
                      <div className="p-3.5 sm:p-5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
                        <h4 className="text-xs font-bold text-[#1B889A] flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2 mb-2">
                          <FileText className="w-4 h-4" />
                          <span>فهرست مطالب شماره {issue.issue_number}:</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                          {toc.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] gap-2">
                              <span className="min-w-0 font-bold text-[var(--text-primary)] font-serif-persian leading-snug text-[11px] sm:text-xs">{item.title}</span>
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
            })}
          </div>

        </div>
      )}

    </div>
  );
}
