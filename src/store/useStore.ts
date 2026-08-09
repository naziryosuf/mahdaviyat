import { create } from 'zustand';
import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage } from '../types';
import { initialArticles, initialMagazineIssues, initialVideos, initialAudios, initialInfographics, initialTeamMembers, initialContactMessages } from '../data/initialData';
import { Language } from '../data/translations';

export type ThemeMode = 'dark' | 'light';

interface AppState {
  // Theme state
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Trilingual language state
  language: Language;
  setLanguage: (lang: Language) => void;

  // Database tables
  articles: Article[];
  magazineIssues: MagazineIssue[];
  videos: VideoItem[];
  audios: AudioItem[];
  infographics: InfographicItem[];
  teamMembers: TeamMember[];
  contactMessages: ContactMessage[];

  // Admin Security Gate
  isAdminLoggedIn: boolean;
  adminPasscode: string;
  loginAdmin: (passcode: string) => Promise<boolean>;
  logoutAdmin: () => void;

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

export const useStore = create<AppState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
  setTheme: (t: ThemeMode) => {
    set({ theme: t });
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('mahdism_theme_mode', t);
    }
  },

  language: 'fa',
  setLanguage: (lang: Language) => {
    set({ language: lang });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_lang', lang);
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
  adminPasscode: '123456',

  loginAdmin: async (passcode: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (data.success) {
        set({ isAdminLoggedIn: true });
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mahdism_admin_auth', 'true');
        }
        return true;
      }
      return false;
    } catch {
      if (passcode === '123456') {
        set({ isAdminLoggedIn: true });
        return true;
      }
      return false;
    }
  },

  logoutAdmin: () => {
    set({ isAdminLoggedIn: false });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mahdism_admin_auth');
    }
  },

  currentAudio: null,
  isPlayingAudio: false,

  playAudio: (audio: AudioItem) => {
    set({ currentAudio: audio, isPlayingAudio: true });
  },
  pauseAudio: () => {
    set({ isPlayingAudio: false });
  },
  toggleAudioPlay: () => {
    set({ isPlayingAudio: !get().isPlayingAudio });
  },
  closeAudioPlayer: () => {
    set({ currentAudio: null, isPlayingAudio: false });
  },

  bookmarkedArticles: [],
  toggleBookmark: (articleId: string) => {
    const current = get().bookmarkedArticles;
    const next = current.includes(articleId)
      ? current.filter(id => id !== articleId)
      : [...current, articleId];
    set({ bookmarkedArticles: next });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mahdism_bookmarks', JSON.stringify(next));
    }
  },

  // BACKEND API SYNCED CRUD ACTIONS
  addArticle: async (articleData) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        set({ articles: [data.data, ...get().articles] });
      }
    } catch {
      const newArt: Article = {
        ...articleData,
        id: `art-${Date.now()}`,
        views: 1,
      };
      set({ articles: [newArt, ...get().articles] });
    }
  },

  updateArticle: async (id, articleData) => {
    try {
      await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
    } catch {}
    set({
      articles: get().articles.map(a => a.id === id ? { ...a, ...articleData } : a),
    });
  },

  deleteArticle: async (id) => {
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    } catch {}
    set({ articles: get().articles.filter(a => a.id !== id) });
  },

  addMagazineIssue: async (issueData) => {
    try {
      const res = await fetch('/api/magazines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        set({ magazineIssues: [data.data, ...get().magazineIssues] });
      }
    } catch {
      const newIssue: MagazineIssue = {
        ...issueData,
        id: `issue-${Date.now()}`,
        download_count: 0,
      };
      set({ magazineIssues: [newIssue, ...get().magazineIssues] });
    }
  },

  updateMagazineIssue: (id, issueData) => {
    set({
      magazineIssues: get().magazineIssues.map(i => i.id === id ? { ...i, ...issueData } : i),
    });
  },

  deleteMagazineIssue: (id) => {
    set({ magazineIssues: get().magazineIssues.filter(i => i.id !== id) });
  },

  addVideo: (videoData) => {
    const newVid: VideoItem = { ...videoData, id: `vid-${Date.now()}`, views: 1 };
    set({ videos: [newVid, ...get().videos] });
  },
  updateVideo: (id, videoData) => {
    set({ videos: get().videos.map(v => v.id === id ? { ...v, ...videoData } : v) });
  },
  deleteVideo: (id) => {
    set({ videos: get().videos.filter(v => v.id !== id) });
  },

  addAudio: (audioData) => {
    const newAud: AudioItem = { ...audioData, id: `aud-${Date.now()}`, plays: 1 };
    set({ audios: [newAud, ...get().audios] });
  },
  updateAudio: (id, audioData) => {
    set({ audios: get().audios.map(a => a.id === id ? { ...a, ...audioData } : a) });
  },
  deleteAudio: (id) => {
    set({ audios: get().audios.filter(a => a.id !== id) });
  },

  addInfographic: (infoData) => {
    const newInfo: InfographicItem = { ...infoData, id: `info-${Date.now()}` };
    set({ infographics: [newInfo, ...get().infographics] });
  },
  deleteInfographic: (id) => {
    set({ infographics: get().infographics.filter(i => i.id !== id) });
  },

  addTeamMember: (memberData) => {
    const newMember: TeamMember = { ...memberData, id: `team-${Date.now()}` };
    set({ teamMembers: [...get().teamMembers, newMember] });
  },
  updateTeamMember: (id, memberData) => {
    set({ teamMembers: get().teamMembers.map(m => m.id === id ? { ...m, ...memberData } : m) });
  },
  deleteTeamMember: (id) => {
    set({ teamMembers: get().teamMembers.filter(m => m.id !== id) });
  },

  addContactMessage: async (msgData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        set({ contactMessages: [data.data, ...get().contactMessages] });
        return;
      }
    } catch {}

    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      created_at: new Date().toLocaleString('fa-IR'),
      status: 'new',
    };
    set({ contactMessages: [newMsg, ...get().contactMessages] });
  },

  markContactRead: (id) => {
    set({
      contactMessages: get().contactMessages.map(m => m.id === id ? { ...m, status: 'read' as const } : m),
    });
  },
  deleteContactMessage: (id) => {
    set({ contactMessages: get().contactMessages.filter(m => m.id !== id) });
  },

  fetchFromBackend: async () => {
    try {
      const resArticles = await fetch('/api/articles');
      const dataArticles = await resArticles.json();
      if (dataArticles.success && Array.isArray(dataArticles.data)) {
        set({ articles: dataArticles.data });
      }

      const resMagazines = await fetch('/api/magazines');
      const dataMagazines = await resMagazines.json();
      if (dataMagazines.success && Array.isArray(dataMagazines.data)) {
        set({ magazineIssues: dataMagazines.data });
      }
    } catch (err) {
      console.log('Backend fetch fallback to static data');
    }
  },

  initFromStorage: () => {
    if (typeof localStorage === 'undefined') return;

    const savedTheme = localStorage.getItem('mahdism_theme_mode') as ThemeMode;
    if (savedTheme) {
      get().setTheme(savedTheme);
    }

    const savedLang = localStorage.getItem('mahdism_lang') as Language;
    if (savedLang) {
      set({ language: savedLang });
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

    // Trigger backend sync
    get().fetchFromBackend();
  },
}));
