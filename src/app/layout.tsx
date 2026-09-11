import type { Metadata } from "next";
import "./globals.css";
import { AppClientLayoutWrapper } from "@/components/layout/AppClientLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ideologymahdaviyat.org'),
  title: {
    default: "مجلۀ علمی - معنوی ایدئولوژی مهدویت",
    template: "%s | مجلۀ علمی - معنوی ایدئولوژی مهدویت",
  },
  description: "تلاش فرهنگی برای ایجاد بیداری معنوی و اجتماعی",
  icons: {
    icon: "/logo_calligraphy.png",
    shortcut: "/logo_calligraphy.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "مجلۀ علمی - معنوی ایدئولوژی مهدویت",
    description: "تلاش فرهنگی برای ایجاد بیداری معنوی و اجتماعی",
    url: "https://www.ideologymahdaviyat.org",
    siteName: "مجلۀ علمی - معنوی ایدئولوژی مهدویت",
    images: [
      {
        url: "/official_logo.jpg",
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
    title: "مجلۀ علمی - معنوی ایدئولوژی مهدویت",
    description: "تلاش فرهنگی برای ایجاد بیداری معنوی و اجتماعی",
    images: ["/official_logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-AF" dir="ltr" suppressHydrationWarning>
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
      <body className="antialiased bg-[var(--bg-color)] text-[var(--text-primary)] min-h-screen flex flex-col justify-between" dir="rtl" suppressHydrationWarning>
        <AppClientLayoutWrapper>
          {children}
        </AppClientLayoutWrapper>
      </body>
    </html>
  );
}
