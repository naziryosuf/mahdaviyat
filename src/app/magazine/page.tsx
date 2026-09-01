import { Metadata } from 'next';
import { MagazineCatalogClient } from './MagazineCatalogClient';

export const metadata: Metadata = {
  title: 'آرشیو مجله دیجیتالی',
  description: 'مطالعه آنلاین و دانلود رایگان شماره‌های رسمی مجله علمی، تحلیلی و شناختی ایدئولوژی مهدویت با کیفیت بالا.',
  openGraph: {
    title: 'آرشیو مجله دیجیتالی ایدئولوژی مهدویت',
    description: 'مطالعه آنلاین و دانلود رایگان شماره‌های رسمی مجله علمی، تحلیلی و شناختی ایدئولوژی مهدویت با کیفیت بالا.',
    url: 'https://www.ideologymahdaviyat.org/magazine',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'مجله دیجیتالی ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آرشیو مجله دیجیتالی ایدئولوژی مهدویت',
    description: 'مطالعه آنلاین و دانلود رایگان شماره‌های رسمی مجله ایدئولوژی مهدویت.',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function MagazinePage() {
  return <MagazineCatalogClient />;
}
