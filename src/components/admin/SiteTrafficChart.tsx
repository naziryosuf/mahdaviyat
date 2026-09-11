'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar, 
  Download, 
  Eye, 
  Video, 
  FileText, 
  Volume2, 
  BarChart3, 
  LineChart as LineChartIcon,
  Sparkles,
  Activity
} from 'lucide-react';
import { getTrafficAnalytics, TrafficAnalyticsData } from '@/utils/siteAnalytics';
import { Article, MagazineIssue, VideoItem, AudioItem } from '@/types';

interface SiteTrafficChartProps {
  articles: Article[];
  magazineIssues: MagazineIssue[];
  videos: VideoItem[];
  audios: AudioItem[];
}

type TimeFrame = 'hourly' | 'daily' | 'monthly' | 'yearly';

export const SiteTrafficChart: React.FC<SiteTrafficChartProps> = ({
  articles,
  magazineIssues,
  videos,
  audios,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('hourly');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const analyticsData: TrafficAnalyticsData = useMemo(() => {
    return getTrafficAnalytics();
  }, []);

  // Aggregated content metrics
  const totalMagazineDownloads = useMemo(() => {
    return magazineIssues.reduce((acc, m) => acc + (m.download_count || 0), 0);
  }, [magazineIssues]);

  const totalArticleViews = useMemo(() => {
    return articles.reduce((acc, a) => acc + (a.views || 0), 0);
  }, [articles]);

  const totalVideoViews = useMemo(() => {
    return videos.reduce((acc, v) => acc + (v.views || 0), 0);
  }, [videos]);

  const totalAudioPlays = useMemo(() => {
    return audios.reduce((acc, a) => acc + (a.plays || 0), 0);
  }, [audios]);

  // Selected dataset based on timeframe
  const currentDataset = useMemo(() => {
    switch (timeframe) {
      case 'hourly':
        return analyticsData.hourly.map((item) => ({
          label: item.label,
          fullLabel: `امروز - ساعت ${item.label}`,
          value: item.count,
        }));
      case 'daily':
        return analyticsData.daily.map((item) => ({
          label: item.label,
          fullLabel: `تاریخ ${item.date}`,
          value: item.count,
        }));
      case 'monthly':
        return analyticsData.monthly.map((item) => ({
          label: item.label.split(' ')[0], // short name
          fullLabel: `ماه ${item.label}`,
          value: item.count,
        }));
      case 'yearly':
        return analyticsData.yearly.map((item) => ({
          label: item.year,
          fullLabel: item.label,
          value: item.count,
        }));
    }
  }, [timeframe, analyticsData]);

  // Chart math
  const maxValue = useMemo(() => {
    const max = Math.max(...currentDataset.map((d) => d.value), 10);
    return Math.ceil(max * 1.15); // +15% head room
  }, [currentDataset]);

  const chartWidth = 760;
  const chartHeight = 260;
  const paddingX = 40;
  const paddingY = 30;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  // Compute coordinates for line/area
  const points = useMemo(() => {
    if (currentDataset.length === 0) return [];
    return currentDataset.map((item, idx) => {
      const x = paddingX + (idx / Math.max(1, currentDataset.length - 1)) * usableWidth;
      const y = paddingY + (1 - item.value / maxValue) * usableHeight;
      return { x, y, ...item };
    });
  }, [currentDataset, maxValue, usableWidth, usableHeight]);

  // Generate SVG path for smooth bezier curve
  const pathD = useMemo(() => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  // Area closed path
  const areaD = useMemo(() => {
    if (points.length < 2) return '';
    const bottomY = chartHeight - paddingY;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, points, chartHeight]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP KPI SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Visits */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#1B889A]">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#1B889A]/10">کل سایت</span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono">
            {analyticsData.totalVisits.toLocaleString('fa-IR')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">مجموع بازدیدهای سایت</p>
        </div>

        {/* Today's Visits */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border-2 border-[#1B889A]/40 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#1B889A]">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">امروز</span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono">
            {analyticsData.todayVisits.toLocaleString('fa-IR')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">بازدیدهای ۲۴ ساعت گذشته</p>
        </div>

        {/* Magazine Downloads */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-indigo-500">
            <Download className="w-4 h-4" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/10">مجلات</span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono">
            {totalMagazineDownloads.toLocaleString('fa-IR')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">دانلودهای فایل PDF مجله</p>
        </div>

        {/* Video Views */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-amber-500">
            <Video className="w-4 h-4" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10">ویدیوها</span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono">
            {totalVideoViews.toLocaleString('fa-IR')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">تماشای نشست‌ها و کلیپ‌ها</p>
        </div>

        {/* Article Reads */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10">متون</span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono">
            {totalArticleViews.toLocaleString('fa-IR')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">مطالعه مقالات و یادداشت‌ها</p>
        </div>

        {/* Audio Plays */}
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-rose-500">
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10">صوتی</span>
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] font-mono">
            {totalAudioPlays.toLocaleString('fa-IR')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">شنیدن پادکست‌ها و صوت‌ها</p>
        </div>
      </div>

      {/* 2. MAIN GRAPH CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md space-y-5">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1B889A]/15 text-[#1B889A] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] font-serif-persian">
                نمودار ترافیک و تحلیل بازدیدکنندگان سایت
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              بررسی توزیع زمانی مراجعات بر اساس ساعت، روز، ماه و سال
            </p>
          </div>

          {/* Controls: Timeframe Filter Buttons & Type Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe pills */}
            <div className="p-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center gap-1">
              <button
                onClick={() => { setTimeframe('hourly'); setHoveredIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === 'hourly'
                    ? 'bg-[#1B889A] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                🕒 امروز (ساعتی)
              </button>

              <button
                onClick={() => { setTimeframe('daily'); setHoveredIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === 'daily'
                    ? 'bg-[#1B889A] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                📅 روزانه (۳۰ روز)
              </button>

              <button
                onClick={() => { setTimeframe('monthly'); setHoveredIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-[#1B889A] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                🗓️ ماهانه (۱۲ ماه)
              </button>

              <button
                onClick={() => { setTimeframe('yearly'); setHoveredIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeframe === 'yearly'
                    ? 'bg-[#1B889A] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                📈 سالانه
              </button>
            </div>

            {/* Line / Bar Toggle */}
            <div className="p-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center gap-1">
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded-lg transition-all ${
                  chartType === 'line' ? 'bg-[#1B889A] text-white' : 'text-[var(--text-secondary)]'
                }`}
                title="نمودار خطی پیوسته"
              >
                <LineChartIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-lg transition-all ${
                  chartType === 'bar' ? 'bg-[#1B889A] text-white' : 'text-[var(--text-secondary)]'
                }`}
                title="نمودار میله‌ای ستونی"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE SVG CHART */}
        <div className="relative w-full overflow-x-auto select-none pt-2">
          <div className="min-w-[620px]">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              <defs>
                {/* Line & Area Gradients */}
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B889A" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#1B889A" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B889A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1B889A" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Markers */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingY + (1 - ratio) * usableHeight;
                const value = Math.round(ratio * maxValue);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-[var(--card-border)]"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={chartWidth - paddingX + 8}
                      y={y + 4}
                      className="text-[10px] fill-[var(--text-secondary)] font-mono"
                      textAnchor="start"
                    >
                      {value.toLocaleString('fa-IR')}
                    </text>
                  </g>
                );
              })}

              {/* LINE CHART MODE */}
              {chartType === 'line' && (
                <>
                  {/* Area fill */}
                  <path d={areaD} fill="url(#trafficGradient)" />

                  {/* Stroke Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1B889A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Points */}
                  {points.map((p, idx) => {
                    const isHovered = hoveredIndex === idx;
                    return (
                      <g key={idx} className="cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 6 : 3.5}
                          className={`transition-all duration-150 ${
                            isHovered
                              ? 'fill-[#1B889A] stroke-white stroke-2'
                              : 'fill-[var(--card-bg)] stroke-[#1B889A] stroke-2'
                          }`}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {/* Invisible larger hit area for easy hover */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="16"
                          fill="transparent"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                      </g>
                    );
                  })}
                </>
              )}

              {/* BAR CHART MODE */}
              {chartType === 'bar' && (
                <>
                  {points.map((p, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const barWidth = Math.max(6, Math.min(22, usableWidth / (points.length * 1.5)));
                    const barHeight = chartHeight - paddingY - p.y;
                    return (
                      <g key={idx} className="cursor-pointer">
                        <rect
                          x={p.x - barWidth / 2}
                          y={p.y}
                          width={barWidth}
                          height={Math.max(2, barHeight)}
                          rx={barWidth / 3}
                          fill={isHovered ? '#1B889A' : 'url(#barGradient)'}
                          className="transition-all duration-150"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                      </g>
                    );
                  })}
                </>
              )}

              {/* X-Axis Labels */}
              {points.map((p, idx) => {
                // Show subset of labels for readability if dataset is long
                let showLabel = true;
                if (timeframe === 'hourly') showLabel = idx % 2 === 0 || idx === points.length - 1;
                if (timeframe === 'daily') showLabel = idx % 3 === 0 || idx === points.length - 1;

                if (!showLabel) return null;

                return (
                  <text
                    key={idx}
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-[var(--text-secondary)] font-mono select-none"
                  >
                    {p.label}
                  </text>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <div 
                className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-slate-900/95 text-white border border-[#1B889A] shadow-xl text-right text-xs space-y-1 transform -translate-x-1/2 -translate-y-full transition-transform animate-in fade-in zoom-in-95 duration-100"
                style={{
                  left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredIndex].y / chartHeight) * 100}%`,
                  marginTop: '-12px'
                }}
              >
                <div className="text-[10px] text-slate-300 font-bold">
                  {points[hoveredIndex].fullLabel}
                </div>
                <div className="flex items-center justify-between gap-3 text-sm font-extrabold text-[#2DD4BF]">
                  <span className="font-mono">{points[hoveredIndex].value.toLocaleString('fa-IR')}</span>
                  <span className="text-[10px] text-white">بازدیدکننده</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-secondary)] gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1B889A]" />
            <span>آمار به صورت بلادرنگ و تفکیک‌شده بر اساس سشن بازدیدکنندگان ثبت و همگام‌سازی می‌شود.</span>
          </div>
          <span className="font-mono text-[10px]">آخرین بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}</span>
        </div>
      </div>

    </div>
  );
};
