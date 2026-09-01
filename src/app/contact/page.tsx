import { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'ارتباط با ما و ارسال آثار',
  description: 'ارتباط مستقیم با هیئت تحریریه، ارسال مقالات و نظرات، و همکاری با مجله ایدئولوژی مهدویت.',
  openGraph: {
    title: 'ارتباط با ما | مجله ایدئولوژی مهدویت',
    description: 'ارتباط مستقیم با هیئت تحریریه، ارسال مقالات و نظرات، و همکاری با مجله ایدئولوژی مهدویت.',
    url: 'https://www.ideologymahdaviyat.org/contact',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: '/kaaba_unity_logo.jpg',
        width: 800,
        height: 800,
        alt: 'ارتباط با مجله ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ارتباط با ما | مجله ایدئولوژی مهدویت',
    description: 'ارتباط مستقیم با هیئت تحریریه و ارسال مقالات به مجله ایدئولوژی مهدویت.',
    images: ['/kaaba_unity_logo.jpg'],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
