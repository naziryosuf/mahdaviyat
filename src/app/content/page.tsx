import { Metadata } from 'next';
import { ContentCatalogClient } from './ContentCatalogClient';

export const metadata: Metadata = {
  title: 'آرشیو مقالات و پژوهش‌ها',
  description: 'مجموعه مقالات، یادداشت‌های تحلیلی، مقالات پژوهشی و گفتمان‌های فکری مجله مستقل ایدئولوژی مهدویت.',
  openGraph: {
    title: 'آرشیو مقالات و پژوهش‌های ایدئولوژی مهدویت',
    description: 'مجموعه مقالات، یادداشت‌های تحلیلی و مقالات پژوهشی مجله ایدئولوژی مهدویت.',
    url: 'https://www.ideologymahdaviyat.org/content',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: '/kaaba_unity_logo.jpg',
        width: 800,
        height: 800,
        alt: 'آرشیو مقالات ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آرشیو مقالات و پژوهش‌های ایدئولوژی مهدویت',
    description: 'مجموعه مقالات و یادداشت‌های پژوهشی مجله ایدئولوژی مهدویت.',
    images: ['/kaaba_unity_logo.jpg'],
  },
};

export default function ContentCatalogPage() {
  return <ContentCatalogClient />;
}
