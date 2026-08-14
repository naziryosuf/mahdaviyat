import { Article, MagazineIssue, VideoItem, AudioItem, InfographicItem, TeamMember, ContactMessage, CoHostUser } from '../types';

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title_fa: 'تبیین مفاهیم بنیادین معرفت‌شناختی در عصر غیبت',
    slug: 'tabyin-mafahim-boniyadin',
    excerpt_fa: 'بررسی لایه‌های معرفتی و شناختی تمدن مهدوی و وظایف نخبگان فکری در تبیین عقلانیت دینی.',
    content_fa: `مقدمه: معرفت‌شناسی دینی و تمدنی در عصر غیبت، یکی از کلیدی‌ترین ارکان فهم رسالت انسان مؤمن در مواجهه با چالش‌های فکر جدید است.

۱. چیستی عقلانیت مهدوی:
در اندیشه توحیدی، انتظار فرج یک حالت انفعالی و منفعلانه نیست؛ بلکه عالی‌ترین شکل از «فاعلیت شناختی و اجتماعی» است. عقلانیت مهدوی بر سه اصل استوار است:
- اصل اول: خداشناسی توحیدی و پیوند آن با انسان‌شناسی.
- اصل دوم: آسیب‌شناسی جریان‌های ماتریالیستی و الحادی.
- اصل سوم: خودسازی معنوی و عقلانی در جهت جامعه‌سازی.

۲. وظایف نخبگان فکری و نویسندگان آزاد:
نویسندگان و اندیشمندان آزاد باید با بهره‌گیری از ابزارهای رسانه‌ای مدرن و استدلال‌های عقلانی، تبیین‌گر حقایق شناختی باشند.`,
    category_fa: 'سرمقاله‌ها',
    author_name_fa: 'سردبیر ارشد',
    author_title_fa: 'M. Nazir Yosuf',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    read_time_fa: '۷ دقیقه',
    published_at: '۱۴۰۴/۰۵/۲۰',
    image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&auto=format&fit=crop&q=80',
    views: 450,
    featured: true,
    status: 'published',
    tags: ['معرفت‌شناسی', 'سرمقاله', 'مهدویت']
  },
  {
    id: 'art-2',
    title_fa: 'نقد و بررسی ماتریالیسم تاریخی از منظر حکمت اسلامی',
    slug: 'naqd-materialism-tarikhi',
    excerpt_fa: 'تحلیلی سنجش‌گرایانه بر مبانی فلسفی مکاتب مدرن غربی و مقایسه آن با تفکر توحیدی.',
    content_fa: 'نگاه تک‌بعدی به تاریخ و انسان همیشه منجر به بحران‌های اخلاقی و شناختی گردیده است. در این مقاله به بررسی تطبیقی مبانی حکمت متعالیه با دیدگاه‌های ماده‌گرایانه پرداخته می‌شود...',
    category_fa: 'نقد مکاتب',
    author_name_fa: 'تیم پژوهشی ایدئولوژی مهدویت',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    read_time_fa: '۱۲ دقیقه',
    published_at: '۱۴۰۴/۰۵/۱۸',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    views: 310,
    featured: false,
    status: 'published',
    tags: ['نقد مکاتب', 'فلسفه', 'حکمت']
  }
];

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
    pages: [],
    featured: true,
    status: 'published',
    tags: ['#شماره_نخست', '#ایدئولوژی_مهدویت']
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: 'vid-1',
    title_fa: 'تبیین عقلانی انتظار و تحول جوامع بشری',
    description_fa: 'نشست تحلیلی و تخصصی پیرامون دلالت‌های عقلانی مهدویت در جهان معاصر.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    duration_fa: '۲۴:۱۵',
    category_fa: 'تحلیل رسانه‌ای',
    speaker_fa: 'دکتر علوی',
    published_at: '۱۴۰۴/۰۵/۱۵',
    views: 890,
    featured: true,
    status: 'published',
    tags: ['سخنرانی', 'تحلیل']
  }
];

export const initialAudios: AudioItem[] = [
  {
    id: 'aud-1',
    title_fa: 'پادکست شناختی: جایگاه انسان در هستی‌شناسی مهدوی',
    speaker_fa: 'استاد حسینی',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration_fa: '۱۸:۴۵',
    description_fa: 'مباحثه تخصصی پیرامون کرامت انسانی و نقش بیداری معنوی در تمدن‌سازی.',
    published_at: '۱۴۰۴/۰۵/۲۱',
    category_fa: 'پادکست صوتی',
    cover_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    plays: 620,
    featured: true,
    status: 'published',
    tags: ['پادکست', 'خودشناسی']
  }
];

export const initialInfographics: InfographicItem[] = [];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name_fa: 'M. Nazir Yosuf',
    role_fa: 'سردبیر ارشد و مدیر مسئول',
    bio_fa: 'پژوهشگر معارف دینی و شناختی با تمرکز بر تبیین عقلانیت مهدویت.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    specialization_fa: 'مدیریت محتوا و تحریریه',
    status: 'published'
  }
];

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
      can_direct_publish: false,
      can_manage_about: false,
      can_view_storage: false,
    }
  }
];
