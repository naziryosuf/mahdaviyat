import { Metadata } from 'next';
import { VideoPageClient } from './VideoPageClient';

export const metadata: Metadata = {
  title: 'آرشیو ویدیوها و رسانه تصویری',
  description: 'مشاهده ویدیوهای تحلیلی، سخنرانی‌ها و کلیپ‌های شناختی مجله ایدئولوژی مهدویت.',
  openGraph: {
    title: 'ویدیوها و رسانه تصویری ایدئولوژی مهدویت',
    description: 'مشاهده ویدیوهای تحلیلی، سخنرانی‌ها و کلیپ‌های شناختی مجله ایدئولوژی مهدویت.',
    url: 'https://www.ideologymahdaviyat.org/video',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'ویدیوهای ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ویدیوها و رسانه تصویری ایدئولوژی مهدویت',
    description: 'مشاهده ویدیوهای تحلیلی، سخنرانی‌ها و کلیپ‌های شناختی مجله ایدئولوژی مهدویت.',
    images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function VideoPage() {
  return <VideoPageClient />;
}
