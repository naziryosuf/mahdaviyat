import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage, CoHostUser } from '../types';

export const initialArticles: Article[] = [];

export const initialMagazineIssues: MagazineIssue[] = [
  {
    id: 'issue-1',
    issue_number: 1,
    title_fa: 'شماره نخست: عقلانیت، معرفت و بیداری معنوی',
    description_fa: 'نخستین شماره رسمی مجله ایدئولوژی مهدویت متمرکز بر تبیین جهان‌بینی توحیدی و نقد ماتریالیسم.',
    publish_date_fa: 'مرداد ۱۴۰۴',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    cover_position: 'center',
    pdf_url: '/downloads/mahdism_issue_1.pdf',
    download_count: 1240,
    author_name_fa: 'M. Nazir Yosufi',
    author_title_fa: 'سردبیر ارشد',
    page_count_fa: '۴۵ صفحه (قطع A4)',
    pages: [],
    featured: true,
    status: 'published',
    tags: ['#شماره_نخست', '#ایدئولوژی_مهدویت']
  }
];

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
      can_direct_publish: true,
      can_manage_about: true,
      can_view_storage: true,
    }
  }
];
