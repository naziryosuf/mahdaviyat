import { create } from 'zustand';
import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage, CoHostUser, AuditLogItem } from '../types';
import { initialArticles, initialMagazineIssues, initialVideos, initialAudios, initialInfographics, initialTeamMembers, initialContactMessages, initialCoHosts } from '../data/initialData';
import { Language } from '../data/translations';
import { supabase } from '@/lib/supabase';
import { getDeviceDetails } from '@/utils/deviceDetector';

export type ThemeMode = 'dark' | 'light';

interface AppState {
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Trilingual language state
  language: Language;
  setLanguage: (lang: Language) => void;

  // Editable About Us Mission Text
  aboutUsMission: string;
  setAboutUsMission: (desc: string) => void;

  // Designer Portfolio Website URL & Name (footer link)
  designerName: string;
  setDesignerName: (name: string) => void;
  designerWebsiteUrl: string;
  setDesignerWebsiteUrl: (url: string) => void;

  // Database tables
  articles: Article[];
  magazineIssues: MagazineIssue[];
  videos: VideoItem[];
  audios: AudioItem[];
  infographics: InfographicItem[];
  teamMembers: TeamMember[];
  contactMessages: ContactMessage[];

  // Audit Logs & Device Activity Tracking
  auditLogs: AuditLogItem[];
  addAuditLog: (
    action_type: 'افزودن' | 'ویرایش' | 'حذف' | 'تایید و انتشار' | 'رد درخواست',
    target_title: string,
    item_type: 'مقاله' | 'مجله' | 'ویدیو' | 'صوتی' | 'عضو تیم' | 'همکار',
    status_note?: string
  ) => void;

  // Staged Unsaved Changes (Global Save Button)
  stagedChangesCount: number;
  hasUnsavedChanges: boolean;
  saveAllChangesToLive: () => Promise<void>;
  discardStagedChanges: () => void;

  // Admin Security Gate & Co-Host RBAC
  isAdminLoggedIn: boolean;
  adminPasscode: string;
  coHosts: CoHostUser[];
  currentUser: CoHostUser | null;
  loginAdmin: (passcode: string) => Promise<boolean>;
  logoutAdmin: () => void;
  addCoHost: (coHost: Omit<CoHostUser, 'id' | 'created_at'>) => void;
  updateCoHost: (id: string, updates: Partial<CoHostUser>) => void;
  deleteCoHost: (id: string) => void;

  // Pending Approvals Queue Actions (Super Admin / Authorized Co-Host)
  approvePendingItem: (itemType: 'article' | 'magazine' | 'video' | 'audio' | 'team', id: string) => void;
  rejectPendingItem: (itemType: 'article' | 'magazine' | 'video' | 'audio' | 'team', id: string) => void;

  // Active Audio Player State
  currentAudio: AudioItem | null;
  isPlayingAudio: boolean;
  playAudio: (audio: AudioItem) => void;
  pauseAudio: () => void;
  toggleAudioPlay: () => void;
  closeAudioPlayer: () => void;

  // Bookmarks
  bookmarkedArticles: string[];
  toggleBookmark: (articleId: string) => void;

  // Admin Full CRUD Actions
  addArticle: (article: Omit<Article, 'id' | 'views'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  addMagazineIssue: (issue: Omit<MagazineIssue, 'id' | 'download_count'>) => Promise<void>;
  updateMagazineIssue: (id: string, issue: Partial<MagazineIssue>) => void;
  deleteMagazineIssue: (id: string) => void;

  addVideo: (video: Omit<VideoItem, 'id' | 'views'>) => void;
  updateVideo: (id: string, video: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;

  addAudio: (audio: Omit<AudioItem, 'id' | 'plays'>) => void;
  updateAudio: (id: string, audio: Partial<AudioItem>) => void;
  deleteAudio: (id: string) => void;

  addInfographic: (infographic: Omit<InfographicItem, 'id'>) => void;
  deleteInfographic: (id: string) => void;

  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) => Promise<void>;
  markContactRead: (id: string) => void;
  deleteContactMessage: (id: string) => void;

  fetchFromBackend: () => Promise<void>;
  initFromStorage: () => void;
}

const defaultMissionText = 'مجلۀ «ایدئولوژی مهدویت» بستری است برای ارائه شناخت پیرامون مهم‌ترین موضوعات: خداشناسی، خودشناسی، جامعه‌شناسی، هستی‌شناسی و سایر موضوعات تاریخی؛ به هدف ایجاد بیداری معنوی و اجتماعی. این مجله توسط جمعی از نویسندگان آزاد افغانستان از سراسر جهان تشکیل شده و به صورت کاملاً داوطلبانه و غیرانتفاعی اداره می‌شود.';

export const useStore = create<AppState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_theme_user_set', nextTheme);
    }
  },
  setTheme: (t: ThemeMode) => {
    set({ theme: t });
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  language: 'fa',
  setLanguage: (lang: Language) => {
    set({ language: lang });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_lang', lang);
    }
  },

  aboutUsMission: defaultMissionText,
  setAboutUsMission: (desc: string) => {
    set((state) => ({ 
      aboutUsMission: desc,
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    try {
      supabase.from('site_settings').upsert({ key: 'about_mission', value: desc }).then(() => {});
    } catch {}
  },

  designerName: 'M. Nazir Yosufi',
  setDesignerName: (name: string) => {
    set((state) => ({ 
      designerName: name,
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_designer_name', name);
    }
    try {
      supabase.from('site_settings').upsert({ key: 'designer_name', value: name }).then(() => {});
    } catch {}
  },

  designerWebsiteUrl: 'https://github.com/naziryosuf',
  setDesignerWebsiteUrl: (url: string) => {
    set((state) => ({ 
      designerWebsiteUrl: url,
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_designer_url', url);
    }
    try {
      supabase.from('site_settings').upsert({ key: 'designer_url', value: url }).then(() => {});
    } catch {}
  },

  articles: initialArticles,
  magazineIssues: initialMagazineIssues,
  videos: initialVideos,
  audios: initialAudios,
  infographics: initialInfographics,
  teamMembers: initialTeamMembers,
  contactMessages: initialContactMessages,

  // Audit Logs State
  auditLogs: [
    {
      id: 'log-1',
      user_name: 'M. Nazir Yosuf',
      user_role: 'سردبیر ارشد',
      action_type: 'تایید و انتشار',
      target_title: 'بیانیه افتتاحیه ایدئولوژی مهدویت',
      item_type: 'مقاله',
      timestamp: '۱۴۰۴/۰۵/۲۲ - ۱۲:۰۰',
      time_only: '۱۲:۰۰',
      device_info: 'Windows Desktop (Chrome)',
      status_note: 'تایید مستقیم توسط ادمین کل'
    }
  ],

  addAuditLog: (action_type, target_title, item_type, status_note) => {
    const currentUser = get().currentUser;
    const now = new Date();
    const timeOnly = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const fullDate = `${now.toLocaleDateString('fa-IR')} - ${timeOnly}`;
    const device = getDeviceDetails();

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      user_name: currentUser?.name_fa || 'M. Nazir Yosuf',
      user_role: currentUser?.role_fa || 'مدیر',
      action_type,
      target_title,
      item_type,
      timestamp: fullDate,
      time_only: timeOnly,
      device_info: device,
      status_note,
    };

    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs]
    }));

    try {
      supabase.from('audit_logs').upsert(newLog).then(() => {});
    } catch {}
  },

  // Global Save State
  stagedChangesCount: 0,
  hasUnsavedChanges: false,

  saveAllChangesToLive: async () => {
    const state = get();
    // Save to LocalStorage fallback
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_articles', JSON.stringify(state.articles));
      localStorage.setItem('mahdism_magazines', JSON.stringify(state.magazineIssues));
      localStorage.setItem('mahdism_videos', JSON.stringify(state.videos));
      localStorage.setItem('mahdism_audios', JSON.stringify(state.audios));
      localStorage.setItem('mahdism_team', JSON.stringify(state.teamMembers));
      localStorage.setItem('mahdism_audit_logs', JSON.stringify(state.auditLogs));
      localStorage.setItem('mahdism_about_mission', state.aboutUsMission);
      localStorage.setItem('mahdism_designer_name', state.designerName);
      localStorage.setItem('mahdism_designer_url', state.designerWebsiteUrl);
    }

    // Sync permanently to Supabase Cloud Database
    try {
      await Promise.all([
        supabase.from('articles').upsert(state.articles),
        supabase.from('magazine_issues').upsert(state.magazineIssues),
        supabase.from('video_items').upsert(state.videos),
        supabase.from('audio_items').upsert(state.audios),
        supabase.from('team_members').upsert(state.teamMembers),
        supabase.from('co_hosts').upsert(state.coHosts),
        supabase.from('site_settings').upsert([
          { key: 'designer_name', value: state.designerName },
          { key: 'designer_url', value: state.designerWebsiteUrl },
          { key: 'about_mission', value: state.aboutUsMission }
        ]),
        supabase.from('audit_logs').upsert(state.auditLogs)
      ]);
    } catch (e) {
      console.log('Supabase Save Sync Error:', e);
    }

    // Reset staged count
    set({ stagedChangesCount: 0, hasUnsavedChanges: false });
  },

  discardStagedChanges: () => {
    get().fetchFromBackend();
    set({ stagedChangesCount: 0, hasUnsavedChanges: false });
  },

  isAdminLoggedIn: false,
  adminPasscode: '190716',
  coHosts: initialCoHosts,
  currentUser: null,

  loginAdmin: async (passcode: string) => {
    const trimmed = passcode.trim();
    const coHosts = get().coHosts;
    const foundUser = coHosts.find(u => u.password_code === trimmed);

    if (foundUser) {
      set({ isAdminLoggedIn: true, currentUser: foundUser });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mahdism_admin_auth', 'true');
        localStorage.setItem('mahdism_current_user', JSON.stringify(foundUser));
      }
      return true;
    }

    if (trimmed === '190716' || trimmed === get().adminPasscode) {
      const superAdminUser: CoHostUser = {
        id: 'cohost-super-admin',
        name_fa: 'M. Nazir Yosuf',
        password_code: '190716',
        role_fa: 'مدیر کل و سردبیر ارشد',
        created_at: '۱۴۰۴/۰۵/۰۱',
        is_super_admin: true,
        permissions: {
          can_manage_articles: true,
          can_manage_magazines: true,
          can_manage_videos: true,
          can_manage_audios: true,
          can_manage_team: true,
          can_manage_messages: true,
          can_manage_cohosts: true,
          can_direct_publish: true,
        }
      };
      set({ isAdminLoggedIn: true, currentUser: superAdminUser });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mahdism_admin_auth', 'true');
        localStorage.setItem('mahdism_current_user', JSON.stringify(superAdminUser));
      }
      return true;
    }

    return false;
  },

  logoutAdmin: () => {
    set({ isAdminLoggedIn: false, currentUser: null });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mahdism_admin_auth');
      localStorage.removeItem('mahdism_current_user');
    }
  },

  addCoHost: (coHostData) => {
    const newCoHost: CoHostUser = {
      ...coHostData,
      id: `cohost-${Date.now()}`,
      created_at: new Date().toLocaleDateString('fa-IR'),
    };
    const updated = [...get().coHosts, newCoHost];
    set((state) => ({ 
      coHosts: updated,
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    try {
      supabase.from('co_hosts').upsert(newCoHost).then(() => {});
    } catch {}
    get().addAuditLog('افزودن', newCoHost.name_fa, 'همکار', `نقش: ${newCoHost.role_fa}`);
  },

  updateCoHost: (id, updates) => {
    const updated = get().coHosts.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch));
    set((state) => ({ 
      coHosts: updated,
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    const target = updated.find(c => c.id === id);
    if (target) {
      try {
        supabase.from('co_hosts').upsert(target).then(() => {});
      } catch {}
      get().addAuditLog('ویرایش', target.name_fa, 'همکار', 'ویرایش سطح دسترسی همکار');
    }
  },

  deleteCoHost: (id) => {
    const target = get().coHosts.find(ch => ch.id === id);
    if (target?.is_super_admin || target?.password_code === '190716') {
      return;
    }
    const updated = get().coHosts.filter((ch) => ch.id !== id);
    set((state) => ({ 
      coHosts: updated,
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    try {
      supabase.from('co_hosts').delete().eq('id', id).then(() => {});
    } catch {}
    if (target) {
      get().addAuditLog('حذف', target.name_fa, 'همکار', 'حذف حساب همکار');
    }
  },

  // Pending Approvals Queue
  approvePendingItem: (itemType, id) => {
    let title = '';
    if (itemType === 'article') {
      const art = get().articles.find(a => a.id === id);
      if (art) {
        title = art.title_fa;
        const updated = { ...art, status: 'published' as const };
        supabase.from('articles').upsert(updated).then(() => {});
      }
      set((state) => ({
        articles: state.articles.map(a => a.id === id ? { ...a, status: 'published' } : a),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'magazine') {
      const mag = get().magazineIssues.find(m => m.id === id);
      if (mag) {
        title = mag.title_fa;
        const updated = { ...mag, status: 'published' as const };
        supabase.from('magazine_issues').upsert(updated).then(() => {});
      }
      set((state) => ({
        magazineIssues: state.magazineIssues.map(m => m.id === id ? { ...m, status: 'published' } : m),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'video') {
      const vid = get().videos.find(v => v.id === id);
      if (vid) {
        title = vid.title_fa;
        const updated = { ...vid, status: 'published' as const };
        supabase.from('video_items').upsert(updated).then(() => {});
      }
      set((state) => ({
        videos: state.videos.map(v => v.id === id ? { ...v, status: 'published' } : v),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'audio') {
      const aud = get().audios.find(a => a.id === id);
      if (aud) {
        title = aud.title_fa;
        const updated = { ...aud, status: 'published' as const };
        supabase.from('audio_items').upsert(updated).then(() => {});
      }
      set((state) => ({
        audios: state.audios.map(a => a.id === id ? { ...a, status: 'published' } : a),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'team') {
      const tm = get().teamMembers.find(t => t.id === id);
      if (tm) {
        title = tm.name_fa;
        const updated = { ...tm, status: 'published' as const };
        supabase.from('team_members').upsert(updated).then(() => {});
      }
      set((state) => ({
        teamMembers: state.teamMembers.map(t => t.id === id ? { ...t, status: 'published' } : t),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    }

    get().addAuditLog('تایید و انتشار', title, itemType === 'article' ? 'مقاله' : itemType === 'magazine' ? 'مجله' : itemType === 'video' ? 'ویدیو' : itemType === 'audio' ? 'صوتی' : 'عضو تیم', 'تایید نهایی توسط مدیر ارشد (Nazir Yosuf)');
  },

  rejectPendingItem: (itemType, id) => {
    let title = '';
    if (itemType === 'article') {
      const art = get().articles.find(a => a.id === id);
      if (art) title = art.title_fa;
      supabase.from('articles').delete().eq('id', id).then(() => {});
      set((state) => ({
        articles: state.articles.filter(a => a.id !== id),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'magazine') {
      const mag = get().magazineIssues.find(m => m.id === id);
      if (mag) title = mag.title_fa;
      supabase.from('magazine_issues').delete().eq('id', id).then(() => {});
      set((state) => ({
        magazineIssues: state.magazineIssues.filter(m => m.id !== id),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'video') {
      const vid = get().videos.find(v => v.id === id);
      if (vid) title = vid.title_fa;
      supabase.from('video_items').delete().eq('id', id).then(() => {});
      set((state) => ({
        videos: state.videos.filter(v => v.id !== id),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'audio') {
      const aud = get().audios.find(a => a.id === id);
      if (aud) title = aud.title_fa;
      supabase.from('audio_items').delete().eq('id', id).then(() => {});
      set((state) => ({
        audios: state.audios.filter(a => a.id !== id),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    } else if (itemType === 'team') {
      const tm = get().teamMembers.find(t => t.id === id);
      if (tm) title = tm.name_fa;
      supabase.from('team_members').delete().eq('id', id).then(() => {});
      set((state) => ({
        teamMembers: state.teamMembers.filter(t => t.id !== id),
        stagedChangesCount: state.stagedChangesCount + 1,
        hasUnsavedChanges: true
      }));
    }

    get().addAuditLog('رد درخواست', title, itemType === 'article' ? 'مقاله' : itemType === 'magazine' ? 'مجله' : itemType === 'video' ? 'ویدیو' : itemType === 'audio' ? 'صوتی' : 'عضو تیم', 'رد درخواست انتشار توسط مدیر ارشد');
  },

  currentAudio: null,
  isPlayingAudio: false,
  playAudio: (audio) => set({ currentAudio: audio, isPlayingAudio: true }),
  pauseAudio: () => set({ isPlayingAudio: false }),
  toggleAudioPlay: () => set((state) => ({ isPlayingAudio: !state.isPlayingAudio })),
  closeAudioPlayer: () => set({ currentAudio: null, isPlayingAudio: false }),

  bookmarkedArticles: [],
  toggleBookmark: (articleId) => {
    const current = get().bookmarkedArticles;
    const exists = current.includes(articleId);
    const updated = exists ? current.filter((id) => id !== articleId) : [...current, articleId];
    set({ bookmarkedArticles: updated });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_bookmarks', JSON.stringify(updated));
    }
  },

  addArticle: async (articleData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const initialStatus = canDirect ? 'published' : 'pending_approval';

    const newArticle: Article = {
      ...articleData,
      id: `art-${Date.now()}`,
      views: 1,
      status: initialStatus,
      submitted_by_name: currentUser?.name_fa || 'M. Nazir Yosuf',
      submitted_at: new Date().toLocaleDateString('fa-IR'),
      submitted_device: getDeviceDetails(),
    };

    set((state) => ({ 
      articles: [newArticle, ...state.articles],
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));

    try {
      await supabase.from('articles').upsert(newArticle);
    } catch (e) {
      console.error('Supabase addArticle error:', e);
    }

    get().addAuditLog(
      'افزودن', 
      newArticle.title_fa, 
      'مقاله', 
      canDirect ? 'انتشار مستقیم' : 'در انتظار تایید ادمین ارشد (Nazir Yosuf)'
    );
  },

  updateArticle: async (id, articleData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const nextStatus = canDirect ? 'published' : 'pending_approval';

    let updatedArt: Article | null = null;
    set((state) => ({
      articles: state.articles.map((art) => {
        if (art.id === id) {
          updatedArt = { 
            ...art, 
            ...articleData,
            status: nextStatus,
            submitted_by_name: currentUser?.name_fa || 'M. Nazir Yosuf',
            submitted_at: new Date().toLocaleDateString('fa-IR'),
            submitted_device: getDeviceDetails()
          };
          return updatedArt;
        }
        return art;
      }),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));

    if (updatedArt) {
      try {
        await supabase.from('articles').upsert(updatedArt);
      } catch (e) {
        console.error('Supabase updateArticle error:', e);
      }
    }

    const target = get().articles.find(a => a.id === id);
    if (target) {
      get().addAuditLog(
        'ویرایش', 
        target.title_fa, 
        'مقاله', 
        canDirect ? 'ویرایش و انتشار مستقیم' : 'ویرایش شده - در انتظار تایید ادمین ارشد'
      );
    }
  },

  deleteArticle: async (id) => {
    const target = get().articles.find(a => a.id === id);
    set((state) => ({
      articles: state.articles.filter((art) => art.id !== id),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    try {
      await supabase.from('articles').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteArticle error:', e);
    }
    if (target) {
      get().addAuditLog('حذف', target.title_fa, 'مقاله');
    }
  },

  addMagazineIssue: async (issueData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const initialStatus = canDirect ? 'published' : 'pending_approval';

    let cover = issueData.cover_image && !issueData.cover_image.startsWith('file://') && issueData.cover_image.trim() !== ''
      ? issueData.cover_image
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

    let pdf = issueData.pdf_url && !issueData.pdf_url.startsWith('file://') && issueData.pdf_url.trim() !== ''
      ? issueData.pdf_url
      : '/downloads/mahdism_issue_1.pdf';

    const newIssue: MagazineIssue = {
      ...issueData,
      id: `mag-${Date.now()}`,
      cover_image: cover,
      pdf_url: pdf,
      download_count: 0,
      status: initialStatus,
      submitted_by_name: currentUser?.name_fa || 'M. Nazir Yosuf',
      submitted_at: new Date().toLocaleDateString('fa-IR'),
      submitted_device: getDeviceDetails(),
    };

    set((state) => ({ 
      magazineIssues: [newIssue, ...state.magazineIssues],
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));

    const dbPayload: Record<string, any> = {
      id: newIssue.id,
      issue_number: newIssue.issue_number,
      title_fa: newIssue.title_fa,
      description_fa: newIssue.description_fa,
      publish_date_fa: newIssue.publish_date_fa,
      cover_image: newIssue.cover_image,
      pdf_url: newIssue.pdf_url,
      download_count: newIssue.download_count,
      featured: newIssue.featured,
      status: newIssue.status,
      submitted_by_name: newIssue.submitted_by_name,
      submitted_at: newIssue.submitted_at,
      submitted_device: newIssue.submitted_device,
      tags: newIssue.tags,
      pages: newIssue.pages
    };

    if (newIssue.cover_position) dbPayload.cover_position = newIssue.cover_position;
    if (newIssue.author_name_fa) dbPayload.author_name_fa = newIssue.author_name_fa;
    if (newIssue.author_title_fa) dbPayload.author_title_fa = newIssue.author_title_fa;
    if (newIssue.page_count_fa) dbPayload.page_count_fa = newIssue.page_count_fa;

    try {
      let { error } = await supabase.from('magazine_issues').upsert(dbPayload);
      if (error && error.code === 'PGRST204') {
        delete dbPayload.author_name_fa;
        delete dbPayload.author_title_fa;
        delete dbPayload.cover_position;
        delete dbPayload.page_count_fa;
        const retryRes = await supabase.from('magazine_issues').upsert(dbPayload);
        error = retryRes.error;
      }
      if (error) {
        console.error('Supabase addMagazineIssue error:', error.message);
        throw new Error(`خطای دیتابیس Supabase: ${error.message}`);
      }
    } catch (e: any) {
      console.error('Supabase addMagazineIssue exception:', e);
      throw e;
    }

    get().addAuditLog(
      'افزودن', 
      newIssue.title_fa, 
      'مجله', 
      canDirect ? 'انتشار مستقیم' : 'در انتظار تایید ادمین ارشد'
    );
  },

  updateMagazineIssue: async (id, issueData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const nextStatus = canDirect ? 'published' : 'pending_approval';

    let updatedMag: MagazineIssue | null = null;
    set((state) => ({
      magazineIssues: state.magazineIssues.map((iss) => {
        if (iss.id === id) {
          updatedMag = { 
            ...iss, 
            ...issueData,
            cover_image: issueData.cover_image && !issueData.cover_image.startsWith('file://') && issueData.cover_image.trim() !== '' ? issueData.cover_image : (iss.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'),
            pdf_url: issueData.pdf_url && !issueData.pdf_url.startsWith('file://') && issueData.pdf_url.trim() !== '' ? issueData.pdf_url : (iss.pdf_url || '/downloads/mahdism_issue_1.pdf'),
            status: nextStatus
          };
          return updatedMag;
        }
        return iss;
      }),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));

    if (updatedMag) {
      const dbPayload: Record<string, any> = {
        id: (updatedMag as MagazineIssue).id,
        issue_number: (updatedMag as MagazineIssue).issue_number,
        title_fa: (updatedMag as MagazineIssue).title_fa,
        description_fa: (updatedMag as MagazineIssue).description_fa,
        publish_date_fa: (updatedMag as MagazineIssue).publish_date_fa,
        cover_image: (updatedMag as MagazineIssue).cover_image,
        pdf_url: (updatedMag as MagazineIssue).pdf_url,
        download_count: (updatedMag as MagazineIssue).download_count,
        featured: (updatedMag as MagazineIssue).featured,
        status: (updatedMag as MagazineIssue).status,
        submitted_by_name: (updatedMag as MagazineIssue).submitted_by_name,
        submitted_at: (updatedMag as MagazineIssue).submitted_at,
        submitted_device: (updatedMag as MagazineIssue).submitted_device,
        tags: (updatedMag as MagazineIssue).tags,
        pages: (updatedMag as MagazineIssue).pages
      };

      if ((updatedMag as MagazineIssue).cover_position) dbPayload.cover_position = (updatedMag as MagazineIssue).cover_position;
      if ((updatedMag as MagazineIssue).author_name_fa) dbPayload.author_name_fa = (updatedMag as MagazineIssue).author_name_fa;
      if ((updatedMag as MagazineIssue).author_title_fa) dbPayload.author_title_fa = (updatedMag as MagazineIssue).author_title_fa;
      if ((updatedMag as MagazineIssue).page_count_fa) dbPayload.page_count_fa = (updatedMag as MagazineIssue).page_count_fa;

      try {
        let { error } = await supabase.from('magazine_issues').upsert(dbPayload);
        if (error && error.code === 'PGRST204') {
          delete dbPayload.author_name_fa;
          delete dbPayload.author_title_fa;
          delete dbPayload.cover_position;
          delete dbPayload.page_count_fa;
          const retryRes = await supabase.from('magazine_issues').upsert(dbPayload);
          error = retryRes.error;
        }
        if (error) {
          console.error('Supabase updateMagazineIssue error:', error.message);
          throw new Error(`خطای دیتابیس Supabase: ${error.message}`);
        }
      } catch (e: any) {
        console.error('Supabase updateMagazineIssue exception:', e);
        throw e;
      }
    }

    const target = get().magazineIssues.find(m => m.id === id);
    if (target) {
      get().addAuditLog('ویرایش', target.title_fa, 'مجله');
    }
  },

  deleteMagazineIssue: (id) => {
    const target = get().magazineIssues.find(m => m.id === id);
    set((state) => ({
      magazineIssues: state.magazineIssues.filter((iss) => iss.id !== id),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('magazine_issues').delete().eq('id', id).then(() => {});
    if (target) {
      get().addAuditLog('حذف', target.title_fa, 'مجله');
    }
  },

  addVideo: (videoData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const initialStatus = canDirect ? 'published' : 'pending_approval';

    const newVid: VideoItem = {
      ...videoData,
      id: `vid-${Date.now()}`,
      views: 1,
      status: initialStatus,
      submitted_by_name: currentUser?.name_fa || 'M. Nazir Yosuf',
      submitted_at: new Date().toLocaleDateString('fa-IR'),
      submitted_device: getDeviceDetails(),
    };
    set((state) => ({ 
      videos: [newVid, ...state.videos],
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('video_items').upsert(newVid).then(() => {});
    get().addAuditLog(
      'افزودن', 
      newVid.title_fa, 
      'ویدیو', 
      canDirect ? 'انتشار مستقیم' : 'در انتظار تایید ادمین ارشد'
    );
  },

  updateVideo: (id, videoData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const nextStatus = canDirect ? 'published' : 'pending_approval';

    let updatedVid: VideoItem | null = null;
    set((state) => ({
      videos: state.videos.map((v) => {
        if (v.id === id) {
          updatedVid = { 
            ...v, 
            ...videoData,
            status: nextStatus
          };
          return updatedVid;
        }
        return v;
      }),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    if (updatedVid) {
      supabase.from('video_items').upsert(updatedVid).then(() => {});
    }
    const target = get().videos.find(v => v.id === id);
    if (target) {
      get().addAuditLog('ویرایش', target.title_fa, 'ویدیو');
    }
  },

  deleteVideo: (id) => {
    const target = get().videos.find(v => v.id === id);
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('video_items').delete().eq('id', id).then(() => {});
    if (target) {
      get().addAuditLog('حذف', target.title_fa, 'ویدیو');
    }
  },

  addAudio: (audioData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const initialStatus = canDirect ? 'published' : 'pending_approval';

    const newAud: AudioItem = {
      ...audioData,
      id: `aud-${Date.now()}`,
      plays: 1,
      status: initialStatus,
      submitted_by_name: currentUser?.name_fa || 'M. Nazir Yosuf',
      submitted_at: new Date().toLocaleDateString('fa-IR'),
      submitted_device: getDeviceDetails(),
    };
    set((state) => ({ 
      audios: [newAud, ...state.audios],
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('audio_items').upsert(newAud).then(() => {});
    get().addAuditLog(
      'افزودن', 
      newAud.title_fa, 
      'صوتی', 
      canDirect ? 'انتشار مستقیم' : 'در انتظار تایید ادمین ارشد'
    );
  },

  updateAudio: (id, audioData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const nextStatus = canDirect ? 'published' : 'pending_approval';

    let updatedAud: AudioItem | null = null;
    set((state) => ({
      audios: state.audios.map((a) => {
        if (a.id === id) {
          updatedAud = { 
            ...a, 
            ...audioData,
            status: nextStatus 
          };
          return updatedAud;
        }
        return a;
      }),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    if (updatedAud) {
      supabase.from('audio_items').upsert(updatedAud).then(() => {});
    }
    const target = get().audios.find(a => a.id === id);
    if (target) {
      get().addAuditLog('ویرایش', target.title_fa, 'صوتی');
    }
  },

  deleteAudio: (id) => {
    const target = get().audios.find(a => a.id === id);
    set((state) => ({
      audios: state.audios.filter((a) => a.id !== id),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('audio_items').delete().eq('id', id).then(() => {});
    if (target) {
      get().addAuditLog('حذف', target.title_fa, 'صوتی');
    }
  },

  addInfographic: (infoData) => {
    const newInfo: InfographicItem = {
      ...infoData,
      id: `info-${Date.now()}`,
    };
    set((state) => ({ 
      infographics: [newInfo, ...state.infographics],
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('infographic_items').upsert(newInfo).then(() => {});
  },

  deleteInfographic: (id) => {
    set((state) => ({
      infographics: state.infographics.filter((i) => i.id !== id),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('infographic_items').delete().eq('id', id).then(() => {});
  },

  addTeamMember: (memberData) => {
    const currentUser = get().currentUser;
    const isSuper = currentUser?.is_super_admin || currentUser?.password_code === '190716';
    const canDirect = isSuper || currentUser?.permissions.can_direct_publish;
    const initialStatus = canDirect ? 'published' : 'pending_approval';

    const newMember: TeamMember = {
      ...memberData,
      id: `team-${Date.now()}`,
      status: initialStatus,
      submitted_by_name: currentUser?.name_fa || 'M. Nazir Yosuf',
      submitted_at: new Date().toLocaleDateString('fa-IR'),
      submitted_device: getDeviceDetails(),
    };
    set((state) => ({ 
      teamMembers: [...state.teamMembers, newMember],
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('team_members').upsert(newMember).then(() => {});
    get().addAuditLog(
      'افزودن', 
      newMember.name_fa, 
      'عضو تیم', 
      canDirect ? 'انتشار مستقیم' : 'در انتظار تایید ادمین ارشد'
    );
  },

  updateTeamMember: (id, memberData) => {
    let updatedMember: TeamMember | null = null;
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => {
        if (m.id === id) {
          updatedMember = { ...m, ...memberData };
          return updatedMember;
        }
        return m;
      }),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    if (updatedMember) {
      supabase.from('team_members').upsert(updatedMember).then(() => {});
    }
    const target = get().teamMembers.find(t => t.id === id);
    if (target) {
      get().addAuditLog('ویرایش', target.name_fa, 'عضو تیم');
    }
  },

  deleteTeamMember: (id) => {
    const target = get().teamMembers.find(t => t.id === id);
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== id),
      stagedChangesCount: state.stagedChangesCount + 1,
      hasUnsavedChanges: true
    }));
    supabase.from('team_members').delete().eq('id', id).then(() => {});
    if (target) {
      get().addAuditLog('حذف', target.name_fa, 'عضو تیم');
    }
  },

  addContactMessage: async (msgData) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      sent_at: new Date().toLocaleDateString('fa-IR'),
      status: 'unread',
    };
    set((state) => ({ contactMessages: [newMsg, ...state.contactMessages] }));
    try {
      await supabase.from('contact_messages').upsert(newMsg);
    } catch {}
  },

  markContactRead: (id) => {
    set((state) => ({
      contactMessages: state.contactMessages.map((m) => (m.id === id ? { ...m, status: 'read' } : m)),
    }));
    try {
      supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    } catch {}
  },

  deleteContactMessage: (id) => {
    set((state) => ({
      contactMessages: state.contactMessages.filter((m) => m.id !== id),
    }));
    try {
      supabase.from('contact_messages').delete().eq('id', id);
    } catch {}
  },

  fetchFromBackend: async () => {
    try {
      // 1. Articles
      const { data: supaArticles, error: artErr } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (!artErr) {
        set({ articles: supaArticles || [] });
      }

      // 2. Magazine Issues
      const { data: supaMagazines, error: magErr } = await supabase.from('magazine_issues').select('*').order('issue_number', { ascending: true });
      if (!magErr && supaMagazines) {
        const stopWords = ['در', 'به', 'از', 'با', 'و', 'یا', 'بر', 'که', 'را', 'ان', 'این'];
        const sanitizedMags = supaMagazines.map((mag: MagazineIssue) => {
          const isBadCover = !mag.cover_image || mag.cover_image.startsWith('file://') || mag.cover_image.trim() === '';
          const isBadPdf = !mag.pdf_url || mag.pdf_url.startsWith('file://') || mag.pdf_url.includes('فایل انتخاب شد') || mag.pdf_url.trim() === '';

          return {
            ...mag,
            cover_image: isBadCover ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' : mag.cover_image,
            pdf_url: isBadPdf ? '/downloads/mahdism_issue_1.pdf' : mag.pdf_url,
            tags: Array.isArray(mag.tags) 
              ? mag.tags.map((t: string) => String(t).trim().replace(/^#/, '')).filter((t: string) => t.length > 1 && !stopWords.includes(t)).map((t: string) => `#${t}`)
              : ['#شماره_نخست', '#ایدئولوژی_مهدویت']
          };
        });
        set({ magazineIssues: sanitizedMags });
      }

      // 3. Videos
      const { data: supaVideos, error: vidErr } = await supabase.from('video_items').select('*');
      if (!vidErr) {
        set({ videos: supaVideos || [] });
      }

      // 4. Audios
      const { data: supaAudios, error: audErr } = await supabase.from('audio_items').select('*');
      if (!audErr) {
        set({ audios: supaAudios || [] });
      }

      // 5. Team Members
      const { data: supaTeam, error: teamErr } = await supabase.from('team_members').select('*');
      if (!teamErr) {
        set({ teamMembers: supaTeam || [] });
      }

      // 6. Contact Messages
      const { data: supaMsgs, error: msgErr } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!msgErr && supaMsgs && supaMsgs.length > 0) {
        set({ contactMessages: supaMsgs });
      }

      // 7. Co-Hosts Access Control
      const { data: supaCoHosts, error: coErr } = await supabase.from('co_hosts').select('*');
      if (!coErr && supaCoHosts && supaCoHosts.length > 0) {
        set({ coHosts: supaCoHosts });
      } else if (!coErr && (!supaCoHosts || supaCoHosts.length === 0)) {
        await supabase.from('co_hosts').upsert(initialCoHosts);
      }

      // 8. Site Settings (designerName, designerWebsiteUrl, aboutUsMission)
      const { data: supaSettings, error: setErr } = await supabase.from('site_settings').select('*');
      if (!setErr && supaSettings && supaSettings.length > 0) {
        supaSettings.forEach((item: { key: string; value: string }) => {
          if (item.key === 'designer_name' && item.value) {
            set({ designerName: item.value });
            if (typeof localStorage !== 'undefined') localStorage.setItem('mahdism_designer_name', item.value);
          }
          if (item.key === 'designer_url' && item.value) {
            set({ designerWebsiteUrl: item.value });
            if (typeof localStorage !== 'undefined') localStorage.setItem('mahdism_designer_url', item.value);
          }
          if (item.key === 'about_mission' && item.value) {
            set({ aboutUsMission: item.value });
            if (typeof localStorage !== 'undefined') localStorage.setItem('mahdism_about_mission', item.value);
          }
        });
      }

      // 9. Audit Logs
      const { data: supaLogs, error: logErr } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (!logErr && supaLogs && supaLogs.length > 0) {
        set({ auditLogs: supaLogs });
      }
    } catch (err) {
      console.log('Supabase Cloud Sync Fallback:', err);
    }
  },

  initFromStorage: () => {
    if (typeof localStorage === 'undefined') return;

    const userSetTheme = localStorage.getItem('mahdism_theme_user_set') as ThemeMode;
    if (userSetTheme === 'dark' || userSetTheme === 'light') {
      get().setTheme(userSetTheme);
    } else {
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      get().setTheme(prefersDark ? 'dark' : 'light');
    }

    const savedLang = localStorage.getItem('mahdism_lang') as Language;
    if (savedLang) {
      set({ language: savedLang });
    }

    const savedAboutMission = localStorage.getItem('mahdism_about_mission');
    if (savedAboutMission) {
      set({ aboutUsMission: savedAboutMission });
    }

    const savedDesignerName = localStorage.getItem('mahdism_designer_name');
    if (savedDesignerName !== null) {
      set({ designerName: savedDesignerName });
    }

    const savedDesignerUrl = localStorage.getItem('mahdism_designer_url');
    if (savedDesignerUrl !== null) {
      set({ designerWebsiteUrl: savedDesignerUrl });
    }

    const savedBookmarks = localStorage.getItem('mahdism_bookmarks');
    if (savedBookmarks) {
      try {
        set({ bookmarkedArticles: JSON.parse(savedBookmarks) });
      } catch {}
    }

    const savedAuditLogs = localStorage.getItem('mahdism_audit_logs');
    if (savedAuditLogs) {
      try {
        set({ auditLogs: JSON.parse(savedAuditLogs) });
      } catch {}
    }

    const savedArticles = localStorage.getItem('mahdism_articles');
    if (savedArticles) {
      try {
        set({ articles: JSON.parse(savedArticles) });
      } catch {}
    }

    const savedMagazines = localStorage.getItem('mahdism_magazines');
    if (savedMagazines) {
      try {
        set({ magazineIssues: JSON.parse(savedMagazines) });
      } catch {}
    }

    const savedVideos = localStorage.getItem('mahdism_videos');
    if (savedVideos) {
      try {
        set({ videos: JSON.parse(savedVideos) });
      } catch {}
    }

    const savedAudios = localStorage.getItem('mahdism_audios');
    if (savedAudios) {
      try {
        set({ audios: JSON.parse(savedAudios) });
      } catch {}
    }

    const savedAdmin = localStorage.getItem('mahdism_admin_auth');
    if (savedAdmin === 'true') {
      set({ isAdminLoggedIn: true });
    }

    const savedCoHosts = localStorage.getItem('mahdism_cohosts');
    if (savedCoHosts) {
      try {
        set({ coHosts: JSON.parse(savedCoHosts) });
      } catch {}
    }

    const savedCurrentUser = localStorage.getItem('mahdism_current_user');
    if (savedCurrentUser) {
      try {
        set({ currentUser: JSON.parse(savedCurrentUser) });
      } catch {}
    }

    // Trigger backend sync
    get().fetchFromBackend();
  },
}));
