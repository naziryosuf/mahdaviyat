import type { Metadata } from "next";
import "./globals.css";
import { AppClientLayoutWrapper } from "@/components/layout/AppClientLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ideologymahdaviyat.org'),
  title: {
    default: "مجله مستقل فکری-شناختی ایدئولوژی مهدویت",
    template: "%s | مجله ایدئولوژی مهدویت",
  },
  description: "نشریه مستقل علمی، تحلیلی و شناختی ایدئولوژی مهدویت - بستر اندیشه، فلسفه، جهان‌بینی توحیدی و معرفت دینی.",
  icons: {
    icon: "/logo_calligraphy.png",
    shortcut: "/logo_calligraphy.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "مجله مستقل فکری-شناختی ایدئولوژی مهدویت",
    description: "نشریه مستقل علمی، تحلیلی و شناختی ایدئولوژی مهدویت.",
    url: "https://www.ideologymahdaviyat.org",
    siteName: "ایدئولوژی مهدویت",
    images: [
      {
        url: "/kaaba_unity_logo.jpg",
        width: 800,
        height: 800,
        alt: "لوگوی رسمی مجله ایدئولوژی مهدویت",
      },
    ],
    locale: "fa_AF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مجله مستقل فکری-شناختی ایدئولوژی مهدویت",
    description: "نشریه مستقل علمی، تحلیلی و شناختی ایدئولوژی مهدویت.",
    images: ["/kaaba_unity_logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-AF" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var userSet = localStorage.getItem('mahdism_theme_user_set');
                  var isDark;
                  if (userSet === 'dark') {
                    isDark = true;
                  } else if (userSet === 'light') {
                    isDark = false;
                  } else {
                    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[var(--bg-color)] text-[var(--text-primary)] min-h-screen flex flex-col justify-between" suppressHydrationWarning>
        <AppClientLayoutWrapper>
          {children}
        </AppClientLayoutWrapper>
      </body>
    </html>
  );
}
