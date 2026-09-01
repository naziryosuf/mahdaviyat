import { Metadata } from 'next';
import { MediaPageClient } from './MediaPageClient';

export const metadata: Metadata = {
  title: 'چندرسانه‌ای (ویدیو و صوت)',
  description: 'آرشیو یکپارچه محتوای چندرسانه‌ای شامل ویدیوها، پادکست‌ها و اینفوگرافیک‌های مجله ایدئولوژی مهدویت.',
  openGraph: {
    title: 'مرکز چندرسانه‌ای ایدئولوژی مهدویت',
    description: 'آرشیو یکپارچه محتوای چندرسانه‌ای شامل ویدیوها، پادکست‌ها و فایل‌های صوتی مجله ایدئولوژی مهدویت.',
    url: 'https://www.ideologymahdaviyat.org/media',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'چندرسانه‌ای ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مرکز چندرسانه‌ای ایدئولوژی مهدویت',
    description: 'آرشیو یکپارچه محتوای چندرسانه‌ای شامل ویدیوها و پادکست‌های مجله مهدویت.',
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function MediaPage() {
  return <MediaPageClient />;
}
