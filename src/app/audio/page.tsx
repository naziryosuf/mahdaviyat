import { Metadata } from 'next';
import { AudioPageClient } from './AudioPageClient';

export const metadata: Metadata = {
  title: 'آرشیو محتوای صوتی و پادکست‌ها',
  description: 'شنیدن پادکست‌ها، سخنرانی‌ها و مقالات صوتی مجله ایدئولوژی مهدویت به صورت آنلاین و با کیفیت بالا.',
  openGraph: {
    title: 'پادکست‌ها و محتوای صوتی ایدئولوژی مهدویت',
    description: 'شنیدن پادکست‌ها، سخنرانی‌ها و مقالات صوتی مجله ایدئولوژی مهدویت به صورت آنلاین و با کیفیت بالا.',
    url: 'https://www.ideologymahdaviyat.org/audio',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'پادکست‌های ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'پادکست‌ها و محتوای صوتی ایدئولوژی مهدویت',
    description: 'شنیدن پادکست‌ها، سخنرانی‌ها و مقالات صوتی مجله ایدئولوژی مهدویت.',
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function AudioPage() {
  return <AudioPageClient />;
}
