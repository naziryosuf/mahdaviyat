'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PasscodeGateModal } from '@/components/admin/PasscodeGateModal';
import { ShieldCheck, Download, ExternalLink, Lock } from 'lucide-react';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';

export default function SecretAdminGatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      
      {/* Top Emblem Header */}
      <div className="text-center space-y-3">
        <KaabaUnityLogo size="lg" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B889A]/15 border border-[#1B889A]/30 text-[#1B889A] text-xs font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>درگاه اختصاصی و امنیتی مدیران سامانه</span>
        </div>
      </div>

      {/* Security Gate Form */}
      <PasscodeGateModal onSuccess={handleSuccess} />

      {/* Secret Shortcut Download Section for Admins */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 text-center space-y-4 max-w-md mx-auto modern-card">
        <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1B889A]" />
          <span>دانلود فایل میانبر اختصاصی دسترسی به ادمین</span>
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          شما می‌توانید فایل شورت‌کات میانبر مرورگر را دانلود و در رایانه خود ذخیره کنید. با دبل کلیک روی آن (در هر دامنه‌ای که سایت نصب باشد) مستقیماً وارد این صفحه ادمین می‌شوید.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          <a
            href="/admin_access.html"
            download="admin_access.html"
            className="px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود فایل میانبر (HTML)</span>
          </a>

          <a
            href="/admin_portal.url"
            download="admin_portal.url"
            className="px-4 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#1B889A]" />
            <span>فایل شورت‌کات سیستم (.url)</span>
          </a>
        </div>
      </div>

    </div>
  );
}
