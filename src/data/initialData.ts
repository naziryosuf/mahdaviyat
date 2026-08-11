import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage, CoHostUser } from '../types';

export const initialArticles: Article[] = [];

export const initialMagazineIssues: MagazineIssue[] = [];

export const initialVideos: VideoItem[] = [];

export const initialAudios: AudioItem[] = [];

export const initialInfographics: InfographicItem[] = [];

export const initialTeamMembers: TeamMember[] = [];

export const initialContactMessages: ContactMessage[] = [];

export const initialCoHosts: CoHostUser[] = [
  {
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
  },
  {
    id: 'cohost-articles-manager',
    name_fa: 'همکار / مدیر مقالات',
    password_code: '123456',
    role_fa: 'ویرایشگر و مسئول انتشار مقالات',
    created_at: '۱۴۰۴/۰۵/۱۰',
    is_super_admin: false,
    permissions: {
      can_manage_articles: true,
      can_manage_magazines: false,
      can_manage_videos: false,
      can_manage_audios: false,
      can_manage_team: false,
      can_manage_messages: false,
      can_manage_cohosts: false,
    }
  }
];
