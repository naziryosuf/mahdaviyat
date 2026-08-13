import { supabase } from '@/lib/supabase';
import { initialArticles, initialMagazineIssues, initialAudios, initialVideos } from '@/data/initialData';

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message_text: string;
  sent_at: string;
  status: 'unread' | 'read' | 'replied';
}

export interface DBData {
  articles: any[];
  magazineIssues: any[];
  audios: any[];
  videos: any[];
  messages: ContactMessage[];
}

export async function readDBAsync(): Promise<DBData> {
  try {
    const [
      { data: articles },
      { data: magazineIssues },
      { data: audios },
      { data: videos },
      { data: messages }
    ] = await Promise.all([
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
      supabase.from('magazine_issues').select('*').order('issue_number', { ascending: true }),
      supabase.from('audio_items').select('*'),
      supabase.from('video_items').select('*'),
      supabase.from('contact_messages').select('*')
    ]);

    return {
      articles: articles && articles.length > 0 ? articles : initialArticles,
      magazineIssues: magazineIssues && magazineIssues.length > 0 ? magazineIssues : initialMagazineIssues,
      audios: audios && audios.length > 0 ? audios : initialAudios,
      videos: videos && videos.length > 0 ? videos : initialVideos,
      messages: messages || [],
    };
  } catch (error) {
    console.error('Supabase readDBAsync error:', error);
    return {
      articles: initialArticles,
      magazineIssues: initialMagazineIssues,
      audios: initialAudios,
      videos: initialVideos,
      messages: [],
    };
  }
}

export function readDB(): DBData {
  return {
    articles: initialArticles,
    magazineIssues: initialMagazineIssues,
    audios: initialAudios,
    videos: initialVideos,
    messages: [],
  };
}

export function writeDB(data: DBData): boolean {
  try {
    if (data.articles && data.articles.length > 0) {
      supabase.from('articles').upsert(data.articles).then(() => {});
    }
    if (data.magazineIssues && data.magazineIssues.length > 0) {
      supabase.from('magazine_issues').upsert(data.magazineIssues).then(() => {});
    }
    if (data.audios && data.audios.length > 0) {
      supabase.from('audio_items').upsert(data.audios).then(() => {});
    }
    if (data.videos && data.videos.length > 0) {
      supabase.from('video_items').upsert(data.videos).then(() => {});
    }
    if (data.messages && data.messages.length > 0) {
      supabase.from('contact_messages').upsert(data.messages).then(() => {});
    }
    return true;
  } catch (error) {
    console.error('Supabase writeDB sync error:', error);
    return false;
  }
}
