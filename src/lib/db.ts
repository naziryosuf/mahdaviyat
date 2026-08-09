import fs from 'fs';
import path from 'path';
import { initialArticles, initialMagazineIssues, initialAudios, initialVideos } from '@/data/initialData';

const DB_FILE = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'mahdism_db.json')
  : path.join(process.cwd(), 'data', 'db.json');

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

export function readDB(): DBData {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData: DBData = {
        articles: initialArticles,
        magazineIssues: initialMagazineIssues,
        audios: initialAudios,
        videos: initialVideos,
        messages: [
          {
            id: 'msg-1',
            sender_name: 'احمد رضایی',
            sender_email: 'ahmad.rezaei@gmail.com',
            sender_phone: '+93 799 123456',
            subject: 'پیشنهاد برای شماره دوم مجله',
            message_text: 'سلام و احترام، مقاله بسیار ارزشمندی در حوزه شناختی مهدویت آماده نموده‌ام که تمایل به انتشار آن در شماره بعدی مجله دارم.',
            sent_at: '۱۴۰۴/۰۵/۱۵ - ۱۰:۳۰',
            status: 'unread',
          }
        ],
      };
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      } catch {}
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(fileContent) as DBData;
  } catch (error) {
    return {
      articles: initialArticles,
      magazineIssues: initialMagazineIssues,
      audios: initialAudios,
      videos: initialVideos,
      messages: [],
    };
  }
}

export function writeDB(data: DBData): boolean {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing backend database:', error);
    return false;
  }
}
