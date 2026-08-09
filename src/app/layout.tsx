import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PersistentAudioBar } from "@/components/audio/PersistentAudioBar";

export const metadata: Metadata = {
  title: "مجله مستقل فکری-شناختی ایدئولوژی مهدویت",
  description: "نشریه مستقل علمی، تحلیلی و شناختی ایدئولوژی مهدویت به زبان‌های دری، پښتو و انگلیسی.",
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
    <html lang="fa-AF" dir="rtl" className="dark">
      <body className="antialiased bg-[var(--bg-color)] text-[var(--text-primary)] min-h-screen flex flex-col justify-between">
        <div className="flex-1">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Footer />
        <PersistentAudioBar />
      </body>
    </html>
  );
}
