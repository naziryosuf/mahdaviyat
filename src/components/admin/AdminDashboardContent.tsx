'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit,
  FileText, 
  Newspaper, 
  Video, 
  Volume2, 
  LogOut, 
  CheckCircle2, 
  X, 
  Upload, 
  Sparkles,
  Globe,
  Link as LinkIcon,
  Users,
  HardDrive,
  Database,
  Mail,
  Check,
  ImageIcon,
  Paperclip,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Copy
} from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';
import { Article, MagazineIssue, VideoItem, AudioItem, TeamMember, ContactMessage } from '@/types';

export const AdminDashboardContent: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin, 
    articles, 
    magazineIssues, 
    videos, 
    audios,
    infographics,
    teamMembers,
    contactMessages,
    addArticle,
    updateArticle,
    deleteArticle,
    addMagazineIssue,
    updateMagazineIssue,
    deleteMagazineIssue,
    addVideo,
    updateVideo,
    deleteVideo,
    addAudio,
    updateAudio,
    deleteAudio,
    addInfographic,
    deleteInfographic,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    markContactRead,
    deleteContactMessage
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'articles' | 'magazines' | 'videos' | 'audios' | 'infographics' | 'team' | 'messages'>('team');

  // Track expanded long messages IDs
  const [expandedMessageIds, setExpandedMessageIds] = useState<string[]>([]);
  // Track copied message state
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const toggleExpandMessage = (id: string) => {
    setExpandedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyMessage = (msg: ContactMessage) => {
    if (typeof window !== 'undefined') {
      const fullText = `نام فرستنده: ${msg.sender_name}\nایمیل: ${msg.email}\nموضوع: ${msg.subject}\nتاریخ: ${msg.created_at}\n\nمتن پیام:\n${msg.message}`;
      navigator.clipboard.writeText(fullText);
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 3000);
    }
  };

  // Storage Stats State
  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dataStr = localStorage.getItem('mahdism_app_store_v3') || '';
        const bytes = new Blob([dataStr]).size;
        setStorageUsedBytes(bytes);
        const pct = Math.min(Math.round((bytes / (5 * 1024 * 1024)) * 100 * 10) / 10, 100);
        setStoragePercentage(pct);
      } catch (e) {}
    }
  }, [articles, magazineIssues, videos, audios, infographics, teamMembers, contactMessages]);

  // Create Modals State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Edit State Targets
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);

  // Form State: Article
  const [artTitle, setArtTitle] = useState('');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState<'سرمقاله‌ها' | 'تحلیل‌ها' | 'نقد مکاتب' | 'شناخت مهدویت'>('تحلیل‌ها');
  const [artAuthor, setArtAuthor] = useState('');
  const [artReadTime, setArtReadTime] = useState('۷ دقیقه');
  const [artImage, setArtImage] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');

  // Form State: Video
  const [vidTitle, setVidTitle] = useState('');
  const [vidDesc, setVidDesc] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidCategory, setVidCategory] = useState('وبینارها');
  const [vidSpeaker, setVidSpeaker] = useState('میر الهام الدین سادات');
  const [vidDuration, setVidDuration] = useState('۳۰ دقیقه');
  const [vidThumbnail, setVidThumbnail] = useState('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80');

  // Form State: Team Member / Staff
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamAvatar, setTeamAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
  const [teamSpec, setTeamSpec] = useState('علوم اسلامی');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(passcode);
    if (!ok) {
      setErrorMsg('کد امنیتی مدیریت اشتباه است. (کد پیش‌فرض: 123456)');
    } else {
      setErrorMsg('');
    }
  };

  // Article Handlers
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (artTitle && artContent) {
      if (editingArticle) {
        updateArticle(editingArticle.id, {
          title_fa: artTitle,
          excerpt_fa: artExcerpt || artContent.slice(0, 150),
          content_fa: artContent,
          category_fa: artCategory,
          author_name_fa: artAuthor || 'هیئت تحریریه',
          read_time_fa: artReadTime,
          image_url: artImage
        });
        setEditingArticle(null);
      } else {
        addArticle({
          title_fa: artTitle,
          slug: `art-${Date.now()}`,
          excerpt_fa: artExcerpt || artContent.slice(0, 150),
          content_fa: artContent,
          category_fa: artCategory,
          author_name_fa: artAuthor || 'هیئت تحریریه',
          author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          read_time_fa: artReadTime,
          published_at: new Date().toLocaleDateString('fa-IR'),
          image_url: artImage,
          featured: false,
        });
        setShowArticleModal(false);
      }
      resetForm();
    }
  };

  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtTitle(art.title_fa);
    setArtExcerpt(art.excerpt_fa);
    setArtContent(art.content_fa);
    setArtCategory(art.category_fa);
    setArtAuthor(art.author_name_fa);
    setArtReadTime(art.read_time_fa);
    setArtImage(art.image_url);
    setShowArticleModal(true);
  };

  // Video Handlers
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (vidTitle && vidUrl) {
      const parsedEmbed = parseVideoUrl(vidUrl);
      if (editingVideo) {
        updateVideo(editingVideo.id, {
          title_fa: vidTitle,
          description_fa: vidDesc,
          video_url: vidUrl,
          thumbnail_url: parsedEmbed.thumbnailUrl || vidThumbnail,
          duration_fa: vidDuration,
          category_fa: vidCategory,
          speaker_fa: vidSpeaker,
        });
        setEditingVideo(null);
      } else {
        addVideo({
          title_fa: vidTitle,
          description_fa: vidDesc,
          video_url: vidUrl,
          thumbnail_url: parsedEmbed.thumbnailUrl || vidThumbnail,
          duration_fa: vidDuration,
          category_fa: vidCategory,
          speaker_fa: vidSpeaker,
          published_at: new Date().toLocaleDateString('fa-IR'),
          featured: false,
          timestamps: [],
          download_url: vidUrl,
        });
        setShowVideoModal(false);
      }
      resetForm();
    }
  };

  const openEditVideo = (vid: VideoItem) => {
    setEditingVideo(vid);
    setVidTitle(vid.title_fa);
    setVidDesc(vid.description_fa);
    setVidUrl(vid.video_url);
    setVidCategory(vid.category_fa);
    setVidSpeaker(vid.speaker_fa);
    setVidDuration(vid.duration_fa);
    setVidThumbnail(vid.thumbnail_url);
    setShowVideoModal(true);
  };

  // Team Member Handlers
  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName && teamRole) {
      if (editingTeam) {
        updateTeamMember(editingTeam.id, {
          name_fa: teamName,
          role_fa: teamRole,
          bio_fa: teamBio,
          avatar_url: teamAvatar,
          specialization_fa: teamSpec
        });
        setEditingTeam(null);
      } else {
        addTeamMember({
          name_fa: teamName,
          role_fa: teamRole,
          bio_fa: teamBio,
          avatar_url: teamAvatar,
          specialization_fa: teamSpec
        });
        setShowTeamModal(false);
      }
      resetForm();
    }
  };

  const openEditTeam = (tm: TeamMember) => {
    setEditingTeam(tm);
    setTeamName(tm.name_fa);
    setTeamRole(tm.role_fa);
    setTeamBio(tm.bio_fa);
    setTeamAvatar(tm.avatar_url);
    setTeamSpec(tm.specialization_fa);
    setShowTeamModal(true);
  };

  const resetForm = () => {
    setArtTitle(''); setArtContent(''); setArtExcerpt('');
    setVidTitle(''); setVidUrl(''); setVidDesc('');
    setTeamName(''); setTeamRole(''); setTeamBio('');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 space-y-6 modern-card shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif-persian">
              ورود به پنل مدیریت دیتابیس مجله
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              مشاهده و دانلود فایل‌های ارسالی کاربران، پیام‌ها، مقالات و اعضا
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="کد ورودی مدیر (پیش‌فرض: 123456)"
                className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-center font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#1B889A]"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-sm transition-all shadow-md active:scale-95"
            >
              ورود به پنل کامل مدیریت
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Admin Header */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 modern-card shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">
              پنل مدیریت دیتابیس و اعضای مجله
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">نمایش تصاویر پرتره اعضا به صورت سیاه و سفید با کیفیت بالا</p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>خروج از پنل</span>
        </button>
      </div>

      {/* Navigation Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'team' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>اعضا & مشخصات افراد ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'messages' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>پیام‌های دریافتی کاربران ({contactMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'articles' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>مقالات ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('magazines')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'magazines' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>شماره‌های مجله ({magazineIssues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'videos' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>ویدیوها ({videos.length})</span>
          </button>
        </div>

        {/* Action Creation Buttons */}
        {activeTab === 'team' && (
          <button onClick={() => { setEditingTeam(null); resetForm(); setShowTeamModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md">
            <Plus className="w-4 h-4" />
            <span>افزودن عضو جدید هیئت تحریریه</span>
          </button>
        )}
      </div>

      {/* TEAM MEMBERS TABLE WITH BLACK & WHITE AVATARS */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((tm) => (
              <div key={tm.id} className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-4 modern-card shadow-md group">
                <div className="flex items-center gap-3">
                  
                  {/* BLACK AND WHITE AVATAR */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#1B889A] shrink-0 bg-stone-900 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={tm.avatar_url} 
                      alt="" 
                      className="w-full h-full object-cover filter grayscale contrast-125 brightness-95 group-hover:grayscale-0 transition-all duration-300" 
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#1B889A] font-bold block">{tm.role_fa}</span>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{tm.name_fa}</h3>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate max-w-[180px]">{tm.bio_fa}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => openEditTeam(tm)} className="p-2 rounded-xl bg-[#1B889A]/10 text-[#1B889A] hover:bg-[#1B889A]/20 transition-colors" title="ویرایش مشخصات فرد">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTeamMember(tm.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {contactMessages.map((msg) => {
              const isExpanded = expandedMessageIds.includes(msg.id);
              const isLongMessage = msg.message.length > 250 || msg.message.includes('\n');
              const isCopied = copiedMsgId === msg.id;

              return (
                <div key={msg.id} className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-4 modern-card shadow-lg">
                  
                  {/* TOP HEADER: SENDER INFO & ACTION BUTTONS AT THE TOP */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#1B889A]" />
                        <h3 className="text-base font-extrabold text-[var(--text-primary)] font-serif-persian">
                          {msg.sender_name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] font-bold">
                          {msg.status === 'new' ? 'جدید' : 'خوانده شده'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-mono dir-ltr text-right">
                        ایمیل: <a href={`mailto:${msg.email}`} className="text-[#1B889A] hover:underline font-bold">{msg.email}</a> • تاریخ: {msg.created_at}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyMessage(msg)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] hover:bg-[#1B889A]/20 font-bold text-xs transition-all active:scale-95 shadow-sm"
                        title="کپی متن کامل پیام"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? 'کپی شد' : 'کپی متن پیام'}</span>
                      </button>

                      <button
                        onClick={() => deleteContactMessage(msg.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold text-xs transition-all active:scale-95 shadow-sm"
                        title="حذف این پیام"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف پیام</span>
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl">
                    <h4 className="text-xs font-extrabold text-[#1B889A] flex items-center gap-1.5">
                      <span>موضوع:</span>
                      <span className="text-[var(--text-primary)]">{msg.subject}</span>
                    </h4>
                  </div>

                  {/* FORMATTED MESSAGE BODY */}
                  <div className="p-5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-3">
                    <div 
                      className={`text-sm text-[var(--text-primary)] font-serif-persian leading-loose whitespace-pre-wrap break-words max-w-full ${
                        !isExpanded && isLongMessage ? 'line-clamp-4' : ''
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>

                  {/* ATTACHED FILE DOWNLOAD SECTION */}
                  {msg.file_url && (
                    <div className="p-4 bg-[var(--bg-color)] border border-[#1B889A]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)] min-w-0">
                        <Paperclip className="w-5 h-5 text-[#1B889A] shrink-0" />
                        <div>
                          <span className="text-[11px] text-[var(--text-secondary)] block">فایل پیوست‌شده همراه پیام:</span>
                          <span className="font-bold text-[var(--text-primary)] truncate block">{msg.file_name || 'فایل ضمیمه'}</span>
                        </div>
                      </div>

                      <a
                        href={msg.file_url}
                        download={msg.file_name || 'فایل_پیوست'}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold transition-all shadow-md shrink-0 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>دانلود فایل پیوست</span>
                      </a>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                {editingTeam ? 'ویرایش مشخصات فرد/عضو' : 'افزودن عضو جدید هیئت تحریریه'}
              </h3>
              <button onClick={() => setShowTeamModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTeam} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">نام و تخلص:</label>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="مثال: میر الهام الدین سادات" required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">سمت / مسئولیت:</label>
                <input type="text" value={teamRole} onChange={(e) => setTeamRole(e.target.value)} placeholder="مثال: سردبیر مجله" required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">بیوگرافی خلاصه:</label>
                <textarea value={teamBio} onChange={(e) => setTeamBio(e.target.value)} placeholder="توضیحات بیوگرافی..." rows={3} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">لینک تصویر آواتار:</label>
                <input type="url" value={teamAvatar} onChange={(e) => setTeamAvatar(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#1B889A] text-white text-xs font-bold">
                {editingTeam ? 'بروزرسانی مشخصات' : 'افزودن به اعضا'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
