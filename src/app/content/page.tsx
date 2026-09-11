import { Metadata } from 'next';
import { ContentCatalogClient } from './ContentCatalogClient';

export const metadata: Metadata = {
  title: 'نوشته‌ها و یادداشت‌های تحلیلی',
  description: 'مجموعه نوشته‌ها، مقالات، یادداشت‌های تحلیلی و مقالات پژوهشی مجلۀ علمی - معنوی ایدئولوژی مهدویت.',
  openGraph: {
    title: 'نوشته‌ها و یادداشت‌های تحلیلی ایدئولوژی مهدویت',
    description: 'مجموعه نوشته‌ها، مقالات، یادداشت‌های تحلیلی و مقالات پژوهشی مجلۀ علمی - معنوی ایدئولوژی مهدویت.',
    url: 'https://www.ideologymahdaviyat.org/content',
    siteName: 'مجلۀ علمی - معنوی ایدئولوژی مهدویت',
    images: [
      {
        url: '/official_logo.jpg',
        width: 800,
        height: 800,
        alt: 'نوشته‌های ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نوشته‌ها و یادداشت‌های تحلیلی ایدئولوژی مهدویت',
    description: 'مجموعه نوشته‌ها، مقالات و یادداشت‌های پژوهشی مجله ایدئولوژی مهدویت.',
    images: ['/official_logo.jpg'],
  },
};

export default function ContentCatalogPage() {
  return <ContentCatalogClient />;
}
