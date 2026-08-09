'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  UserCheck
} from 'lucide-react';
import { TeamMember, Article, AudioItem, VideoItem } from '@/types';

export default function AboutPage() {
  const { teamMembers, articles, audios, videos, playAudio } = useStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filter authored content for the selected team member
  const getMemberArticles = (name: string) => {
    return articles.filter((art) => 
      art.author_name_fa.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(art.author_name_fa.toLowerCase())
    );
  };

  const getMemberAudios = (name: string) => {
    return audios.filter((aud) => 
      aud.speaker_fa.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(aud.speaker_fa.toLowerCase())
    );
  };

  const getMemberVideos = (name: string) => {
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
          <p className="text-base text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            مجله «ایدئولوژی مهدویت» یک پایگاه پژوهشی و تحلیلی مستقل است که با هدف ارتقای آگاهی شناختی، نقد مستدل مکاتب بشری معاصر (مانند اومانیسم، لیبرالیسم، ماتریالیسم و پوزیتیویسم) و تبیین عقلانی و وحیانی جهان‌بینی مهدویت تأسیس گردیده است.
          </p>
        </div>
      </section>

      {/* Core Objectives Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">۱. ارتقای بصیرت شناختی</h3>
          <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            توانمندسازی ذهن جامعه برای تحلیل مستقل اخبار، مقابله با جنگ شناختی رسانه‌های سلطه و بازشناسی حق از باطل.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">۲. نقد مستدل مکاتب بشری</h3>
          <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            بررسی نقاط ضعف، تناقضات درونی و بن‌بست‌های اخلاقی و اجتماعی مکاتب انسان‌ساخت بر پایه منطق و عقلانیت.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">۳. ترسیم افق مهدویت</h3>
          <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            معرفی الگوهای عملی حکومت عادلانه جهانی، کرامت واقعی انسان و ایجاد امید پویا در دل منتظران.
          </p>
        </div>
      </section>

      {/* Editorial Board / Team Members */}
      <section className="space-y-6">
        <div className="border-b border-[var(--card-border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Users className="w-6 h-6 text-[#1B889A]" />
              <span>اعضای هیئت تحریریه و پژوهشگران</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              با کلیک روی نام هر عضو، فهرست کامل تمامی آثار، مقالات و سخنرانی‌های مربوط به او نمایش داده می‌شود.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => {
            const count = getMemberArticles(member.name_fa).length + getMemberAudios(member.name_fa).length + getMemberVideos(member.name_fa).length;

            return (
              <div 
                key={member.id} 
                onClick={() => setSelectedMember(member)}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl text-center space-y-4 modern-card shadow-xl cursor-pointer group hover:border-[#1B889A] transition-all"
              >
                
                {/* BLACK AND WHITE AVATAR */}
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto border-2 border-[#1B889A]/50 shadow-xl relative bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={member.avatar_url} 
                    alt={member.name_fa} 
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-95 group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors">
                    {member.name_fa}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full teal-badge font-bold inline-block mt-1">
                    {member.role_fa}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed line-clamp-3">
                  {member.bio_fa}
                </p>

                {/* CLICK TO VIEW WORKS BUTTON */}
                <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs font-bold text-[#1B889A]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5" />
                    تعداد آثار: {count > 0 ? `${count} اثر` : 'مشاهده پرونده'}
                  </span>
                  <span className="group-hover:underline flex items-center gap-1">
                    <span>مشاهده نوشته‌ها</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AUTHOR WORKS MODAL / DRAWER */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl modern-card">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1B889A] shrink-0 bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedMember.avatar_url} alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] font-bold">
                    {selectedMember.role_fa}
                  </span>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] font-serif-persian mt-1">
                    آثار و نوشته‌های {selectedMember.name_fa}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">تخصص: {selectedMember.specialization_fa}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedMember(null)}
                className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-[var(--text-primary)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bio summary */}
            <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl">
              <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed">
                {selectedMember.bio_fa}
              </p>
            </div>

            {/* Authored Content Sections */}
            <div className="space-y-6">
              
              {/* 1. Articles List */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  <FileText className="w-4 h-4 text-[#1B889A]" />
                  <span>مقالات و یادداشت‌ها ({memberArticles.length})</span>
                </h4>

                {memberArticles.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] p-3 bg-[var(--bg-color)] rounded-xl">مقاله اختصاصی ثبت نشده است.</p>
                ) : (
                  <div className="space-y-2.5">
                    {memberArticles.map((art) => (
                      <div key={art.id} className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2 hover:border-[#1B889A] transition-colors">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded teal-badge font-bold">{art.category_fa}</span>
                          <span className="text-[var(--text-secondary)] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#1B889A]" />
                            {art.read_time_fa}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{art.title_fa}</h5>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{art.excerpt_fa}</p>
                        <div className="pt-2 flex justify-end">
                          <Link 
                            href={`/content/${art.id}`} 
                            onClick={() => setSelectedMember(null)}
                            className="text-xs text-[#1B889A] font-bold hover:underline flex items-center gap-1"
                          >
                            <span>مطالعه کامل مقاله</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Audio Podcasts */}
              {memberAudios.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <Volume2 className="w-4 h-4 text-[#1B889A]" />
                    <span>پادکست‌ها و درس‌گفتارهای صوتی ({memberAudios.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {memberAudios.map((aud) => (
                      <div key={aud.id} className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-bold text-[var(--text-primary)] font-serif-persian">{aud.title_fa}</h5>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{aud.duration_fa}</p>
                        </div>
                        <button
                          onClick={() => { playAudio(aud); setSelectedMember(null); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1B889A] text-white text-xs font-bold shrink-0 shadow-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>پخش صوتی</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Videos */}
              {memberVideos.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)] font-serif-persian flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <Video className="w-4 h-4 text-[#A32838]" />
                    <span>نشست‌های ویدیویی ({memberVideos.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {memberVideos.map((vid) => (
                      <Link 
                        key={vid.id} 
                        href="/media?tab=videos" 
                        onClick={() => setSelectedMember(null)}
                        className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-3 hover:border-[#A32838] transition-colors block"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[var(--text-primary)] font-serif-persian">{vid.title_fa}</h5>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{vid.duration_fa}</p>
                        </div>
                        <span className="text-xs text-[#A32838] font-bold">مشاهده ویدیو</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
