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

const faDict: TranslationDictionary = {
  siteTitle: 'ایدئولوژی مهدویت',
  subTitle: 'مجله علمی - معنوی',
  missionDesc: 'مجلۀ «ایدئولوژی مهدویت» بستری است برای ارائه شناخت پیرامون مهم‌ترین موضوعات: خداشناسی، خودشناسی، جامعه‌شناسی، هستی‌شناسی و سایر موضوعات تاریخی؛ به هدف ایجاد بیداری معنوی و اجتماعی. این مجله توسط جمعی از نویسندگان آزاد افغانستان از سراسر جهان تشکیل شده و به صورت کاملاً داوطلبانه و غیرانتفاعی اداره می‌شود.',
  home: 'صفحه اصلی',
  magazine: 'آرشیف مجله',
  content: 'مقالات',
  media: 'چندرسانه‌ای',
  audio: 'صدا',
  video: 'ویدیو',
  podcast: 'محتوای صوتی',
  lecture: 'محتوای ویدیویی',
  webinar: 'وبینارها',
  infographic: 'محتوای تصویری و گرافیکی',
  all: 'همه',
  about: 'درباره ما',
  contact: 'ارتباط با ما',
  admin: 'بخش مدیریت',
  readMagazine: 'مطالعه مجله',
  downloadMagazine: 'دانلود مجله',
  searchPlaceholder: 'جستجو در محتوای سایت',
  latestArticles: 'آخرین مطالب منتشر شده',
  topAudios: 'محبوب‌ترین محتوای صوتی',
  topVideos: 'برترین محتوای ویدیویی',
  quickLinks: 'لینک‌های سریع',
  socialMedia: 'شبکه‌های اجتماعی',
  copyright: '© ۲۰۲۶ مجله ایدئولوژی مهدویت. تمامی حقوق مادی و معنوی محفوظ است.',
  magazineTitle: 'فهرست و آرشیف کامل شماره‌های مجله ایدئولوژی مهدویت',
  editorialBoard: 'شناسنامه و اعضای هیئت تحریریه',
};

export const translations: Record<Language, TranslationDictionary> = {
  fa: faDict,
  ps: faDict,
  en: faDict,
};
