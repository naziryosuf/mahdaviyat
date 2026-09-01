import { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'درباره ما و اعضای هیئت تحریریه',
  description: 'معرفی رسالت، اهداف فکری، چشم‌انداز و اعضای هیئت تحریریه و نویسندگان مجله مستقل ایدئولوژی مهدویت.',
  openGraph: {
    title: 'درباره مجله ایدئولوژی مهدویت و هیئت تحریریه',
    description: 'معرفی رسالت، اهداف فکری، چشم‌انداز و اعضای هیئت تحریریه و نویسندگان مجله مستقل ایدئولوژی مهدویت.',
    url: 'https://www.ideologymahdaviyat.org/about',
    siteName: 'ایدئولوژی مهدویت',
    images: [
      {
        url: '/kaaba_unity_logo.jpg',
        width: 800,
        height: 800,
        alt: 'درباره مجله ایدئولوژی مهدویت',
      },
    ],
    locale: 'fa_AF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'درباره مجله ایدئولوژی مهدویت',
    description: 'معرفی رسالت، اهداف فکری و هیئت تحریریه مجله ایدئولوژی مهدویت.',
    images: ['/kaaba_unity_logo.jpg'],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
