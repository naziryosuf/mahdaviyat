'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ExternalLink, 
  Loader2, 
  Maximize2, 
  Minimize2,
  BookOpen,
  RotateCcw,
  AlertCircle,
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  pdfUrl: string;
  title: string;
  issueNumber: number | string;
  onDownloadPDF?: () => void;
}

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export const MobilePdfViewer: React.FC<Props> = ({
  pdfUrl,
  title,
  issueNumber,
  onDownloadPDF
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageRendering, setPageRendering] = useState<boolean>(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState<boolean>(false);
  const [useFallbackViewer, setUseFallbackViewer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // 1. Load PDF.js library dynamically on mobile
  useEffect(() => {
    let isMounted = true;

    const loadScript = () => {
      if (window.pdfjsLib) {
        if (isMounted) setPdfJsLoaded(true);
        return;
      }

      const existingScript = document.getElementById('pdfjs-cdn-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'pdfjs-cdn-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        script.onload = () => {
          if (window.pdfjsLib && isMounted) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setPdfJsLoaded(true);
          }
        };
        script.onerror = () => {
          if (isMounted) {
            setUseFallbackViewer(true);
            setLoading(false);
          }
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', () => {
          if (window.pdfjsLib && isMounted) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setPdfJsLoaded(true);
          }
        });
      }
    };

    loadScript();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load PDF Document via PDF.js
  useEffect(() => {
    if (!pdfJsLoaded || !pdfUrl) return;

    let isCancelled = false;
    setLoading(true);
    setErrorMessage('');

    const loadingTask = window.pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
      enableXfa: true,
    });

    loadingTask.promise
      .then((pdf: any) => {
        if (isCancelled) return;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err: any) => {
        if (isCancelled) return;
        console.warn('PDF.js mobile load warning:', err);
        // Fallback to Google Docs viewer if direct fetch is blocked by CORS
        setUseFallbackViewer(true);
        setLoading(false);
      });

    return () => {
      isCancelled = true;
      if (loadingTask && loadingTask.destroy) {
        loadingTask.destroy();
      }
    };
  }, [pdfJsLoaded, pdfUrl]);

  // 3. Render Current Page onto High-DPI Canvas
  const renderPage = useCallback(async (pageNumber: number) => {
    if (!pdfDocRef.current || !canvasRef.current || !containerRef.current) return;

    try {
      setPageRendering(true);

      // Cancel previous render task if still in progress
      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel();
        } catch {
          // ignore render cancellation error
        }
      }

      const page = await pdfDocRef.current.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;

      const containerWidth = containerRef.current.clientWidth || window.innerWidth || 360;
      const initialViewport = page.getViewport({ scale: 1.0 });

      // Calculate scale to fit container width perfectly on mobile
      const scaleFactor = ((containerWidth - 16) / initialViewport.width) * zoom;
      const viewport = page.getViewport({ scale: scaleFactor });

      // Support High-DPI screens (Retina displays) for crystal sharp text
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.save();
      context.scale(pixelRatio, pixelRatio);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      context.restore();
      setPageRendering(false);
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err);
      }
      setPageRendering(false);
    }
  }, [zoom]);

  // Trigger render when page or zoom changes
  useEffect(() => {
    if (pdfDocRef.current && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [currentPage, zoom, renderPage]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (pdfDocRef.current && currentPage > 0) {
        renderPage(currentPage);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, renderPage]);

  // Navigation handlers (Persian RTL: Next page is Left arrow, Prev page is Right arrow)
  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  // Touch Swipe Gesture Handlers for natural mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger horizontal swipe if horizontal movement is larger than vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left -> Next Page (in RTL or normal page sequence)
        goToNextPage();
      } else {
        // Swiped Right -> Previous Page
        goToPrevPage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleDownload = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `مجله_ایدئولوژی_مهدویت_شماره_${issueNumber}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div 
      className={`w-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 transition-all ${
        isFullscreen ? 'fixed inset-0 z-[99999] h-screen rounded-none' : 'min-h-[580px]'
      }`}
    >
      {/* 1. TOP MOBILE TOOLBAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2 shrink-0 select-none text-white text-xs">
        
        {/* Left: Issue Title & Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-[#1B889A]/20 border border-[#1B889A]/40 flex items-center justify-center text-[#1B889A] shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 truncate">
            <span className="font-extrabold text-[11px] text-stone-200 block truncate font-serif-persian">
              {title}
            </span>
            <span className="text-[10px] text-[#1B889A] font-bold">
              شماره {issueNumber}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!useFallbackViewer && (
            <>
              {/* Zoom Out */}
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-stone-300 transition-all border border-slate-700"
                title="کوچک‌نمایی"
                aria-label="کوچک‌نمایی"
              >
                <ZoomOut className="w-3.5 h-3.5 text-[#1B889A]" />
              </button>

              {/* Current Zoom Indicator */}
              <span 
                onClick={() => setZoom(1.0)}
                className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono font-bold text-stone-300 border border-slate-700 cursor-pointer"
                title="کلیک برای بازنشانی بزرگ‌نمایی"
              >
                {Math.round(zoom * 100)}%
              </span>

              {/* Zoom In */}
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2.0))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-stone-300 transition-all border border-slate-700"
                title="بزرگ‌نمایی"
                aria-label="بزرگ‌نمایی"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#1B889A]" />
              </button>
            </>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-stone-300 transition-all border border-slate-700"
            title={isFullscreen ? 'خروج از تمام صفحه' : 'تمام صفحه'}
            aria-label="حالت تمام صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#1B889A]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#1B889A]" />}
          </button>
        </div>

      </div>

      {/* 2. MAIN READING CANVAS / VIEWER AREA */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 w-full bg-slate-950 flex flex-col items-center justify-start overflow-y-auto overflow-x-auto p-1.5 min-h-[500px] select-none"
      >
        {/* Loading Spinner */}
        {(loading || (!useFallbackViewer && !pdfDocRef.current)) && (
          <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center space-y-3 text-stone-300">
            <Loader2 className="w-8 h-8 text-[#1B889A] animate-spin" />
            <span className="text-xs font-bold font-serif-persian">در حال آماده‌سازی صفحات مجله برای موبایل...</span>
          </div>
        )}

        {/* Fallback Google Docs Embedded Viewer (If PDF.js fails to load remote CORS) */}
        {useFallbackViewer ? (
          <div className="w-full h-full min-h-[540px] flex-1 flex flex-col items-center">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
              className="w-full h-full min-h-[540px] flex-1 border-0 rounded-xl"
              title="Google Docs Mobile PDF Viewer"
              onLoad={() => setLoading(false)}
            />
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-full my-auto">
            {/* Canvas for High-DPI Page Rendering */}
            <canvas 
              ref={canvasRef} 
              className={`rounded-lg shadow-2xl transition-opacity duration-200 ${
                pageRendering ? 'opacity-80' : 'opacity-100'
              }`}
            />

            {/* In-canvas Page Rendering Spinner Indicator */}
            {pageRendering && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#1B889A] animate-spin" />
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. BOTTOM MOBILE PAGINATION & NAVIGATION BAR */}
      {!useFallbackViewer && numPages > 0 && (
        <div className="bg-slate-900/95 backdrop-blur border-t border-slate-800 px-3 py-2.5 flex items-center justify-between gap-3 shrink-0 select-none text-white">
          
          {/* Previous Page Button (Right in RTL) */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || pageRendering}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-stone-200 border border-slate-700 active:scale-95 transition-all"
            aria-label="صفحه قبلی"
          >
            <ChevronRight className="w-4 h-4 text-[#1B889A]" />
            <span>قبلی</span>
          </button>

          {/* Page Selector & Counter */}
          <div className="flex items-center gap-1.5 text-xs font-bold font-serif-persian">
            <span>صفحه</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="bg-slate-800 text-[#1B889A] border border-[#1B889A]/40 rounded-lg px-2 py-1 text-xs font-mono font-extrabold outline-none focus:ring-1 focus:ring-[#1B889A]"
            >
              {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span>از</span>
            <span className="font-mono text-stone-300 font-extrabold">{numPages}</span>
          </div>

          {/* Next Page Button (Left in RTL) */}
          <button
            onClick={goToNextPage}
            disabled={currentPage >= numPages || pageRendering}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-stone-200 border border-slate-700 active:scale-95 transition-all"
            aria-label="صفحه بعدی"
          >
            <span>بعدی</span>
            <ChevronLeft className="w-4 h-4 text-[#1B889A]" />
          </button>

        </div>
      )}

      {/* 4. FOOTER ACTION BUTTONS (Download & Direct Link) */}
      <div className="bg-slate-950 border-t border-slate-900 p-2.5 flex items-center justify-between gap-2 text-xs">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-300 font-bold border border-slate-700 text-xs transition-all active:scale-95"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#1B889A]" />
          <span>باز کردن در تب جدید ↗</span>
        </a>

        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-[#1B889A]/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>دانلود مستقیم PDF</span>
        </button>
      </div>

    </div>
  );
};
