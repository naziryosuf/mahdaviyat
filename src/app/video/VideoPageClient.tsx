'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { VideoPlayerWithDescription } from '@/components/video/VideoPlayerWithDescription';
import { 
  Video, 
  Sparkles, 
  Play, 
  Clock, 
  Eye, 
  X, 
  Share2, 
  MessageCircle, 
  Send, 
  Globe, 
  Copy, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';
import { VideoItem } from '@/types';

function VideoContentInner() {
  const { videos, updateVideo } = useStore();
  const searchParams = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [sharingVideo, setSharingVideo] = useState<VideoItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Track video views
  useEffect(() => {
    if (selectedVideo?.id) {
      const viewedKey = `mahdism_viewed_vid_${selectedVideo.id}`;
      if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, '1');
        updateVideo(selectedVideo.id, { views: (selectedVideo.views || 0) + 1 });
      }
    }
  }, [selectedVideo?.id, updateVideo]);

  // If a specific video ID was requested in query params, open it
  useEffect(() => {
    const videoId = searchParams.get('id');
    if (videoId && videos.length > 0) {
      const found = videos.find((v) => v.id === videoId);
      if (found) {
        setSelectedVideo(found);
      }
    }
  }, [searchParams, videos]);

  return (
    <div className="space-y-10 py-6 relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999999] bg-[var(--card-bg)] border-2 border-[#1B889A] text-[#1B889A] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-extrabold animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-md whitespace-nowrap">
          <CheckCircle2 className="w-5 h-5 text-[#1B889A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 modern-card">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full teal-badge text-xs font-semibold">
            <Video className="w-3.5 h-3.5 text-[#1B889A]" />
            <span>رسانه تصویری & نشریه‌های ویدیویی</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian">
            کتابخانه ویدیویی شناختی ایدئولوژی مهدویت
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            مشاهده نشست‌های علمی، نقد تصویری مکاتب بشری، همراه با باکس اختصاصی «توضیحات ویدیو»، پیاده‌سازی متنی و زمان‌بندی مباحث.
          </p>
        </div>
      </div>

      {/* Video Playlist Grid */}
      <div className="space-y-6">
        <div className="border-b border-[var(--card-border)] pb-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
            <Video className="w-4.5 h-4.5 text-[#1B889A]" />
            <span>گالری محتوای ویدیویی ({videos.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const ytEmbed = parseVideoUrl(vid.video_url);
            const thumbUrl = vid.thumbnail_url || ytEmbed.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

            return (
              <div
                key={vid.id}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] rounded-3xl overflow-hidden transition-all duration-300 shadow-xl group p-4 space-y-3 flex flex-col justify-between modern-card"
              >
                <div 
                  className="space-y-3 cursor-pointer"
                  onClick={() => setSelectedVideo(vid)}
                >
                  {/* 16:9 HD Thumbnail Container */}
                  <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-2xl border border-[var(--card-border)] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl}
                      alt={vid.title_fa}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-[#1B889A] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 bg-black/80 rounded-lg text-[10px] font-mono text-white dir-ltr font-bold border border-white/10">
                      {vid.duration_fa}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full teal-badge inline-block">
                      {vid.category_fa}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors font-serif-persian leading-snug">
                      {vid.title_fa}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] font-serif-persian">
                      {vid.speaker_fa?.includes('،') || vid.speaker_fa?.includes(',') || (vid.speaker_fa?.match(/@/g) || []).length > 1 ? 'سخنرانان / ارائه‌دهندگان:' : 'سخنران:'} {vid.speaker_fa}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs gap-2">
                  <button 
                    onClick={() => setSelectedVideo(vid)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold transition-all shadow-md active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>پخش ویدیو</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSharingVideo(vid);
                    }}
                    title="اشتراک‌گذاری ویدیو"
                    className="p-2 rounded-xl bg-[var(--bg-color)] hover:bg-[#1B889A]/15 text-[var(--text-secondary)] hover:text-[#1B889A] border border-[var(--card-border)] hover:border-[#1B889A]/30 transition-all active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-0 relative max-h-[95vh] overflow-y-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B889A] animate-pulse shrink-0" />
                <h3 className="font-bold text-sm sm:text-base leading-snug font-serif-persian">{selectedVideo.title_fa}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSharingVideo(selectedVideo)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="اشتراک‌گذاری این ویدیو"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="بستن"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <VideoPlayerWithDescription video={selectedVideo} />
          </div>
        </div>
      )}

      {/* VIDEO SHARE LIGHTBOX MODAL */}
      {sharingVideo && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSharingVideo(null)}
        >
          <div 
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 modern-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A]">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-[var(--text-primary)] font-serif-persian">
                  اشتراک‌گذاری ویدیو
                </h3>
              </div>
              <button 
                onClick={() => setSharingVideo(null)}
                className="p-1.5 rounded-xl hover:bg-stone-500/10 text-[var(--text-secondary)] transition-colors"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Summary Card */}
            <div className="flex items-center gap-3 p-3.5 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)]">
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-[var(--card-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={sharingVideo.thumbnail_url || parseVideoUrl(sharingVideo.video_url).thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'} 
                  alt={sharingVideo.title_fa}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[var(--text-primary)] font-serif-persian leading-snug">
                  {sharingVideo.title_fa}
                </h4>
                <p className="text-[11px] text-[#1B889A] font-bold truncate">
                  سخنران: {sharingVideo.speaker_fa} • مدت: {sharingVideo.duration_fa}
                </p>
              </div>
            </div>

            {/* Direct Video Share URL - Short & Clean */}
            {(() => {
              const videoShareUrl = typeof window !== 'undefined' 
                ? `${window.location.origin}/video?id=${sharingVideo.id}` 
                : `https://www.ideologymahdaviyat.org/video?id=${sharingVideo.id}`;

              return (
                <>
                  {/* Social Share Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `🎬 ویدیو: ${sharingVideo.title_fa}\nسخنران: ${sharingVideo.speaker_fa}\nمدت: ${sharingVideo.duration_fa}\n\nمشاهده آنلاین در مجله ایدئولوژی مهدویت:\n${videoShareUrl}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>ارسال در واتساپ</span>
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(videoShareUrl)}&text=${encodeURIComponent(`🎬 ${sharingVideo.title_fa} - سخنران: ${sharingVideo.speaker_fa}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white border border-[#229ED9]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>ارسال در تلگرام</span>
                    </a>

                    {/* Eitaa */}
                    <a
                      href={`https://eitaa.com/share/url?url=${encodeURIComponent(videoShareUrl)}&text=${encodeURIComponent(`🎬 ${sharingVideo.title_fa} - سخنران: ${sharingVideo.speaker_fa}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#E85E26]/15 hover:bg-[#E85E26] text-[#E85E26] hover:text-white border border-[#E85E26]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <Globe className="w-4 h-4" />
                      <span>ارسال در ایتا</span>
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(videoShareUrl);
                        showToast('لینک مستقیم ویدیو کپی شد');
                      }}
                      className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1B889A]/15 hover:bg-[#1B889A] text-[#1B889A] hover:text-white border border-[#1B889A]/30 font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <Copy className="w-4 h-4" />
                      <span>کپی لینک مستقیم</span>
                    </button>
                  </div>

                  {/* Native Mobile Share */}
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: sharingVideo.title_fa,
                            text: `مشاهده ویدیو «${sharingVideo.title_fa}» در مجله ایدئولوژی مهدویت`,
                            url: videoShareUrl,
                          });
                        } catch (e) {
                          // dismissed
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--bg-color)] hover:bg-[#1B889A] text-[var(--text-primary)] hover:text-white border border-[var(--card-border)] hover:border-[#1B889A] font-bold text-xs transition-all shadow-sm active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>اشتراک‌گذاری با سایر برنامه‌های گوشی</span>
                    </button>
                  )}

                  {/* Direct Link Input */}
                  <div className="pt-2 border-t border-[var(--card-border)] flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={videoShareUrl}
                      className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono text-[var(--text-secondary)] dir-ltr truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(videoShareUrl);
                        showToast('لینک مستقیم ویدیو کپی شد');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95"
                    >
                      <Copy className="w-4 h-4" />
                      <span>کپی</span>
                    </button>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}

export function VideoPageClient() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400 font-serif-persian">در حال بارگذاری کتابخانه ویدیویی...</div>}>
      <VideoContentInner />
    </Suspense>
  );
}
