export interface Article {
  id: string;
  title_fa: string;
  slug: string;
  excerpt_fa: string;
  content_fa: string;
  category_fa: 'سرمقاله‌ها' | 'تحلیل‌ها' | 'نقد مکاتب' | 'شناخت مهدویت';
  author_name_fa: string;
  author_avatar: string;
  read_time_fa: string;
  published_at: string;
  image_url: string;
  featured: boolean;
  views?: number;
}

export interface MagazinePageItem {
  page_number: number;
  image_url: string;
  title_fa?: string;
  text_fa?: string;
}

export interface MagazineIssue {
  id: string;
  issue_number: number;
  title_fa: string;
  description_fa: string;
  publish_date_fa: string;
  cover_image: string;
  pdf_url: string;
  download_count: number;
  pages: MagazinePageItem[];
  featured?: boolean;
}

export interface VideoItem {
  id: string;
  title_fa: string;
  description_fa: string;
  video_url: string;
  thumbnail_url: string;
  duration_fa: string;
  category_fa: string;
  speaker_fa: string;
  published_at: string;
  views?: number;
  featured?: boolean;
  download_url?: string;
  transcript_fa?: string;
  timestamps?: { time: string; label_fa: string }[];
}

export interface AudioItem {
  id: string;
  title_fa: string;
  speaker_fa: string;
  audio_url: string;
  duration_fa: string;
  description_fa: string;
  published_at: string;
  category_fa: string;
  cover_image: string;
  plays?: number;
}

export interface InfographicItem {
  id: string;
  title_fa: string;
  description_fa: string;
  image_url: string;
  category_fa: string;
  published_at: string;
}

export interface TeamMember {
  id: string;
  name_fa: string;
  role_fa: string;
  bio_fa: string;
  avatar_url: string;
  specialization_fa: string;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'new' | 'read';
  file_name?: string;
  file_url?: string;
}
