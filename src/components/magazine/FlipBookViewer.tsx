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
  FileText,
  UserCheck,
  Eye,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  issue: MagazineIssue;
  onBackToCatalog?: () => void;
}

export const FlipBookViewer: React.FC<Props> = ({ issue, onBackToCatalog }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerMode, setViewerMode] = useState<'native' | 'google'>('google');

  const pdfUrl = issue.pdf_url || '/downloads/mahdism_issue_1.pdf';
  const isDataUrl = pdfUrl.startsWith('data:') || pdfUrl.startsWith('blob:');
  const isHttpUrl = pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://');

  const googleDocsViewerUrl = isHttpUrl 
    ? `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true` 
    : pdfUrl;

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
        
        {/* Back to Catalog & Issue Details */}
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
            <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2 flex-wrap">
              <span>{issue.title_fa}</span>
              <span className="px-3 py-0.5 rounded-full teal-badge text-[10px] font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#1B889A]" />
                شماره {issue.issue_number}
              </span>
            </h3>
            
            {(issue.author_name_fa || issue.author_title_fa) && (
              <p className="text-xs text-[#1B889A] font-bold mt-1 flex items-center gap-1.5 font-serif-persian">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>نویسنده / صاحب اثر: {issue.author_name_fa} {issue.author_title_fa ? `(${issue.author_title_fa})` : ''}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Viewer Mode Switching */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Mode Switcher if HTTP URL */}
          {isHttpUrl && (
            <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] text-xs">
              <button
                onClick={() => setViewerMode('native')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${viewerMode === 'native' ? 'bg-[#1B889A] text-white shadow-sm' : 'text-[var(--text-secondary)]'}`}
              >
                مرورگر اصلی
              </button>
              <button
                onClick={() => setViewerMode('google')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${viewerMode === 'google' ? 'bg-[#1B889A] text-white shadow-sm' : 'text-[var(--text-secondary)]'}`}
              >
                نمایشگر آنلاین گوگل
              </button>
            </div>
          )}

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
            <span className="hidden sm:inline">باز کردن مستقیم</span>
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

      {/* 2. DEDICATED PDF DISPLAY STAGE */}
      <div 
        className={`w-full bg-[var(--card-bg)] border-2 border-[#1B889A]/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative ${
          isFullscreen ? 'h-[calc(100vh-90px)] rounded-none border-0' : 'h-[550px] sm:h-[850px]'
        }`}
      >
        {viewerMode === 'google' && isHttpUrl ? (
          <iframe
            src={googleDocsViewerUrl}
            title={issue.title_fa}
            className="w-full h-full border-0 rounded-2xl bg-stone-900"
          />
        ) : (
          <iframe
            src={pdfUrl}
            title={issue.title_fa}
            className="w-full h-full border-0 rounded-2xl bg-stone-900"
          />
        )}
      </div>

      {/* Fallback Help Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <AlertCircle className="w-4 h-4 text-[#1B889A] shrink-0" />
          <span>اگر فایل PDF در کادر بالا نمایش داده نشد، می‌توانید فایل را مستقیماً باز کرده یا دانلود نمایید.</span>
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Eye className="w-4 h-4" />
          <span>مشاهده مستقیم فایل PDF</span>
        </a>
      </div>

    </div>
  );
};
