'use client';

import React, { useState, useEffect } from 'react';
import { MagazineIssue } from '@/types';
import { 
  Download, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  FileText,
  UserCheck,
  Eye,
  AlertCircle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  issue: MagazineIssue;
  onBackToCatalog?: () => void;
}

export const FlipBookViewer: React.FC<Props> = ({ issue, onBackToCatalog }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const pdfUrl = issue.pdf_url || '/downloads/mahdism_issue_1.pdf';

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [pdfUrl]);

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

  if (!mounted || !pdfUrl) {
    return (
      <div className="w-full h-[75vh] min-h-[550px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center space-y-4 text-slate-200">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
        <span className="text-sm font-bold font-serif-persian">در حال بارگذاری مجله...</span>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto space-y-4 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 overflow-hidden h-screen' : 'max-w-6xl'}`}>
      
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

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Fullscreen Mode Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] transition-all active:scale-95 shadow-sm"
            title={isFullscreen ? 'خروج از حالت تمام صفحه' : 'حالت تمام صفحه'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#1B889A]" /> : <Maximize2 className="w-4 h-4 text-[#1B889A]" />}
          </button>

          {/* Open Direct URL */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="باز کردن PDF در تب جدید"
          >
            <ExternalLink className="w-4 h-4 text-[#1B889A]" />
            <span className="hidden sm:inline">باز کردن در تب جدید ↗</span>
          </a>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>دانلود نسخه PDF</span>
          </button>
        </div>

      </div>

      {/* 2. MAIN NATIVE IN-BROWSER PDF READER CONTAINER */}
      <div className={`relative w-full ${isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-[75vh] min-h-[550px]'} bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col`}>
        
        {/* Top Controls Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 backdrop-blur border-b border-slate-700 text-white text-xs sm:text-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium font-serif-persian">مطالعه آنلاین مجله</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-1 text-slate-200 text-xs font-medium"
            >
              <span>باز کردن در تب جدید ↗</span>
            </a>
            <a
              href={pdfUrl}
              download
              onClick={handleDownloadPDF}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 rounded-lg text-white font-medium transition-colors flex items-center gap-1 text-xs"
            >
              <span>دانلود نسخه PDF</span>
            </a>
          </div>
        </div>

        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 flex flex-col items-center justify-center space-y-3 text-slate-200">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            <span className="text-xs font-bold font-serif-persian">در حال بارگذاری مجله...</span>
          </div>
        )}

        {/* PDF View Container (Object with Iframe Fallback) */}
        <div className="relative flex-1 w-full h-full bg-slate-950">
          <object
            data={`${pdfUrl}#view=FitH&toolbar=1`}
            type="application/pdf"
            className="w-full h-full"
            onLoad={() => setIsLoading(false)}
          >
            <iframe
              src={`${pdfUrl}#view=FitH&toolbar=1`}
              className="w-full h-full border-0"
              title="PDF Magazine Reader"
              onLoad={() => setIsLoading(false)}
            >
              <div className="p-8 text-center text-slate-300">
                مرورگر شما از پیش‌نمایش مستقیم پشتیبانی نمی‌کند.
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-teal-400 underline mr-2">
                  برای مطالعه اینجا کلیک کنید
                </a>
              </div>
            </iframe>
          </object>
        </div>

      </div>

      {/* Fallback Help Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <AlertCircle className="w-4 h-4 text-[#1B889A] shrink-0" />
          <span>امکان مرور مستقیم صفحات مجله بدون دانلود فایل فراهم شده است.</span>
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
