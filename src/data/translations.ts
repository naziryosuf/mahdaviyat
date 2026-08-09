export type Language = 'fa' | 'ps' | 'en';

export interface TranslationDictionary {
  siteTitle: string;
  subTitle: string;
  missionDesc: string;
  home: string;
  magazine: string;
  content: string;
  media: string;
  audio: string;
  video: string;
  podcast: string;
  lecture: string;
  webinar: string;
  infographic: string;
  all: string;
  about: string;
  contact: string;
  admin: string;
  readMagazine: string;
  downloadMagazine: string;
  searchPlaceholder: string;
  latestArticles: string;
  topAudios: string;
  topVideos: string;
  quickLinks: string;
  socialMedia: string;
  copyright: string;
  magazineTitle: string;
  editorialBoard: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  fa: {
    siteTitle: 'ایدئولوژی مهدویت',
    subTitle: 'مجله علمی - معنوی',
    missionDesc: 'مجله ایدئولوژی مهدویت که توسط نویسندگان آزاد افغانستان از سراسر جهان تشکیل شده و به صورت داوطلبانه مفاهیم و موضوعات فکری-شناختی عمیق را به بحث می‌گیرد.',
    home: 'صفحه اصلی',
    magazine: 'آرشیف مجله',
    content: 'مقالات',
    media: 'چندرسانه‌ای',
    audio: 'صدا',
    video: 'ویدیو',
    podcast: 'محبوب‌ترین پادکست‌ها',
    lecture: 'درس‌گفتارها',
    webinar: 'وبینارها',
    infographic: 'اینفوگرافیک‌ها',
    all: 'همه',
    about: 'درباره ما',
    contact: 'ارتباط با ما',
    admin: 'بخش مدیریت',
    readMagazine: 'مطالعه شماره نخست مجله',
    downloadMagazine: 'دانلود فایل PDF مجله',
    searchPlaceholder: 'جستجو در مقالات، شماره‌های مجله و موضوعات...',
    latestArticles: 'آخرین مطالب منتشر شده',
    topAudios: 'محبوب‌ترین پادکست‌ها',
    topVideos: 'ویدیوهای برتر',
    quickLinks: 'لینک‌های سریع',
    socialMedia: 'شبکه‌های اجتماعی',
    copyright: '© ۲۰۲۶ مجله ایدئولوژی مهدویت. تمامی حقوق مادی و معنوی محفوظ است.',
    magazineTitle: 'فهرست و آرشیف کامل شماره‌های مجله ایدئولوژی مهدویت',
    editorialBoard: 'شناسنامه و اعضای هیئت تحریریه',
  },
  ps: {
    siteTitle: 'مهدویت ایدیالوژي',
    subTitle: 'علمي - معنوي مجله',
    missionDesc: 'د مهدویت ایدیالوژي مجله د نړۍ له ګوټ ګوټ څخه د افغانستان د ازادو لیکوالانو لخوا رامینځته شوې او په داوطلبانه ډول فکري موضوعات نیسي.',
    home: 'کور پاڼه',
    magazine: 'مجله',
    content: 'منځپانګه',
    media: 'ملټي میډیا',
    audio: 'غږیز',
    video: 'ویډیو',
    podcast: 'پادکستونه',
    lecture: 'درسونه',
    webinar: 'وبینارونه',
    infographic: 'انفوګرافیکونه',
    all: 'ټول',
    about: 'زموږ په اړه',
    contact: 'له موږ سره اړیکه',
    admin: 'اداره',
    readMagazine: 'د آنلاین مجلې لوستل',
    downloadMagazine: 'د PDF ډاونلوډ',
    searchPlaceholder: 'په مقالو، ویډیوګانو او مهدویت کې لټون...',
    latestArticles: 'وروستي څېړنیزې مقالې',
    topAudios: 'غږیز پادکستونه',
    topVideos: 'ویډیویي ناستې',
    quickLinks: 'اصلي برخې',
    socialMedia: 'ټولنیزې شبکې',
    copyright: '© ۲۰۲۶ د مهدویت ایدیالوژي مجلې ټول حقونه خوندي دي.',
    magazineTitle: 'خپاره شوي مجلې',
    editorialBoard: 'د تحریر هیئت',
  },
  en: {
    siteTitle: 'Ideology of Mahdism',
    subTitle: 'Scientific & Spiritual Journal',
    missionDesc: 'Ideology of Mahdism magazine, formed by independent Afghan authors worldwide, voluntarily discusses deep cognitive concepts.',
    home: 'Home',
    magazine: 'Magazine',
    content: 'Articles',
    media: 'Multimedia',
    audio: 'Audio',
    video: 'Video',
    podcast: 'Podcasts',
    lecture: 'Lectures',
    webinar: 'Webinars',
    infographic: 'Infographics',
    all: 'All',
    about: 'About Us',
    contact: 'Contact',
    admin: 'Admin',
    readMagazine: 'Read Issue #1',
    downloadMagazine: 'Download PDF',
    searchPlaceholder: 'Search articles, magazine issues & topics...',
    latestArticles: 'Latest Published Content',
    topAudios: 'Popular Podcasts',
    topVideos: 'Featured Videos',
    quickLinks: 'Quick Links',
    socialMedia: 'Social Channels',
    copyright: '© 2026 Ideology of Mahdism Magazine. All rights reserved.',
    magazineTitle: 'Published Magazine Issues',
    editorialBoard: 'Editorial Board',
  },
};
