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
  const { teamMembers, articles, audios, videos, playAudio, aboutUsMission } = useStore();
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
            بررسی و نقد علمی مکاتب الحادی و ماده‌گرای غرب، و اثبات کارآمدی جهان‌بینی اسلام و فرهنگ مهدوی.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-3 modern-card shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">۳. تحکیم اخوت و بیداری</h3>
          <p className="text-xs text-[var(--text-secondary)] font-serif-persian leading-relaxed">
            تقویت همدلی، وحدت کلمه و ایجاد بیداری معنوی میان جوانان و نخبگان سراسر افغانستان و جهان.
          </p>
        </div>
      </section>

      {/* Team Members List */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-serif-persian">
            نویسندگان و پدیدآورندگان مجله
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            جمعی از استادان، پژوهشگران و نویسندگان داوطلب افغانستان از نقاط مختلف جهان.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] p-6 rounded-3xl space-y-4 modern-card shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#1B889A] shrink-0 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.avatar_url} alt="" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian group-hover:text-[#1B889A] transition-colors">
                    {member.name_fa}
                  </h3>
                  <span className="text-xs text-[#1B889A] font-semibold block mt-0.5">{member.role_fa}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {member.bio_fa}
              </p>

              <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[#1B889A] font-bold">
                <span>مشاهده آثار و بیوگرافی</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl modern-card relative">
            
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 left-5 p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-white hover:border-[#A32838] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5 border-b border-[var(--card-border)] pb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#1B889A] shrink-0 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedMember.avatar_url} alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">
                  {selectedMember.name_fa}
                </h3>
                <p className="text-xs text-[#1B889A] font-bold">{selectedMember.role_fa}</p>
                <p className="text-xs text-[var(--text-secondary)]">تخصص: {selectedMember.specialization_fa}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#1B889A]" />
                <span>بیوگرافی و فعالیت‌های پژوهشی</span>
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-serif-persian bg-[var(--bg-color)] p-4 rounded-2xl border border-[var(--card-border)]">
                {selectedMember.bio_fa}
              </p>
            </div>

            {/* Authored Contents List */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian border-b border-[var(--card-border)] pb-2 flex items-center justify-between">
                <span>آثار و مطالب در مجله ({totalWorksCount})</span>
              </h4>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {memberArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/content/${art.id}`}
                    onClick={() => setSelectedMember(null)}
                    className="p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] flex items-center justify-between text-xs transition-colors block"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1B889A] shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] truncate max-w-xs">{art.title_fa}</span>
                    </div>
                    <span className="text-[#1B889A] font-semibold">{art.read_time_fa}</span>
                  </Link>
                ))}

                {memberAudios.map((aud) => (
                  <div
                    key={aud.id}
                    className="p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#1B889A] shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] truncate max-w-xs">{aud.title_fa}</span>
                    </div>
                    <button
                      onClick={() => { playAudio(aud); setSelectedMember(null); }}
                      className="px-3 py-1 rounded-xl bg-[#1B889A] text-white font-bold text-[11px]"
                    >
                      پخش صوتی
                    </button>
                  </div>
                ))}

                {memberVideos.map((vid) => (
                  <Link
                    key={vid.id}
                    href="/media?tab=videos"
                    onClick={() => setSelectedMember(null)}
                    className="p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#A32838] flex items-center justify-between text-xs transition-colors block"
                  >
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#A32838] shrink-0" />
                      <span className="font-bold text-[var(--text-primary)] truncate max-w-xs">{vid.title_fa}</span>
                    </div>
                    <span className="text-[#A32838] font-semibold">{vid.duration_fa}</span>
                  </Link>
                ))}

                {totalWorksCount === 0 && (
                  <p className="text-xs text-[var(--text-secondary)] text-center py-4">آثار الکترونیکی این نویسنده به زودی بارگذاری می‌گردد.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
