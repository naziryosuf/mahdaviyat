'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Newspaper, 
  FileText, 
  Layers, 
  Info, 
  Mail, 
  Menu, 
  X, 
  Sun,
  Moon,
  Music,
  Globe,
  ChevronDown,
  Check,
  Search,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { translations } from '@/data/translations';
import { KaabaUnityLogo } from '@/components/common/KaabaUnityLogo';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [langNotice, setLangNotice] = useState<{ title: string; message: string; closeLabel: string } | null>(null);
  
  const langRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { 
    currentAudio, 
    initFromStorage, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme 
  } = useStore();

  const t = translations[language] || translations.fa;

  useEffect(() => {
    initFromStorage();
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [initFromStorage]);

  useEffect(() => {
    if (searchDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchDropdownOpen]);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = quickQuery.trim();
    if (!query) return;
    setSearchDropdownOpen(false);
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const handlePashtoClick = () => {
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
    setLangNotice({
      title: 'پښتو ژبه',
      message: 'پښتو برخه لا هم تر کار لاندې ده.',
      closeLabel: 'تړل'
    });
  };

  const handleEnglishClick = () => {
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
    setLangNotice({
      title: 'English Section',
      message: 'The English section is currently under development.',
      closeLabel: 'Close'
    });
  };

  const navLinks = [
    { href: '/', label: t.home, icon: BookOpen },
    { href: '/magazine', label: t.magazine, icon: Newspaper },
    { href: '/content', label: t.content, icon: FileText },
    { href: '/media', label: t.media, icon: Layers },
    { href: '/about', label: t.about, icon: Info },
    { href: '/contact', label: t.contact, icon: Mail },
  ];

  const languageLabels = {
    fa: 'دری',
    ps: 'پښتو',
    en: 'English',
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-panel shadow-2xl py-2.5 sm:py-3 border-b border-[var(--card-border)]' 
          : 'bg-[var(--nav-bg)] backdrop-blur-md py-3 sm:py-4 border-b border-[var(--card-border)]'
      }`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo with Kaaba & Unity Hands Emblem */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <KaabaUnityLogo size="md" />
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-[var(--text-primary)] block leading-none font-serif-persian">
                  {t.siteTitle}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1B889A] block pt-0.5 leading-none font-serif-persian">
                  {t.subTitle}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Pills */}
            <nav className="hidden lg:flex items-center gap-1 bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[var(--card-border)] shadow-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#1B889A] text-white shadow-md shadow-[#1B889A]/30'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#1B889A]/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1B889A]'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Audio Indicator Pill */}
              {currentAudio && (
                <Link 
                  href="/media?tab=audio" 
                  className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B889A]/20 border border-[#1B889A]/50 text-[#1B889A] dark:text-cyan-300 text-xs font-bold animate-pulse shadow-md"
                >
                  <Music className="w-3.5 h-3.5 text-[#1B889A] animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="max-w-[90px] truncate">{currentAudio.title_fa}</span>
                </Link>
              )}

              {/* QUICK DROPDOWN SEARCH BOX UNDER MAGNIFYING GLASS ICON */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                  className={`p-2 sm:p-2.5 rounded-xl border transition-all shadow-sm active:scale-95 flex items-center justify-center ${
                    searchDropdownOpen
                      ? 'bg-[#1B889A] text-white border-[#1B889A]'
                      : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[#1B889A] hover:bg-[#1B889A]/10 hover:border-[#1B889A]'
                  }`}
                  title="جستجوی سریع در سایت"
                  aria-label="جستجو"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* SEARCH INPUT DROPDOWN POPOVER DIRECTLY UNDER ICON */}
                {searchDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-2xl shadow-2xl p-2.5 sm:p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <form onSubmit={handleQuickSearchSubmit} className="relative flex items-center">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={quickQuery}
                        onChange={(e) => setQuickQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="w-full pl-20 pr-3 py-2 sm:py-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#1B889A] font-serif-persian"
                      />
                      <button
                        type="submit"
                        className="absolute left-1 top-1 bottom-1 px-3 rounded-lg bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                      >
                        <Search className="w-3 h-3" />
                        <span>جستجو</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* COMPACT LANGUAGE DROPDOWN MENU */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[11px] sm:text-xs font-bold text-[var(--text-primary)] hover:border-[#1B889A] transition-all shadow-sm active:scale-95"
                  title="تغییر زبان"
                >
                  <Globe className="w-3.5 h-3.5 text-[#1B889A]" />
                  <span>{languageLabels[language]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN POPOVER MENU */}
                {langDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-36 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => { setLanguage('fa'); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        language === 'fa' 
                          ? 'bg-[#1B889A] text-white shadow-sm' 
                          : 'text-[var(--text-primary)] hover:bg-[#1B889A]/10'
                      }`}
                    >
                      <span>دری</span>
                      {language === 'fa' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={handlePashtoClick}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-[#1B889A]/10 transition-all opacity-80"
                    >
                      <span>پښتو</span>
                    </button>

                    <button
                      onClick={handleEnglishClick}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-[#1B889A]/10 transition-all opacity-80"
                    >
                      <span>English</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Switcher Button */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-amber-400 hover:text-amber-300 transition-all shadow-sm active:scale-95"
                title={theme === 'dark' ? 'تم روشن' : 'تم تاریک مدرن'}
                aria-label="تغییر تم"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="منو"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#1B889A]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-[var(--card-border)] bg-[var(--card-bg)] rounded-2xl p-3.5 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setLanguage('fa'); setMobileMenuOpen(false); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      language === 'fa' ? 'bg-[#1B889A] text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    دری
                  </button>
                  <button
                    onClick={handlePashtoClick}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white"
                  >
                    پښتو
                  </button>
                  <button
                    onClick={handleEnglishClick}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white"
                  >
                    English
                  </button>
                </div>

                <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-800 text-amber-400">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#1B889A] text-white shadow-md'
                        : 'text-[var(--text-primary)] hover:bg-[#1B889A]/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#1B889A]" />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* LANGUAGE NOT-AVAILABLE MODAL POPUP (EXACT CENTER OF SCREEN) */}
      {langNotice && (
        <div className="fixed inset-0 z-[9999] top-0 left-0 w-screen h-screen min-h-screen flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl text-center modern-card relative my-auto">
            
            <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/20 border border-[#1B889A] text-[#1B889A] flex items-center justify-center mx-auto shadow-md">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-[var(--text-primary)] font-serif-persian">
                {langNotice.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed dir-auto font-serif-persian">
                {langNotice.message}
              </p>
            </div>

            <button
              onClick={() => setLangNotice(null)}
              className="w-full py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {langNotice.closeLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
