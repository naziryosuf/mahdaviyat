'use client';

import React, { useState } from 'react';
import { VideoItem } from '@/types';
import { 
  Play, 
  Clock, 
  Eye, 
  Share2, 
  Download, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Video,
  Globe
} from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';

interface Props {
  video: VideoItem;
}

export const VideoPlayerWithDescription: React.FC<Props> = ({ video }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'timestamps'>('overview');
  const [copied, setCopied] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const embedInfo = parseVideoUrl(video.video_url);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden shadow-xl modern-card">
      
      {/* 1. Universal Video Screen Container (YouTube / Aparat / Direct HTML5 Video) */}
      <div className="relative aspect-video bg-black w-full overflow-hidden border-b border-[var(--card-border)] shadow-2xl">
        {embedInfo.type === 'youtube' || embedInfo.type === 'aparat' || embedInfo.type === 'vimeo' ? (
          <iframe
            src={embedInfo.embedUrl}
            title={video.title_fa}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            src={video.video_url}
            poster={video.thumbnail_url}
            controls
            controlsList="nodownload"
            className="w-full h-full object-contain"
          >
            مرورگر شما از پخش این ویدیو پشتیبانی نمی‌کند.
          </video>
        )}
      </div>

      {/* 2. Video Title, Category & Quick Actions */}
      <div className="p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                {video.category_fa}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#1B889A]" />
                {video.duration_fa}
              </span>
              {embedInfo.type === 'youtube' && (
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
                  <Video className="w-3 h-3 text-red-500" />
                  پخش آنلاین از یوتیوب
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif-persian">
              {video.title_fa}
            </h2>
            
            <p className="text-xs text-[var(--text-secondary)]">
              سخنران/کارشناس: <strong className="text-[var(--text-primary)] font-bold">{video.speaker_fa}</strong> • تاریخ انتشار: {video.published_at}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#1B889A]" />}
              <span>{copied ? 'لینک کپی شد' : 'اشتراک‌گذاری'}</span>
            </button>

            {video.download_url && (
              <a
                href={video.download_url}
                download
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل ویدیو</span>
              </a>
            )}
          </div>
        </div>

        {/* 3. Description Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#1B889A] text-white shadow-md'
                  : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
              }`}
            >
              توضیحات ویدیو
            </button>

            {video.transcript_fa && (
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'transcript'
                    ? 'bg-[#1B889A] text-white shadow-md'
                    : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
                }`}
              >
                متن پیاده‌شده
              </button>
            )}

            {video.timestamps && video.timestamps.length > 0 && (
              <button
                onClick={() => setActiveTab('timestamps')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'timestamps'
                    ? 'bg-[#1B889A] text-white shadow-md'
                    : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
                }`}
              >
                زمان‌بندی مباحث
              </button>
            )}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-3">
              <p className="text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed">
                {video.description_fa}
              </p>
            </div>
          )}

          {/* TAB 2: TRANSCRIPT */}
          {activeTab === 'transcript' && video.transcript_fa && (
            <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-3">
              <div className={`text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed ${!showFullTranscript ? 'line-clamp-4' : ''}`}>
                {video.transcript_fa}
              </div>
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="text-xs text-[#1B889A] font-bold hover:underline flex items-center gap-1"
              >
                <span>{showFullTranscript ? 'بستن متن' : 'مشاهده کامل متن پیاده‌شده'}</span>
                {showFullTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* TAB 3: TIMESTAMPS */}
          {activeTab === 'timestamps' && video.timestamps && (
            <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
              {video.timestamps.map((ts, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs">
                  <span className="font-bold text-[var(--text-primary)]">{ts.label_fa}</span>
                  <span className="px-2 py-1 rounded bg-[#1B889A]/10 text-[#1B889A] font-mono font-bold">{ts.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
