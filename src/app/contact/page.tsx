'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Mail, Send, CheckCircle2, Paperclip, MessageCircle, Globe, MapPin, AlertCircle, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const { addContactMessage } = useStore();
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFileDataUrl(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senderName && email && message) {
      
      // Submit DIRECTLY to Admin Panel Database
      addContactMessage({
        sender_name: senderName,
        email,
        subject: subject || 'پیام جدید از فرم تماس',
        message,
        file_name: selectedFile ? selectedFile.name : undefined,
        file_url: fileDataUrl,
      });

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setSubmitted(true);
      setSenderName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSelectedFile(null);
      setFileDataUrl(undefined);

      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-10 shadow-xl space-y-3 modern-card">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full teal-badge text-xs font-bold shadow-sm">
          <Mail className="w-3.5 h-3.5 text-[#1B889A]" />
          <span>ارتباط مستقیم با مجله ایدئولوژی مهدویت</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] font-serif-persian">ارتباط با ما</h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-serif-persian leading-relaxed">
          پیشنهادات، نوشته‌ها و پرسش‌های خود را مستقیماً با مجله ایدئولوژی مهدویت در میان بگذارید.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 modern-card">
          <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">فرم ارسال پیام</h2>

          {submitted && (
            <div className="p-4 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#1B889A] shrink-0" />
              <span>پیام و فایل پیوست شما با موفقیت ثبت گردید. گروه کاری مجله آن را بررسی خواهد نمود.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. نام و تخلص کامل * */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">نام و تخلص کامل *</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="مثال: احمد محمودی"
                className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#1B889A] transition-colors"
              />
            </div>

            {/* 2. آدرس ایمیل * */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">آدرس ایمیل *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-xs text-[var(--text-primary)] dir-ltr text-right focus:outline-none focus:border-[#1B889A] transition-colors font-mono"
              />
            </div>

            {/* 3. موضوع پیام */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">موضوع پیام</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: ارسال مقاله، پرسش علمی..."
                className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#1B889A] transition-colors"
              />
            </div>

            {/* 4. آپلود و ارسال فایل (اختیاری) */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] block mb-1 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#1B889A]" />
                <span>آپلود و پیوست فایل یا مقاله (اختیاری):</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.zip,.rar,.mp3,.mp4,.jpg,.png"
                className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1B889A] file:text-white hover:file:bg-[#156d7b] file:cursor-pointer bg-[var(--bg-color)] p-2 rounded-2xl border border-[var(--card-border)]"
              />
              {selectedFile && (
                <p className="text-[11px] text-[#1B889A] mt-1 font-bold">
                  فایل آماده ارسال: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* 5. متن پیام (فارسی دری) * */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">متن پیام (فارسی دری) *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-xs text-[var(--text-primary)] font-serif-persian focus:outline-none focus:border-[#1B889A] transition-colors"
              />
            </div>

            {/* 6. GUIDELINES BOX BEFORE SUBMISSION */}
            <div className="p-4 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 space-y-2 text-xs text-[var(--text-secondary)] font-serif-persian">
              <div className="flex items-center gap-2 font-bold text-[#1B889A]">
                <AlertCircle className="w-4 h-4" />
                <span>قبل از ارسال مطلب لطفا نکات زیر را مراعات نمایید:</span>
              </div>
              <ul className="space-y-1.5 pr-5 list-disc leading-relaxed text-[11px]">
                <li><strong className="text-[var(--text-primary)]">اصالت و مالکیت:</strong> مطلب متعلق به خودتان باشد (در صورت داشتن همکار، ذکر نام نویسندگان الزامی است).</li>
                <li><strong className="text-[var(--text-primary)]">انتشار اول:</strong> اثر نباید قبلاً در جایی منتشر شده باشد.</li>
                <li><strong className="text-[var(--text-primary)]">محدودیت هوش مصنوعی:</strong> محتوا نباید تولیدشده توسط هوش مصنوعی باشد (استفاده از آن صرفاً برای ویرایش متن بلامانع است و در غیر این صورت توسط گروه کاری رد خواهد شد).</li>
                <li><strong className="text-[var(--text-primary)]">ارجاعدهی معیاری:</strong> استفاده از شیوهنامه‌های استاندارد (مانند APA) برای ارجاع درون‌متنی و تنظیم فهرست منابع الزامی است.</li>
              </ul>
            </div>

            {/* 7. دکمه ارسال پیام */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shadow-md shadow-[#1B889A]/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>ارسال پیام</span>
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-xl space-y-4 modern-card">
            <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian border-b border-[var(--card-border)] pb-3">اطلاعات ارتباطی مستقیم</h3>
            
            <div className="space-y-4 text-xs text-[var(--text-secondary)]">
              
              {/* Official Email */}
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-10 h-10 rounded-xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">ایمیل رسمی مجله:</span>
                  <a href="mailto:ideology.mahdaviyat@gmail.com" className="font-mono text-sm font-bold text-[#1B889A] hover:underline">
                    ideology.mahdaviyat@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-10 h-10 rounded-xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">واتساپ و تلگرام مستقیم:</span>
                  <a href="https://wa.me/4917689062903" target="_blank" rel="noreferrer" className="font-mono text-sm font-bold text-[var(--text-primary)] hover:text-[#1B889A] dir-ltr block text-right">
                    +49 176 89062903
                  </a>
                </div>
              </div>

              {/* System Language */}
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">زبان سامانه:</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">فارسی دری (RTL) | پښتو | English</span>
                </div>
              </div>

              {/* Central Office */}
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">مجله ایدئولوژی مهدویت</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">نویسندگان جوان و آزاد افغانستان</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
