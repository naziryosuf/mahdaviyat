import type { Metadata } from "next";
import "./globals.css";
import { AppClientLayoutWrapper } from "@/components/layout/AppClientLayoutWrapper";

export const metadata: Metadata = {
  title: "مجله مستقل فکری-شناختی ایدئولوژی مهدویت",
  description: "نشریه مستقل علمی، تحلیلی و شناختی ایدئولوژی مهدویت.",
  icons: {
    icon: "/kaaba_logo_official.jpg",
    shortcut: "/kaaba_logo_official.jpg",
    apple: "/kaaba_logo_official.jpg",
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
