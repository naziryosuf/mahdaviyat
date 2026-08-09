'use client';

import React, { useState } from 'react';
import { MagazineIssue } from '@/types';
import { 
  Download, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  Sparkles,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  issue: MagazineIssue;
  onBackToCatalog?: () => void;
}

export const FlipBookViewer: React.FC<Props> = ({ issue, onBackToCatalog }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pdfUrl = issue.pdf_url || '/magazines/issue-1-mahdaviyat.pdf';

  const handleDownloadPDF = () => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `مجله_ایدئولوژی_مهدویت_شماره_${issue.issue_number}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`w-full mx-auto space-y-4 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-[var(--bg-color)] p-4 overflow-hidden h-screen' : 'max-w-6xl'}`}>
      
      {/* 1. Header Toolbar */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg modern-card">
        
        {/* Back to Catalog & Issue Title */}
        <div className="flex items-center gap-3">
          {onBackToCatalog && (
            <button
              onClick={onBackToCatalog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 shadow-sm group"
              title="بازگشت به فهرست مجلات"
            >
              <ArrowRight className="w-4 h-4 text-[#1B889A] group-hover:-translate-x-1 transition-transform" />
              <span>فهرست مجلات</span>
            </button>
          )}

          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <span>{issue.title_fa}</span>
              <span className="px-3 py-0.5 rounded-full teal-badge text-[10px] font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#1B889A]" />
                نمایشگر مستقیم PDF
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">مطالعه مستقیم صفحات چاپی A4 • شماره {issue.issue_number}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="حالت تمام صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#1B889A]" /> : <Maximize2 className="w-4 h-4 text-[#1B889A]" />}
            <span className="hidden sm:inline">{isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}</span>
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="باز کردن PDF در تب جدید"
          >
            <ExternalLink className="w-4 h-4 text-[#1B889A]" />
            <span className="hidden sm:inline">تب جدید</span>
          </a>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>دانلود PDF</span>
          </button>

        </div>

      </div>

      {/* 2. DEDICATED PDF STAGE (CLEAN & WITHOUT FLOATING OPTION BAR) */}
      <div 
        className={`w-full bg-[var(--card-bg)] border-2 border-[#1B889A]/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative ${
          isFullscreen ? 'h-[calc(100vh-90px)] rounded-none border-0' : 'h-[720px] sm:h-[840px]'
        }`}
      >
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
          title={issue.title_fa}
          className="w-full h-full border-0 rounded-2xl bg-stone-900"
        />
      </div>

    </div>
  );
};
