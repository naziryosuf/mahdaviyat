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
  Users,
  Database,
  Mail,
  Check,
  Save,
  Lock,
  Smartphone,
  History,
  AlertCircle,
  RotateCcw,
  UserPlus,
  KeyRound,
  Info,
  HardDrive
} from 'lucide-react';
import { calculateReadingTimeFa } from '@/utils/readingTime';
import { Article, MagazineIssue, VideoItem, AudioItem, TeamMember, ContactMessage, CoHostUser } from '@/types';

export const AdminDashboardContent: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin, 
    coHosts,
    currentUser,
    addCoHost,
    updateCoHost,
    deleteCoHost,
    auditLogs,
    stagedChangesCount,
    hasUnsavedChanges,
    saveAllChangesToLive,
    discardStagedChanges,
    approvePendingItem,
    rejectPendingItem,
    articles, 
    magazineIssues, 
    videos, 
    audios,
    teamMembers,
    contactMessages,
    aboutUsMission,
    setAboutUsMission,
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
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useStore();

  const isSuperAdmin = currentUser?.is_super_admin || currentUser?.password_code === '190716';

  const userPerms = currentUser?.permissions || {
    can_manage_articles: true,
    can_manage_magazines: true,
    can_manage_videos: true,
    can_manage_audios: true,
    can_manage_team: true,
    can_manage_messages: true,
    can_manage_cohosts: isSuperAdmin,
    can_direct_publish: isSuperAdmin,
    can_manage_about: isSuperAdmin,
    can_view_storage: isSuperAdmin,
  };

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'articles' | 'magazines' | 'videos' | 'audios' | 'team' | 'messages' | 'cohosts' | 'audit_logs' | 'about' | 'storage'>('articles');

  // Save Success Notification Toast
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGlobalSave = async () => {
    setIsSaving(true);
    await saveAllChangesToLive();
    setIsSaving(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 4000);
  };

  // Co-Host Modal State
  const [showCoHostModal, setShowCoHostModal] = useState(false);
  const [editingCoHost, setEditingCoHost] = useState<CoHostUser | null>(null);
  const [coHostName, setCoHostName] = useState('');
  const [coHostPassword, setCoHostPassword] = useState('');
  const [coHostRole, setCoHostRole] = useState('ویرایشگر محتوا');
  const [permArticles, setPermArticles] = useState(true);
  const [permMagazines, setPermMagazines] = useState(true);
  const [permVideos, setPermVideos] = useState(true);
  const [permAudios, setPermAudios] = useState(true);
  const [permTeam, setPermTeam] = useState(false);
  const [permMessages, setPermMessages] = useState(false);
  const [permDirectPublish, setPermDirectPublish] = useState(false);
  const [permManageAbout, setPermManageAbout] = useState(false);
  const [permViewStorage, setPermViewStorage] = useState(false);

  const openAddCoHost = () => {
    setEditingCoHost(null);
    setCoHostName('');
    setCoHostPassword('');
    setCoHostRole('همکار / ویرایشگر محتوا');
    setPermArticles(true);
    setPermMagazines(true);
    setPermVideos(true);
    setPermAudios(true);
    setPermTeam(false);
    setPermMessages(false);
    setPermDirectPublish(false);
    setPermManageAbout(false);
    setPermViewStorage(false);
    setShowCoHostModal(true);
  };

  const openEditCoHost = (ch: CoHostUser) => {
    setEditingCoHost(ch);
    setCoHostName(ch.name_fa || '');
    setCoHostPassword(ch.password_code || '');
    setCoHostRole(ch.role_fa || '');
    setPermArticles(!!ch.permissions.can_manage_articles);
    setPermMagazines(!!ch.permissions.can_manage_magazines);
    setPermVideos(!!ch.permissions.can_manage_videos);
    setPermAudios(!!ch.permissions.can_manage_audios);
    setPermTeam(!!ch.permissions.can_manage_team);
    setPermMessages(!!ch.permissions.can_manage_messages);
    setPermDirectPublish(!!ch.permissions.can_direct_publish);
    setPermManageAbout(!!ch.permissions.can_manage_about);
    setPermViewStorage(!!ch.permissions.can_view_storage);
    setShowCoHostModal(true);
  };

  const handleSaveCoHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (coHostName && coHostPassword) {
      const perms = {
        can_manage_articles: permArticles,
        can_manage_magazines: permMagazines,
        can_manage_videos: permVideos,
        can_manage_audios: permAudios,
        can_manage_team: permTeam,
        can_manage_messages: permMessages,
        can_manage_cohosts: false,
        can_direct_publish: permDirectPublish,
        can_manage_about: permManageAbout,
        can_view_storage: permViewStorage,
      };

      if (editingCoHost) {
        updateCoHost(editingCoHost.id, {
          name_fa: coHostName,
          password_code: coHostPassword.trim(),
          role_fa: coHostRole || 'همکار',
          permissions: perms,
        });
      } else {
        addCoHost({
          name_fa: coHostName,
          password_code: coHostPassword.trim(),
          role_fa: coHostRole || 'همکار',
          is_super_admin: false,
          permissions: perms,
        });
      }
      setShowCoHostModal(false);
    }
  };

  // Pending items count calculation
  const pendingArticles = articles.filter(a => a.status === 'pending_approval');
  const pendingMagazines = magazineIssues.filter(m => m.status === 'pending_approval');
  const pendingVideos = videos.filter(v => v.status === 'pending_approval');
  const pendingAudios = audios.filter(a => a.status === 'pending_approval');
  const pendingTeam = teamMembers.filter(t => t.status === 'pending_approval');

  const totalPendingCount = pendingArticles.length + pendingMagazines.length + pendingVideos.length + pendingAudios.length + pendingTeam.length;

  // Storage Stats Calculation
  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const fullPayloadStr = JSON.stringify({
          articles,
          magazineIssues,
          videos,
          audios,
          teamMembers,
          contactMessages,
          aboutUsMission
        });
        const bytes = new Blob([fullPayloadStr]).size;
        setStorageUsedBytes(bytes);
        const pct = Math.min(Math.round((bytes / (5000 * 1024 * 1024)) * 100 * 100) / 100, 100);
        setStoragePercentage(pct);
      } catch (e) {}
    }
  }, [articles, magazineIssues, videos, audios, teamMembers, contactMessages, aboutUsMission]);

  // About Us Edit Form State
  const [aboutInputText, setAboutInputText] = useState(aboutUsMission);
  const [aboutSavedNotify, setAboutSavedNotify] = useState(false);

  useEffect(() => {
    setAboutInputText(aboutUsMission);
  }, [aboutUsMission]);

  const handleSaveAboutUs = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = aboutInputText.trim();
    if (trimmed) {
      setAboutUsMission(trimmed);
      setAboutSavedNotify(true);
      setTimeout(() => setAboutSavedNotify(false), 3500);
    }
  };

  // Article Modal & Form State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState<'سرمقاله‌ها' | 'تحلیل‌ها' | 'نقد مکاتب' | 'شناخت مهدویت'>('تحلیل‌ها');
  const [artAuthor, setArtAuthor] = useState('میر الهام الدین سادات');
  const [artReadTime, setArtReadTime] = useState('۷ دقیقه');
  const [artImage, setArtImage] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');

  useEffect(() => {
    if (artContent) {
      setArtReadTime(calculateReadingTimeFa(artContent));
    }
  }, [artContent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(passcode);
    if (!success) {
      setErrorMsg('کد عبور وارد شده نادرست است.');
    } else {
      setErrorMsg('');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 space-y-6 modern-card shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">
              ورود به پنل مدیریت دیتابیس
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              برای دسترسی به بخش‌های مجاز، کد عبور مدیریت را وارد نمایید.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="کد ورودی مدیر (پیش‌فرض: 190716)"
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
    <div className="space-y-8 py-6 relative">
      
      {/* Toast Save Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 left-6 z-[9999] bg-[#1B889A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-white/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div>
            <h4 className="text-xs font-bold font-serif-persian">تغییرات با موفقیت ذخیره شد</h4>
            <p className="text-[11px] text-white/80">تمام ویرایش‌ها و پست‌ها روی سایت اصلی آنلاین شدند.</p>
          </div>
        </div>
      )}

      {/* STICKY TOP HEADER WITH GLOBAL SAVE BUTTON */}
      <div className="bg-[var(--card-bg)] border-2 border-[#1B889A]/40 rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 modern-card shadow-xl sticky top-20 z-40 backdrop-blur-md bg-opacity-95">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                خوش آمدید {isSuperAdmin ? 'M. Nazir Yosuf' : (currentUser?.name_fa || 'مدیر سامانه')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] sm:text-[11px] font-bold">
                {isSuperAdmin ? 'سردبیر ارشد (NAZIF YOSUF) 👑' : currentUser?.role_fa || 'همکار'}
              </span>
            </div>
            <p className="text-xs text-[#1B889A] font-bold mt-0.5 flex items-center gap-1.5">
              <span>{isSuperAdmin ? 'کنترل کامل وب‌سایت و سطح دسترسی‌ها' : `ورود با اکانت: ${currentUser?.name_fa}`}</span>
            </p>
          </div>
        </div>

        {/* TOP RIGHT ACTIONS: SAVE & DISCARD & LOGOUT */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <button
                onClick={discardStagedChanges}
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="لغو تغییرات ذخیره‌نشده"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">انصراف</span>
              </button>
            )}

            <button
              onClick={handleGlobalSave}
              disabled={isSaving}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                hasUnsavedChanges
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse shadow-emerald-600/30'
                  : 'bg-[#1B889A] hover:bg-[#156d7b] text-white shadow-[#1B889A]/30'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره و انتشار روی وب‌سایت (SAVE)'}</span>
              {stagedChangesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-[10px] font-black flex items-center justify-center">
                  {stagedChangesCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            title="خروج از پنل"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>

      </div>

      {/* NAVIGATION TABS FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Pending Approvals Queue Tab */}
          {(isSuperAdmin || userPerms.can_direct_publish) && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'pending' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-[var(--card-bg)] text-amber-500 border border-amber-500/30 hover:border-amber-500'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>در انتظار تایید</span>
              {totalPendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-bounce">
                  {totalPendingCount}
                </span>
              )}
            </button>
          )}

          {/* Audit Logs Tab */}
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'audit_logs' 
                ? 'bg-[#1B889A] text-white shadow-md' 
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:text-[var(--text-primary)]'
            }`}
          >
            <History className="w-4 h-4 text-[#1B889A]" />
            <span>تاریخچه فعالیت‌ها & دیوایس‌ها</span>
          </button>

          {/* Articles */}
          {userPerms.can_manage_articles && (
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'articles' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مقالات ({articles.length})</span>
            </button>
          )}

          {/* Magazines */}
          {userPerms.can_manage_magazines && (
            <button
              onClick={() => setActiveTab('magazines')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'magazines' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>مجله‌ها ({magazineIssues.length})</span>
            </button>
          )}

          {/* Videos */}
          {userPerms.can_manage_videos && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'videos' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>ویدیوها ({videos.length})</span>
            </button>
          )}

          {/* Audios */}
          {userPerms.can_manage_audios && (
            <button
              onClick={() => setActiveTab('audios')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'audios' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>پادکست‌ها ({audios.length})</span>
            </button>
          )}

          {/* Team Members */}
          {userPerms.can_manage_team && (
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'team' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>اعضای تیم ({teamMembers.length})</span>
            </button>
          )}

          {/* Messages */}
          {userPerms.can_manage_messages && (
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'messages' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>پیام‌ها ({contactMessages.length})</span>
            </button>
          )}

          {/* EDIT ABOUT US - STRICTLY CONTROLLED PERMISSION */}
          {(isSuperAdmin || userPerms.can_manage_about) && (
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'about' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>ویرایش «درباره ما»</span>
            </button>
          )}

          {/* VIEW STORAGE STATS - STRICTLY CONTROLLED PERMISSION */}
          {(isSuperAdmin || userPerms.can_view_storage) && (
            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'storage' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>فضای دیتابیس</span>
            </button>
          )}

          {/* CO-HOSTS MANAGEMENT - ONLY SUPER ADMIN */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('cohosts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'cohosts' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>مدیریت همکاران ({coHosts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ABOUT US EDIT TAB CONTENT */}
      {activeTab === 'about' && (isSuperAdmin || userPerms.can_manage_about) && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <Info className="w-5 h-5 text-[#1B889A]" />
              <span>ویرایش بیانیه و ماموریت «درباره ما»</span>
            </h2>
            <form onSubmit={handleSaveAboutUs} className="space-y-4">
              <textarea
                rows={5}
                value={aboutInputText}
                onChange={(e) => setAboutInputText(e.target.value)}
                className="w-full p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-sm text-[var(--text-primary)] leading-relaxed focus:outline-none focus:border-[#1B889A]"
              ></textarea>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs"
              >
                ذخیره بیانیه در پیش‌نویس
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STORAGE STATS TAB CONTENT */}
      {activeTab === 'storage' && (isSuperAdmin || userPerms.can_view_storage) && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#1B889A]" />
            <span>آمار مصرفی فضای دیتابیس و حافظه</span>
          </h2>
          <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-2 text-xs">
            <div className="flex justify-between">
              <span>حجم دیتابیس فعلی:</span>
              <span className="font-bold font-mono text-[#1B889A]">{(storageUsedBytes / 1024).toFixed(1)} KB</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full bg-[#1B889A]" style={{ width: `${Math.max(storagePercentage, 2)}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB CONTENT */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl modern-card">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <History className="w-5 h-5 text-[#1B889A]" />
                <span>تاریخچه فعالیت‌ها، تغییرات و دستگاه‌های استفاده‌شده</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                در این بخش تمامی اقدامات انجام شده توسط مدیر ارشد و دستیاران به همراه ساعت دقیق و دیوایس مربوطه ثبت می‌گردد.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#1B889A]/50 transition-all">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#1B889A]/15 text-[#1B889A] font-bold text-xs">
                      {log.user_name} ({log.user_role})
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      log.action_type === 'افزودن' ? 'bg-emerald-500/15 text-emerald-400' :
                      log.action_type === 'ویرایش' ? 'bg-amber-500/15 text-amber-400' :
                      log.action_type === 'حذف' ? 'bg-red-500/15 text-red-400' : 'bg-purple-500/15 text-purple-400'
                    }`}>
                      {log.action_type} {log.item_type}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">
                    {log.target_title}
                  </h4>

                  {log.status_note && (
                    <p className="text-xs text-[var(--text-secondary)] italic">
                      توضیحات: {log.status_note}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 text-left dir-ltr">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1B889A] bg-[#1B889A]/10 px-2.5 py-1 rounded-xl">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{log.device_info}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                    ⏰ {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENDING APPROVALS QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-3xl space-y-2">
            <h2 className="text-lg font-bold text-amber-400 font-serif-persian flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>پست‌ها و ویرایش‌های در انتظار تایید مدیر ارشد (NAZIF YOSUF)</span>
            </h2>
          </div>

          {totalPendingCount === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl">
              هیچ پستی در انتظار تایید وجود ندارد.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map(art => (
                <div key={art.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">مقاله</span>
                    <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">{art.title_fa}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">ارسال شده توسط: {art.submitted_by_name} | دیوایس: {art.submitted_device}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approvePendingItem('article', art.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>تایید و انتشار</span>
                    </button>
                    <button
                      onClick={() => rejectPendingItem('article', art.id)}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs flex items-center gap-1.5 hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>رد درخواست</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CO-HOST MANAGEMENT TAB */}
      {activeTab === 'cohosts' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl modern-card">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#1B889A]" />
                <span>مدیریت همکاران، پسوردها و تعیین دقیق سطوح دسترسی (Co-Hosts)</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                کنترل کامل دسترسی همکاران به مقالات، درباره ما، فضای دیتابیس و مجوز انتشار مستقیم.
              </p>
            </div>

            <button
              onClick={openAddCoHost}
              className="px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>افزودن همکار جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coHosts.map((ch) => (
              <div key={ch.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4 hover:border-[#1B889A] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B889A]/15 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] font-bold">
                      {ch.name_fa.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                        <span>{ch.name_fa}</span>
                        {ch.is_super_admin && <span className="text-xs text-amber-400">👑 (ادمین ارشد)</span>}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">{ch.role_fa}</p>
                    </div>
                  </div>

                  {!ch.is_super_admin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCoHost(ch)}
                        className="p-2 rounded-lg bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] hover:border-[#1B889A] border border-[var(--card-border)] transition-all"
                        title="ویرایش سطح دسترسی"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCoHost(ch.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all"
                        title="حذف همکار"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[var(--card-border)] text-xs">
                  <div className="flex items-center justify-between text-[var(--text-secondary)] font-mono">
                    <span>کد عبور ورود:</span>
                    <span className="font-bold text-[#1B889A] bg-[#1B889A]/10 px-2 py-0.5 rounded-md">{ch.password_code}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span>ویرایش درباره ما:</span>
                    <span className={`font-bold ${ch.permissions.can_manage_about ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ch.permissions.can_manage_about ? 'مجاز' : 'غیرمجاز'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span>مشاهده فضای دیتابیس:</span>
                    <span className={`font-bold ${ch.permissions.can_view_storage ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ch.permissions.can_view_storage ? 'مجاز' : 'غیرمجاز'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CO-HOST MODAL WITH ALL PERMISSION TOGGLES */}
      {showCoHostModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-lg w-full space-y-5 modern-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1B889A]" />
                <span>{editingCoHost ? 'ویرایش همکار' : 'افزودن همکار جدید'}</span>
              </h3>
              <button onClick={() => setShowCoHostModal(false)} className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoHost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">نام همکار:</label>
                <input
                  type="text"
                  value={coHostName}
                  onChange={(e) => setCoHostName(e.target.value)}
                  placeholder="مثلا: محمد رضایی"
                  required
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">کد عبور اختصاصی (پسورد):</label>
                <input
                  type="text"
                  value={coHostPassword}
                  onChange={(e) => setCoHostPassword(e.target.value)}
                  placeholder="کد ۶ رقمی ورود"
                  required
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-mono"
                />
              </div>

              {/* GRANULAR PERMISSIONS */}
              <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
                <span className="block font-bold text-[#1B889A] mb-1">تعیین سطوح دسترسی همکار:</span>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permArticles}
                    onChange={(e) => setPermArticles(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به بخش مقالات</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permMagazines}
                    onChange={(e) => setPermMagazines(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به بخش مجله‌ها</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permManageAbout}
                    onChange={(e) => setPermManageAbout(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به ویرایش بخش «درباره ما»</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permViewStorage}
                    onChange={(e) => setPermViewStorage(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به مشاهده «فضای دیتابیس & آمار»</span>
                </label>

                <div className="p-3 rounded-xl bg-[#1B889A]/10 border border-[#1B889A]/30 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={permDirectPublish}
                      onChange={(e) => setPermDirectPublish(e.target.checked)}
                      className="w-4 h-4 accent-[#1B889A] rounded"
                    />
                    <span>مجوز انتشار مستقیم بدون نیاز به تایید NAZIF YOSUF</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--card-border)]">
                <button
                  type="button"
                  onClick={() => setShowCoHostModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold hover:bg-[#156d7b]"
                >
                  ذخیره اطلاعات همکار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && userPerms.can_manage_articles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">مدیریت مقالات</h2>
            <button
              onClick={() => { setEditingArticle(null); setShowArticleModal(true); }}
              className="px-4 py-2 rounded-xl bg-[#1B889A] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مقاله جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {articles.map(art => (
              <div key={art.id} className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{art.title_fa}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{art.author_name_fa} | {art.category_fa}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteArticle(art.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
