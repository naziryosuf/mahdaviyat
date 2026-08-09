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
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center space-y-4 modern-card shadow-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full teal-badge text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#1B889A]" />
              <span>فهرست و آرشیف کامل شماره‌های مجله ایدئولوژی مهدویت</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] font-serif-persian">
              فهرست و آرشیف کامل شماره‌های مجله ایدئولوژی مهدویت
            </h1>
            
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-serif-persian">
              فهرست شماره‌های نشر شده مجله برای مطالعه و دانلود.
            </p>
          </div>

          {/* Catalog List of ALL Magazine Issues */}
          <div className="space-y-10">
            {magazineIssues.map((issue) => {
              const toc = getTocForIssue(issue.issue_number);
              return (
                <div
                  key={issue.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-10 modern-card shadow-xl space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* 1. عکس مجله */}
                    <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-2 border-[#1B889A]/30 aspect-[3/4] bg-stone-900 shadow-2xl group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={issue.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <span className="px-3 py-1 rounded-full crimson-badge text-xs font-bold w-fit mb-2">
                          شماره {issue.issue_number} - {issue.publish_date_fa}
                        </span>
                        <h3 className="text-xl font-bold text-white font-serif-persian">
                          {issue.title_fa}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">صفحات چاپی A4 • تعداد دانلود: {issue.download_count}</p>
                      </div>
                    </div>

                    {/* 2. درباره همان شماره و 3. فهرست مطالب آن */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                            شماره {issue.issue_number} مجله
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-[#1B889A]" />
                            انتشار: {issue.publish_date_fa}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                          {issue.title_fa}
                        </h2>

                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-serif-persian">
                          {issue.description_fa}
                        </p>
                      </div>

                      {/* فهرست مطالب اختصاصی همان شماره */}
                      <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
                        <h4 className="text-xs font-bold text-[#1B889A] flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2 mb-2">
                          <FileText className="w-4 h-4" />
                          <span>فهرست مطالب شماره {issue.issue_number}:</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                          {toc.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-[var(--card-bg)] border border-[var(--card-border)]">
                              <span className="truncate max-w-[200px] font-bold text-[var(--text-primary)]">{item.title}</span>
                              <span className="text-[#1B889A] font-mono">ص {item.page}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. دو آپشن اصلی: ۱. مطالعه آنلاین ۲. دانلود مجله */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-sm transition-all shadow-lg shadow-[#1B889A]/30 active:scale-95"
                        >
                          <BookOpen className="w-5 h-5" />
                          <span>مطالعه آنلاین</span>
                        </button>

                        <a
                          href={issue.pdf_url || '/magazines/issue-1-mahdaviyat.pdf'}
                          download={`مجله_ایدئولوژی_مهدویت_شماره_${issue.issue_number}.pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[var(--bg-color)] hover:bg-[var(--muted-bg)] text-[var(--text-primary)] border border-[var(--card-border)] font-bold text-sm transition-all active:scale-95"
                        >
                          <Download className="w-5 h-5 text-[#A32838]" />
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
