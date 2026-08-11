import { create } from 'zustand';
import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage, CoHostUser } from '../types';
import { initialArticles, initialMagazineIssues, initialVideos, initialAudios, initialInfographics, initialTeamMembers, initialContactMessages, initialCoHosts } from '../data/initialData';
import { Language } from '../data/translations';
import { supabase } from '@/lib/supabase';

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

  // Database tables
  articles: Article[];
  magazineIssues: MagazineIssue[];
  videos: VideoItem[];
  audios: AudioItem[];
  infographics: InfographicItem[];
  teamMembers: TeamMember[];
  contactMessages: ContactMessage[];

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

  // Admin Full CRUD Actions with Real-Time Backend Sync
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
    set({ aboutUsMission: desc });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_about_mission', desc);
    }
  },

  articles: initialArticles,
  magazineIssues: initialMagazineIssues,
  videos: initialVideos,
  audios: initialAudios,
  infographics: initialInfographics,
  teamMembers: initialTeamMembers,
  contactMessages: initialContactMessages,

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
    set({ coHosts: updated });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_cohosts', JSON.stringify(updated));
    }
  },

  updateCoHost: (id, updates) => {
    const updated = get().coHosts.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch));
    set({ coHosts: updated });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_cohosts', JSON.stringify(updated));
    }
    if (get().currentUser?.id === id) {
      const updatedUser = updated.find(ch => ch.id === id) || null;
      set({ currentUser: updatedUser });
      if (typeof localStorage !== 'undefined' && updatedUser) {
        localStorage.setItem('mahdism_current_user', JSON.stringify(updatedUser));
      }
    }
  },

  deleteCoHost: (id) => {
    const target = get().coHosts.find(ch => ch.id === id);
    if (target?.is_super_admin || target?.password_code === '190716') {
      return;
    }
    const updated = get().coHosts.filter((ch) => ch.id !== id);
    set({ coHosts: updated });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_cohosts', JSON.stringify(updated));
    }
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
    const newArticle: Article = {
      ...articleData,
      id: `art-${Date.now()}`,
      views: 1,
    };
    set((state) => ({ articles: [newArticle, ...state.articles] }));
    try {
      await supabase.from('articles').upsert(newArticle);
    } catch {}
  },

  updateArticle: async (id, articleData) => {
    set((state) => ({
      articles: state.articles.map((art) => (art.id === id ? { ...art, ...articleData } : art)),
    }));
    try {
      await supabase.from('articles').update(articleData).eq('id', id);
    } catch {}
  },

  deleteArticle: async (id) => {
    set((state) => ({
      articles: state.articles.filter((art) => art.id !== id),
    }));
    try {
      await supabase.from('articles').delete().eq('id', id);
    } catch {}
  },

  addMagazineIssue: async (issueData) => {
    const newIssue: MagazineIssue = {
      ...issueData,
      id: `mag-${Date.now()}`,
      download_count: 0,
    };
    set((state) => ({ magazineIssues: [newIssue, ...state.magazineIssues] }));
    try {
      await supabase.from('magazine_issues').upsert(newIssue);
    } catch {}
  },

  updateMagazineIssue: (id, issueData) => {
    set((state) => ({
      magazineIssues: state.magazineIssues.map((iss) => (iss.id === id ? { ...iss, ...issueData } : iss)),
    }));
    try {
      supabase.from('magazine_issues').update(issueData).eq('id', id);
    } catch {}
  },

  deleteMagazineIssue: (id) => {
    set((state) => ({
      magazineIssues: state.magazineIssues.filter((iss) => iss.id !== id),
    }));
    try {
      supabase.from('magazine_issues').delete().eq('id', id);
    } catch {}
  },

  addVideo: (videoData) => {
    const newVid: VideoItem = {
      ...videoData,
      id: `vid-${Date.now()}`,
      views: 1,
    };
    set((state) => ({ videos: [newVid, ...state.videos] }));
    try {
      supabase.from('video_items').upsert(newVid);
    } catch {}
  },

  updateVideo: (id, videoData) => {
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, ...videoData } : v)),
    }));
    try {
      supabase.from('video_items').update(videoData).eq('id', id);
    } catch {}
  },

  deleteVideo: (id) => {
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
    }));
    try {
      supabase.from('video_items').delete().eq('id', id);
    } catch {}
  },

  addAudio: (audioData) => {
    const newAud: AudioItem = {
      ...audioData,
      id: `aud-${Date.now()}`,
      plays: 1,
    };
    set((state) => ({ audios: [newAud, ...state.audios] }));
    try {
      supabase.from('audio_items').upsert(newAud);
    } catch {}
  },

  updateAudio: (id, audioData) => {
    set((state) => ({
      audios: state.audios.map((a) => (a.id === id ? { ...a, ...audioData } : a)),
    }));
    try {
      supabase.from('audio_items').update(audioData).eq('id', id);
    } catch {}
  },

  deleteAudio: (id) => {
    set((state) => ({
      audios: state.audios.filter((a) => a.id !== id),
    }));
    try {
      supabase.from('audio_items').delete().eq('id', id);
    } catch {}
  },

  addInfographic: (infoData) => {
    const newInfo: InfographicItem = {
      ...infoData,
      id: `info-${Date.now()}`,
    };
    set((state) => ({ infographics: [newInfo, ...state.infographics] }));
    try {
      supabase.from('infographic_items').upsert(newInfo);
    } catch {}
  },

  deleteInfographic: (id) => {
    set((state) => ({
      infographics: state.infographics.filter((i) => i.id !== id),
    }));
    try {
      supabase.from('infographic_items').delete().eq('id', id);
    } catch {}
  },

  addTeamMember: (memberData) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `team-${Date.now()}`,
    };
    set((state) => ({ teamMembers: [...state.teamMembers, newMember] }));
    try {
      supabase.from('team_members').upsert(newMember);
    } catch {}
  },

  updateTeamMember: (id, memberData) => {
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...memberData } : m)),
    }));
    try {
      supabase.from('team_members').update(memberData).eq('id', id);
    } catch {}
  },

  deleteTeamMember: (id) => {
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== id),
    }));
    try {
      supabase.from('team_members').delete().eq('id', id);
    } catch {}
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
      if (!artErr && supaArticles && supaArticles.length > 0) {
        set({ articles: supaArticles });
      } else if (!artErr) {
        await supabase.from('articles').upsert(initialArticles);
      }

      // 2. Magazine Issues
      const { data: supaMagazines, error: magErr } = await supabase.from('magazine_issues').select('*').order('issue_number', { ascending: true });
      if (!magErr && supaMagazines && supaMagazines.length > 0) {
        set({ magazineIssues: supaMagazines });
      } else if (!magErr) {
        await supabase.from('magazine_issues').upsert(initialMagazineIssues);
      }

      // 3. Videos
      const { data: supaVideos, error: vidErr } = await supabase.from('video_items').select('*');
      if (!vidErr && supaVideos && supaVideos.length > 0) {
        set({ videos: supaVideos });
      } else if (!vidErr) {
        await supabase.from('video_items').upsert(initialVideos);
      }

      // 4. Audios
      const { data: supaAudios, error: audErr } = await supabase.from('audio_items').select('*');
      if (!audErr && supaAudios && supaAudios.length > 0) {
        set({ audios: supaAudios });
      } else if (!audErr) {
        await supabase.from('audio_items').upsert(initialAudios);
      }

      // 5. Team Members
      const { data: supaTeam, error: teamErr } = await supabase.from('team_members').select('*');
      if (!teamErr && supaTeam && supaTeam.length > 0) {
        set({ teamMembers: supaTeam });
      } else if (!teamErr) {
        await supabase.from('team_members').upsert(initialTeamMembers);
      }

      // 6. Contact Messages
      const { data: supaMsgs, error: msgErr } = await supabase.from('contact_messages').select('*');
      if (!msgErr && supaMsgs && supaMsgs.length > 0) {
        set({ contactMessages: supaMsgs });
      }

      // 7. Co-Hosts Access Control
      const { data: supaCoHosts, error: coErr } = await supabase.from('co_hosts').select('*');
      if (!coErr && supaCoHosts && supaCoHosts.length > 0) {
        set({ coHosts: supaCoHosts });
      } else if (!coErr) {
        await supabase.from('co_hosts').upsert(initialCoHosts);
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

    const savedBookmarks = localStorage.getItem('mahdism_bookmarks');
    if (savedBookmarks) {
      try {
        set({ bookmarkedArticles: JSON.parse(savedBookmarks) });
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
