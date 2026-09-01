'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { 
  Sparkles, 
  Users, 
  BookOpen, 
  Target, 
  HeartHandshake, 
  FileText, 
  Volume2, 
  Video, 
  X, 
  ArrowLeft, 
  Clock, 
  Play, 
  UserCheck,
  Award,
  BookMarked
} from 'lucide-react';
import { TeamMember } from '@/types';

function AboutContent() {
  const searchParams = useSearchParams();
  const authorQuery = searchParams.get('author') || searchParams.get('member');
  const { teamMembers, articles, audios, videos, playAudio, aboutUsMission, aboutPillars, initFromStorage, fetchFromBackend } = useStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    initFromStorage();
    fetchFromBackend();
  }, [initFromStorage, fetchFromBackend]);

  useEffect(() => {
    if (authorQuery && teamMembers.length > 0) {
      const match = teamMembers.find(m => 
        m.name_fa.toLowerCase().includes(authorQuery.toLowerCase()) ||
        authorQuery.toLowerCase().includes(m.name_fa.toLowerCase())
      );
      if (match) {
        setSelectedMember(match);
      }
    }
  }, [authorQuery, teamMembers]);

  // Filter authored content for the selected team member
  const getMemberArticles = (name: string) => {
    if (!name) return [];
    return articles.filter((art) => 
      art.author_name_fa.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(art.author_name_fa.toLowerCase())
    );
  };

  const getMemberAudios = (name: string) => {
    if (!name) return [];
    return audios.filter((aud) => 
      aud.speaker_fa.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(aud.speaker_fa.toLowerCase())
    );
  };

  const getMemberVideos = (name: string) => {
    if (!name) return [];
    return videos.filter((vid) => 
      vid.speaker_fa.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(vid.speaker_fa.toLowerCase())
    );
  };

  const memberArticles = selectedMember ? getMemberArticles(selectedMember.name_fa) : [];
  const memberAudios = selectedMember ? getMemberAudios(selectedMember.name_fa) : [];
  const memberVideos = selectedMember ? getMemberVideos(selectedMember.name_fa) : [];
  const totalWorksCount = memberArticles.length + memberAudios.length + memberVideos.length;

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Mission Section */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 modern-card">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full teal-badge text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#1B889A]" />
            <span>رسالت و چشم‌انداز راهبردی</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian leading-tight">
            درباره مجله <span className="teal-gradient-text">ایدئولوژی مهدویت</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-serif-persian leading-relaxed whitespace-pre-line">
            {aboutUsMission}
          </p>
        </div>
      </section>

      {/* Core Objectives Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
            {aboutPillars?.[0]?.title || '۱. ارتقای بصیرت شناختی'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed whitespace-pre-line">
            {aboutPillars?.[0]?.description || 'توانمندسازی ذهن جامعه برای تحلیل مستقل اخبار، مقابله با جنگ شناختی رسانه‌های سلطه و بازشناسی حق از باطل.'}
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
            {aboutPillars?.[1]?.title || '۲. نقد مستدل مکاتب بشری'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed whitespace-pre-line">
            {aboutPillars?.[1]?.description || 'بررسی و نقد علمی مکاتب الحادی و ماده‌گرای غرب، و اثبات کارآمدی جهان‌بینی اسلام و فرهنگ مهدوی.'}
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
            {aboutPillars?.[2]?.title || '۳. تحکیم اخوت و بیداری'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-persian leading-relaxed whitespace-pre-line">
            {aboutPillars?.[2]?.description || 'تقویت همدلی، وحدت کلمه و ایجاد بیداری معنوی میان جوانان و نخبگان سراسر افغانستان و جهان.'}
          </p>
        </div>
      </section>

      {/* Team Members List */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-serif-persian">
            نویسندگان و پدیدآورندگان مجله
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-persian">
            جمعی از استادان، پژوهشگران و نویسندگان داوطلب افغانستان از نقاط مختلف جهان. جهت مشاهده بیوگرافی و تمام آثار روی هر کادر کلیک کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...teamMembers]
            .sort((a, b) => (a.order_index || 99) - (b.order_index || 99))
            .map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] p-6 rounded-3xl space-y-4 modern-card shadow-md transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* CIRCULAR ROUNDED AVATAR */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1B889A] shrink-0 shadow-md ring-2 ring-[#1B889A]/20">
                    {member.avatar_url && !member.avatar_url.includes('unsplash.com') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={member.avatar_url} 
                        alt={member.name_fa} 
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1B889A] text-white flex items-center justify-center font-extrabold text-2xl font-serif-persian">
                        {member.name_fa ? member.name_fa.trim().charAt(0) : 'ن'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors leading-snug">
                      {member.name_fa}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-semibold inline-block mt-1">
                      {member.role_fa}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-serif-persian line-clamp-3 whitespace-pre-line">
                  {member.bio_fa}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[#1B889A] font-bold">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>مشاهده بیوگرافی و آثار</span>
                </span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#1B889A]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Detail Modal Lightbox with Smooth Spring Scale Animation */}
      {selectedMember && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl modern-card relative transition-all duration-300 animate-in zoom-in-95 fade-in slide-in-from-bottom-4">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 left-5 p-2.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-white hover:bg-[#1B889A] transition-all shadow-md active:scale-95"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header Box */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[var(--card-border)] pb-6 text-center sm:text-right">
              {/* CIRCULAR ROUNDED PROFILE IMAGE IN MODAL */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#1B889A] shrink-0 shadow-2xl ring-4 ring-[#1B889A]/20">
                {selectedMember.avatar_url && !selectedMember.avatar_url.includes('unsplash.com') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={selectedMember.avatar_url} 
                    alt={selectedMember.name_fa} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#1B889A] text-white flex items-center justify-center font-extrabold text-4xl font-serif-persian">
                    {selectedMember.name_fa ? selectedMember.name_fa.trim().charAt(0) : 'ن'}
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                    {selectedMember.name_fa}
                  </h3>
                  <span className="px-3 py-1 rounded-full teal-badge text-xs font-bold">
                    {selectedMember.role_fa}
                  </span>
                </div>
                
                {selectedMember.specialization_fa && (
                  <p className="text-xs sm:text-sm text-[#1B889A] font-bold flex items-center justify-center sm:justify-start gap-1.5 font-serif-persian">
                    <Award className="w-4 h-4 text-[#1B889A]" />
                    <span>تخصص: {selectedMember.specialization_fa}</span>
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[var(--text-secondary)] font-bold">
                  <span className="px-3 py-1 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-[#1B889A]" />
                    <span>کل آثار: {totalWorksCount} مورد</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Biography Box with Generous Line-Height & Paragraph Spacing */}
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#1B889A]" />
                <span>بیوگرافی و معرفی جامع</span>
              </h4>
              <div className="bg-[var(--bg-color)] p-5 sm:p-6 rounded-2xl border border-[var(--card-border)] space-y-3 shadow-inner">
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-loose font-serif-persian whitespace-pre-line tracking-wide leading-relaxed">
                  {selectedMember.bio_fa}
                </p>
              </div>
            </div>

            {/* Authored Contents List */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-serif-persian border-b border-[var(--card-border)] pb-2 flex items-center justify-between">
                <span>آثار و مطالب منتشر شده در مجله ({totalWorksCount})</span>
              </h4>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {memberArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/content/${art.id}`}
                    onClick={() => setSelectedMember(null)}
                    className="p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] flex items-center justify-between text-xs sm:text-sm transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#1B889A] shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{art.title_fa}</span>
                    </div>
                    <span className="text-xs text-[#1B889A] font-bold shrink-0">{art.read_time_fa}</span>
                  </Link>
                ))}

                {memberAudios.map((aud) => (
                  <div
                    key={aud.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center justify-between text-xs sm:text-sm shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Volume2 className="w-4 h-4 text-[#1B889A] shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] truncate">{aud.title_fa}</span>
                    </div>
                    <button
                      onClick={() => { playAudio(aud); setSelectedMember(null); }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs transition-colors shadow-md shrink-0 flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>پخش صوتی</span>
                    </button>
                  </div>
                ))}

                {memberVideos.map((vid) => (
                  <Link
                    key={vid.id}
                    href="/media"
                    onClick={() => setSelectedMember(null)}
                    className="p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] flex items-center justify-between text-xs sm:text-sm transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Video className="w-4 h-4 text-[#1B889A] shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] group-hover:text-[#1B889A] transition-colors truncate">{vid.title_fa}</span>
                    </div>
                    <span className="text-xs text-[#1B889A] font-bold shrink-0">{vid.duration_fa}</span>
                  </Link>
                ))}

                {totalWorksCount === 0 && (
                  <p className="text-xs text-[var(--text-secondary)] text-center py-6 font-serif-persian">آثار الکترونیکی این نویسنده به زودی بارگذاری می‌گردد.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export function AboutPageClient() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400 font-serif-persian">در حال بارگذاری صفحه درباره ما...</div>}>
      <AboutContent />
    </Suspense>
  );
}
