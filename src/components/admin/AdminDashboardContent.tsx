'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit,
  FileText, 
  Newspaper, 
  Video, 
  Volume2, 
  LogOut, 
  CheckCircle2, 
  X, 
  Users,
  Database,
  Mail,
  Check,
  Save,
  Lock,
  Smartphone,
  History,
  AlertCircle,
  RotateCcw,
  UserPlus,
  KeyRound,
  Info,
  HardDrive,
  Globe,
  ExternalLink,
  Upload,
  Eye,
  Download,
  Zap,
  Sparkles,
  Clock,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Pin,
  PinOff
} from 'lucide-react';
import { calculateReadingTimeFa } from '@/utils/readingTime';
import { compressImageFile } from '@/utils/imageCompressor';
import { uploadMagazineFile } from '@/utils/storageUpload';
import { Article, MagazineIssue, VideoItem, AudioItem, TeamMember, ContactMessage, CoHostUser } from '@/types';

const parseTagsInput = (str: string): string[] => {
  if (!str || !str.trim()) return [];
  const stopWords = ['در', 'به', 'از', 'با', 'و', 'یا', 'بر', 'که', 'را', 'ان', 'این'];
  
  if (str.includes('#')) {
    return str
      .split('#')
      .map(t => t.trim().replace(/[,،]/g, ''))
      .filter(t => t.length > 1 && !stopWords.includes(t))
      .map(t => `#${t}`);
  }
  
  return str
    .split(/[,،]+/)
    .map(t => t.trim().replace(/^#/, ''))
    .filter(t => t.length > 1 && !stopWords.includes(t))
    .map(t => `#${t}`);
};

export const AdminDashboardContent: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin, 
    coHosts,
    currentUser,
    addCoHost,
    updateCoHost,
    deleteCoHost,
    auditLogs,
    stagedChangesCount,
    hasUnsavedChanges,
    saveAllChangesToLive,
    discardStagedChanges,
    approvePendingItem,
    rejectPendingItem,
    articles, 
    magazineIssues, 
    videos, 
    audios,
    teamMembers,
    contactMessages,
    markContactRead,
    deleteContactMessage,
    aboutUsMission,
    setAboutUsMission,
    designerName,
    setDesignerName,
    designerWebsiteUrl,
    setDesignerWebsiteUrl,
    addArticle,
    updateArticle,
    deleteArticle,
    addMagazineIssue,
    updateMagazineIssue,
    deleteMagazineIssue,
    addVideo,
    updateVideo,
    deleteVideo,
    addAudio,
    updateAudio,
    deleteAudio,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useStore();

  const isSuperAdmin = currentUser?.is_super_admin || currentUser?.password_code === '190716';

  const userPerms = currentUser?.permissions || {
    can_manage_articles: true,
    can_manage_magazines: true,
    can_manage_videos: true,
    can_manage_audios: true,
    can_manage_team: true,
    can_manage_messages: true,
    can_manage_cohosts: isSuperAdmin,
    can_direct_publish: isSuperAdmin,
    can_manage_about: isSuperAdmin,
    can_view_storage: isSuperAdmin,
  };

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'articles' | 'magazines' | 'videos' | 'audios' | 'team' | 'messages' | 'cohosts' | 'audit_logs' | 'about' | 'storage' | 'footer_designer'>('articles');

  // Save Success Notification Toast
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGlobalSave = async () => {
    setIsSaving(true);
    setSaveToast({ msg: 'در حال ذخیره و همگام‌سازی اطلاعات در دیتابیس ابری...', type: 'loading' });

    try {
      await saveAllChangesToLive();
      setSaveToast({ msg: '✅ تمام تغییرات با موفقیت در دیتابیس ابری منتشر گردید!', type: 'success' });
      setTimeout(() => setSaveToast(null), 3500);
    } catch (err: any) {
      console.error('Error in handleGlobalSave:', err);
      setSaveToast({ msg: `❌ خطا در همگام‌سازی: ${err?.message || 'مشکلی رخ داد'}`, type: 'error' });
      setTimeout(() => setSaveToast(null), 5000);
    } finally {
      setIsSaving(false);
      discardStagedChanges(); // Force reset queue to zero
    }
  };

  // Co-Host Modal State
  const [showCoHostModal, setShowCoHostModal] = useState(false);
  const [editingCoHost, setEditingCoHost] = useState<CoHostUser | null>(null);
  const [coHostName, setCoHostName] = useState('');
  const [coHostPassword, setCoHostPassword] = useState('');
  const [coHostRole, setCoHostRole] = useState('ویرایشگر محتوا');
  const [permArticles, setPermArticles] = useState(true);
  const [permMagazines, setPermMagazines] = useState(true);
  const [permVideos, setPermVideos] = useState(true);
  const [permAudios, setPermAudios] = useState(true);
  const [permTeam, setPermTeam] = useState(false);
  const [permMessages, setPermMessages] = useState(false);
  const [permDirectPublish, setPermDirectPublish] = useState(false);
  const [permManageAbout, setPermManageAbout] = useState(false);
  const [permViewStorage, setPermViewStorage] = useState(false);

  const openAddCoHost = () => {
    setEditingCoHost(null);
    setCoHostName('');
    setCoHostPassword('');
    setCoHostRole('همکار / ویرایشگر محتوا');
    setPermArticles(true);
    setPermMagazines(true);
    setPermVideos(true);
    setPermAudios(true);
    setPermTeam(false);
    setPermMessages(false);
    setPermDirectPublish(false);
    setPermManageAbout(false);
    setPermViewStorage(false);
    setShowCoHostModal(true);
  };

  const openEditCoHost = (ch: CoHostUser) => {
    setEditingCoHost(ch);
    setCoHostName(ch.name_fa || '');
    setCoHostPassword(ch.password_code || '');
    setCoHostRole(ch.role_fa || '');
    setPermArticles(!!ch.permissions.can_manage_articles);
    setPermMagazines(!!ch.permissions.can_manage_magazines);
    setPermVideos(!!ch.permissions.can_manage_videos);
    setPermAudios(!!ch.permissions.can_manage_audios);
    setPermTeam(!!ch.permissions.can_manage_team);
    setPermMessages(!!ch.permissions.can_manage_messages);
    setPermDirectPublish(!!ch.permissions.can_direct_publish);
    setPermManageAbout(!!ch.permissions.can_manage_about);
    setPermViewStorage(!!ch.permissions.can_view_storage);
    setShowCoHostModal(true);
  };

  const handleSaveCoHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (coHostName && coHostPassword) {
      const perms = {
        can_manage_articles: permArticles,
        can_manage_magazines: permMagazines,
        can_manage_videos: permVideos,
        can_manage_audios: permAudios,
        can_manage_team: permTeam,
        can_manage_messages: permMessages,
        can_manage_cohosts: false,
        can_direct_publish: permDirectPublish,
        can_manage_about: permManageAbout,
        can_view_storage: permViewStorage,
      };

      if (editingCoHost) {
        updateCoHost(editingCoHost.id, {
          name_fa: coHostName,
          password_code: coHostPassword.trim(),
          role_fa: coHostRole || 'همکار',
          permissions: perms,
        });
      } else {
        addCoHost({
          name_fa: coHostName,
          password_code: coHostPassword.trim(),
          role_fa: coHostRole || 'همکار',
          is_super_admin: false,
          permissions: perms,
        });
      }
      setShowCoHostModal(false);
    }
  };

  // Article Modal State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState<string>('تحلیل‌ها');
  const [artAuthor, setArtAuthor] = useState('M. Nazir Yosuf');
  const [artAuthorTitle, setArtAuthorTitle] = useState('سردبیر ارشد / پژوهشگر');
  const [artReadTime, setArtReadTime] = useState('۷ دقیقه');
  const [artImage, setArtImage] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');
  const [artTags, setArtTags] = useState('#معرفت‌شناسی, #مهدویت');
  const [artIsEditorial, setArtIsEditorial] = useState(false);
  const [articleCoverFile, setArticleCoverFile] = useState<File | null>(null);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Dynamic Article Categories State
  const [articleCategories, setArticleCategories] = useState<string[]>([
    'سرمقاله‌ها',
    'تحلیل‌ها',
    'نقد مکاتب',
    'شناخت مهدویت',
    'پژوهش‌های تاریخی',
    'یادداشت‌ها'
  ]);
  const [newCatInput, setNewCatInput] = useState('');

  useEffect(() => {
    if (articles && articles.length > 0) {
      const existingCats = Array.from(new Set(articles.map(a => a.category_fa).filter(Boolean)));
      setArticleCategories(prev => Array.from(new Set([...prev, ...existingCats])));
    }
  }, [articles]);

  const handleAddNewCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (!articleCategories.includes(trimmed)) {
      setArticleCategories(prev => [...prev, trimmed]);
    }
    setArtCategory(trimmed);
    setNewCatInput('');
  };

  const handleDeleteCategory = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticleCategories(prev => prev.filter(c => c !== catToDelete));
    if (artCategory === catToDelete) {
      const remaining = articleCategories.filter(c => c !== catToDelete);
      setArtCategory(remaining[0] || 'عمومی');
    }
  };

  const handleArticleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArticleCoverFile(file);
      try {
        const compressed = await compressImageFile(file);
        setArtImage(compressed);
      } catch (err) {
        console.error('Error creating article image preview:', err);
      }
    }
  };

  useEffect(() => {
    if (artContent) {
      setArtReadTime(calculateReadingTimeFa(artContent));
    }
  }, [artContent]);

  const openAddArticle = () => {
    setEditingArticle(null);
    setArtTitle('');
    setArtExcerpt('');
    setArtContent('');
    setArtCategory(articleCategories[0] || 'تحلیل‌ها');
    setArtAuthor(currentUser?.name_fa || 'M. Nazir Yosuf');
    setArtAuthorTitle(currentUser?.role_fa || 'سردبیر ارشد / پژوهشگر');
    setArtImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');
    setArtTags('#معرفت‌شناسی, #مهدویت');
    setArtIsEditorial(false);
    setArticleCoverFile(null);
    setShowArticleModal(true);
  };

  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtTitle(art.title_fa || '');
    setArtExcerpt(art.excerpt_fa || '');
    setArtContent(art.content_fa || '');
    setArtCategory(art.category_fa || 'تحلیل‌ها');
    setArtAuthor(art.author_name_fa || 'M. Nazir Yosuf');
    setArtAuthorTitle(art.author_title_fa || 'سردبیر ارشد / پژوهشگر');
    setArtImage(art.image_url || '');
    setArtTags(art.tags ? art.tags.join(', ') : '#معرفت‌شناسی, #مهدویت');
    setArtIsEditorial(!!art.is_editorial);
    setArticleCoverFile(null);
    setShowArticleModal(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) return;

    setSaveToast({ msg: 'در حال آماده‌سازی و پردازش مقاله...', type: 'loading' });

    try {
      let finalImageUrl = artImage;
      if (articleCoverFile) {
        setSaveToast({ msg: 'در حال آپلود کاور مقاله به حافظه ابری Supabase...', type: 'loading' });
        finalImageUrl = await uploadMagazineFile(articleCoverFile, 'covers');
      }

      const parsedTags = parseTagsInput(artTags);

      if (editingArticle) {
        await updateArticle(editingArticle.id, {
          title_fa: artTitle,
          excerpt_fa: artExcerpt,
          content_fa: artContent,
          category_fa: artCategory,
          author_name_fa: artAuthor,
          author_title_fa: artAuthorTitle,
          image_url: finalImageUrl,
          read_time_fa: artReadTime,
          tags: parsedTags,
          is_editorial: artIsEditorial,
        });
        setSaveToast({ msg: '✅ مقاله با موفقیت بروزرسانی شد!', type: 'success' });
      } else {
        await addArticle({
          title_fa: artTitle,
          slug: `art-${Date.now()}`,
          excerpt_fa: artExcerpt,
          content_fa: artContent,
          category_fa: artCategory,
          author_name_fa: artAuthor,
          author_title_fa: artAuthorTitle,
          author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          read_time_fa: artReadTime,
          published_at: new Date().toLocaleDateString('fa-IR'),
          image_url: finalImageUrl,
          tags: parsedTags,
          featured: false,
          is_editorial: artIsEditorial,
        });
        setSaveToast({ msg: '✅ مقاله جدید با موفقیت منتشر گردید!', type: 'success' });
      }
      setTimeout(() => setSaveToast(null), 3000);
      setShowArticleModal(false);
    } catch (err: any) {
      console.error('Error saving article:', err);
      setSaveToast({ msg: `❌ خطا در ذخیره مقاله: ${err?.message || 'مشکلی رخ داد'}`, type: 'error' });
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  // Magazine Modal State
  const [showMagModal, setShowMagModal] = useState(false);
  const [editingMag, setEditingMag] = useState<MagazineIssue | null>(null);
  const [magNumber, setMagNumber] = useState(1);
  const [magTitle, setMagTitle] = useState('');
  const [magDesc, setMagDesc] = useState('');
  const [magPublishDate, setMagPublishDate] = useState('مرداد ۱۴۰۴');
  const [magCoverImage, setMagCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');
  const [magCoverPosition, setMagCoverPosition] = useState<string>('center');
  const [magPdfUrl, setMagPdfUrl] = useState('/downloads/mahdism_issue_1.pdf');
  const [magAuthorName, setMagAuthorName] = useState('M. Nazir Yosufi');
  const [magAuthorTitle, setMagAuthorTitle] = useState('سردبیر ارشد');
  const [magPageCount, setMagPageCount] = useState('۴۵ صفحه (قطع A4)');
  const [magTags, setMagTags] = useState('#نشریه_کامل, #شماره_یک');

  // Binary File objects for Storage Upload
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSavingMagazine, setIsSavingMagazine] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const [saveToast, setSaveToast] = useState<{ msg: string; type: 'loading' | 'success' | 'error' } | null>(null);

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      try {
        const compressed = await compressImageFile(file);
        setMagCoverImage(compressed);
      } catch (err) {
        console.error('Error creating image preview:', err);
      }
    }
  };

  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      try {
        const previewBlobUrl = URL.createObjectURL(file);
        setMagPdfUrl(previewBlobUrl);
      } catch (err) {
        console.error('Error creating PDF blob preview:', err);
      }
    }
  };

  const openAddMagazine = () => {
    setEditingMag(null);
    setMagNumber(magazineIssues.length + 1);
    setMagTitle('');
    setMagDesc('');
    setMagPublishDate(`سال: ${new Date().toLocaleDateString('fa-IR', { year: 'numeric' })} _ ماه: ${new Date().toLocaleDateString('fa-IR', { month: 'long' })}`);
    setMagCoverImage('');
    setMagCoverPosition('center');
    setMagPdfUrl('');
    setMagAuthorName('نذیر یوسف');
    setMagAuthorTitle('سردبیر ارشد / نویسنده');
    setMagPageCount('');
    setMagTags('#نشریه_کامل, #ایدئولوژی_مهدویت');
    setCoverFile(null);
    setPdfFile(null);
    setUploadStatusMsg('');
    setShowMagModal(true);
  };

  const openEditMagazine = (mag: MagazineIssue) => {
    setEditingMag(mag);
    setMagNumber(mag.issue_number);
    setMagTitle(mag.title_fa);
    setMagDesc(mag.description_fa);
    setMagPublishDate(mag.publish_date_fa);
    setMagCoverImage(mag.cover_image);
    setMagCoverPosition(mag.cover_position || 'center');
    setMagPdfUrl(mag.pdf_url);
    setMagAuthorName(mag.author_name_fa || 'نذیر یوسف');
    setMagAuthorTitle(mag.author_title_fa || 'سردبیر ارشد / نویسنده');
    setMagPageCount(mag.page_count_fa || '');
    setMagTags(mag.tags ? mag.tags.join(', ') : '#نشریه_کامل, #شماره_یک');
    setCoverFile(null);
    setPdfFile(null);
    setUploadStatusMsg('');
    setShowMagModal(true);
  };

  const handleSaveMagazine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magTitle.trim()) return;

    setIsSavingMagazine(true);
    setUploadStatusMsg('در حال آماده‌سازی فایل‌ها برای آپلود...');
    setSaveToast({ msg: 'در حال آماده‌سازی و آپلود فایل‌ها...', type: 'loading' });

    try {
      let finalCoverUrl = magCoverImage;
      let finalPdfUrl = magPdfUrl;

      // 1. Upload Cover Image to Supabase Storage if binary file selected
      if (coverFile) {
        setUploadStatusMsg('در حال آپلود تصویر کاور به حافظه ابری Supabase...');
        setSaveToast({ msg: 'در حال آپلود تصویر کاور به حافظه ابری...', type: 'loading' });
        finalCoverUrl = await uploadMagazineFile(coverFile, 'covers');
      }

      // 2. Upload PDF file to Supabase Storage if binary file selected
      if (pdfFile) {
        setUploadStatusMsg('در حال آپلود فایل PDF مجله به حافظه ابری Supabase (لطفاً منتظر بمانید)...');
        setSaveToast({ msg: 'در حال آپلود فایل PDF مجله (لطفاً منتظر بمانید)...', type: 'loading' });
        finalPdfUrl = await uploadMagazineFile(pdfFile, 'pdfs');
      }

      // 3. Isolated Single-Row Upsert into Supabase & Zustand
      setUploadStatusMsg('در حال ثبت نهایی اطلاعات شماره مجله در دیتابیس...');
      setSaveToast({ msg: 'در حال ثبت نهایی اطلاعات مجله در دیتابیس...', type: 'loading' });

      const parsedTags = parseTagsInput(magTags);

      if (editingMag) {
        await updateMagazineIssue(editingMag.id, {
          issue_number: magNumber,
          title_fa: magTitle,
          description_fa: magDesc,
          publish_date_fa: magPublishDate,
          cover_image: finalCoverUrl,
          cover_position: magCoverPosition,
          pdf_url: finalPdfUrl,
          author_name_fa: magAuthorName,
          author_title_fa: magAuthorTitle,
          page_count_fa: magPageCount,
          tags: parsedTags,
        });
      } else {
        await addMagazineIssue({
          issue_number: magNumber,
          title_fa: magTitle,
          description_fa: magDesc,
          publish_date_fa: magPublishDate,
          cover_image: finalCoverUrl,
          cover_position: magCoverPosition,
          pdf_url: finalPdfUrl,
          author_name_fa: magAuthorName,
          author_title_fa: magAuthorTitle,
          page_count_fa: magPageCount,
          tags: parsedTags,
          pages: [],
          featured: true,
        });
      }

      // 4. Success: Close modal and notify
      setShowMagModal(false);
      setCoverFile(null);
      setPdfFile(null);
      setSaveToast({ msg: '✅ شماره مجله با موفقیت ذخیره و در سایت منتشر گردید!', type: 'success' });
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err: any) {
      console.error('Error in handleSaveMagazine:', err);
      const errMsg = err?.message || 'خطا در ثبت و آپلود فایل مجله';
      setSaveToast({ msg: `❌ خطا: ${errMsg}`, type: 'error' });
      alert(`خطا در ذخیره‌سازی مجله:\n${errMsg}`);
    } finally {
      setIsSavingMagazine(false);
      setUploadStatusMsg('');
    }
  };

  // Video Modal State
  const [showVidModal, setShowVidModal] = useState(false);
  const [editingVid, setEditingVid] = useState<VideoItem | null>(null);
  const [vidTitle, setVidTitle] = useState('');
  const [vidDesc, setVidDesc] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidThumb, setVidThumb] = useState('');
  const [vidDuration, setVidDuration] = useState('۰۵:۰۰');
  const [vidCategory, setVidCategory] = useState('نشست تحلیلی');
  const [vidSpeaker, setVidSpeaker] = useState('استاد علوی');
  const [vidSourceType, setVidSourceType] = useState<'link' | 'upload'>('link');
  const [isUploadingVidFile, setIsUploadingVidFile] = useState(false);

  // Helper to format seconds into Persian MM:SS format
  const formatSecondsToPersianDuration = (totalSeconds: number): string => {
    if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '۰۵:۰۰';
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const toPersianDigits = (str: string) => str.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return toPersianDigits(formatted);
  };

  // Helper to extract duration from File or Direct URL using HTML5 Video
  const extractDurationFromMedia = (source: File | string) => {
    if (typeof source === 'string' && (source.includes('youtube.com') || source.includes('youtu.be') || source.includes('aparat.com'))) {
      // For YouTube/Aparat, analyze metadata via oEmbed
      handleAnalyzeYouTubeUrl(source);
      return;
    }

    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const mediaUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
      video.src = mediaUrl;
      video.onloadedmetadata = () => {
        if (typeof source !== 'string') {
          URL.revokeObjectURL(mediaUrl);
        }
        if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
          const persianDuration = formatSecondsToPersianDuration(video.duration);
          setVidDuration(persianDuration);
          setSaveToast({ msg: `⏱️ مدت زمان ویدیو محاسبه شد: ${persianDuration}`, type: 'success' });
          setTimeout(() => setSaveToast(null), 3000);
        }
      };
      video.onerror = () => {
        if (typeof source !== 'string') {
          URL.revokeObjectURL(mediaUrl);
        }
      };
    } catch (err) {
      console.warn('Auto duration extraction error:', err);
    }
  };

  const handleAnalyzeYouTubeUrl = (url: string) => {
    if (!url) return;

    // Check if direct file link or uploaded video
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('supabase.co')) {
      extractDurationFromMedia(url);
      return;
    }

    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      const autoThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      if (!vidThumb || vidThumb.includes('unsplash')) {
        setVidThumb(autoThumb);
      }
      fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.title && !vidTitle) {
            setVidTitle(data.title);
          }
          if (data?.author_name && (!vidSpeaker || vidSpeaker === 'استاد علوی')) {
            setVidSpeaker(data.author_name);
          }
          setSaveToast({ msg: '⚡ اطلاعات ویدیو از یوتیوب استخراج گردید!', type: 'success' });
          setTimeout(() => setSaveToast(null), 3000);
        })
        .catch(() => {});
    }
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Extract exact duration from file immediately
    extractDurationFromMedia(file);

    try {
      setIsUploadingVidFile(true);
      setUploadStatusMsg('در حال آپلود فایل ویدیو به حافظه ابری دیتابیس (Supabase)...');
      const publicUrl = await uploadMagazineFile(file, 'videos');
      setVidUrl(publicUrl);
      setSaveToast({ msg: '✅ فایل ویدیو با موفقیت آپلود و زمان آن محاسبه شد!', type: 'success' });
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err: any) {
      console.error('Error uploading video file:', err);
      setSaveToast({ msg: `❌ خطا در آپلود فایل ویدیو: ${err?.message || 'مشکلی رخ داد'}`, type: 'error' });
      setTimeout(() => setSaveToast(null), 4000);
    } finally {
      setIsUploadingVidFile(false);
      setUploadStatusMsg('');
    }
  };

  const openAddVideo = () => {
    setEditingVid(null);
    setVidTitle('');
    setVidDesc('');
    setVidUrl('');
    setVidThumb('');
    setVidDuration('۰۵:۰۰');
    setVidCategory('نشست تحلیلی');
    setVidSpeaker('استاد علوی');
    setVidSourceType('link');
    setShowVidModal(true);
  };

  const openEditVideo = (vid: VideoItem) => {
    setEditingVid(vid);
    setVidTitle(vid.title_fa);
    setVidDesc(vid.description_fa);
    setVidUrl(vid.video_url);
    setVidThumb(vid.thumbnail_url);
    setVidDuration(vid.duration_fa);
    setVidCategory(vid.category_fa);
    setVidSpeaker(vid.speaker_fa);
    setVidSourceType(vid.video_url.includes('supabase.co') || vid.video_url.startsWith('file://') ? 'upload' : 'link');
    setShowVidModal(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim()) return;

    try {
      if (editingVid) {
        await updateVideo(editingVid.id, {
          title_fa: vidTitle,
          description_fa: vidDesc,
          video_url: vidUrl,
          thumbnail_url: vidThumb,
          duration_fa: vidDuration,
          category_fa: vidCategory,
          speaker_fa: vidSpeaker,
        });
        setSaveToast({ msg: '✅ ویدیو با موفقیت بروزرسانی شد!', type: 'success' });
      } else {
        await addVideo({
          title_fa: vidTitle,
          description_fa: vidDesc,
          video_url: vidUrl,
          thumbnail_url: vidThumb,
          duration_fa: vidDuration,
          category_fa: vidCategory,
          speaker_fa: vidSpeaker,
          published_at: new Date().toLocaleDateString('fa-IR'),
          featured: true,
        });
        setSaveToast({ msg: '✅ ویدیو جدید با موفقیت ثبت شد!', type: 'success' });
      }
      setTimeout(() => setSaveToast(null), 3000);
      setShowVidModal(false);
    } catch (err: any) {
      console.error('Error saving video:', err);
      setSaveToast({ msg: `❌ خطا در ذخیره ویدیو: ${err?.message || 'مشکلی رخ داد'}`, type: 'error' });
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  // Audio Modal State
  const [showAudModal, setShowAudModal] = useState(false);
  const [editingAud, setEditingAud] = useState<AudioItem | null>(null);
  const [audTitle, setAudTitle] = useState('');
  const [audSpeaker, setAudSpeaker] = useState('استاد حسینی');
  const [audUrl, setAudUrl] = useState('');
  const [audDuration, setAudDuration] = useState('۱۵ دقیقه');
  const [audDesc, setAudDesc] = useState('');
  const [audCategory, setAudCategory] = useState('پادکست صوتی');
  const [audCover, setAudCover] = useState('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioCoverFile, setAudioCoverFile] = useState<File | null>(null);

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      try {
        const previewUrl = URL.createObjectURL(file);
        setAudUrl(previewUrl);
        const tempAudio = document.createElement('audio');
        tempAudio.src = previewUrl;
        tempAudio.onloadedmetadata = () => {
          if (tempAudio.duration && isFinite(tempAudio.duration)) {
            const formatted = formatSecondsToPersianDuration(tempAudio.duration);
            setAudDuration(formatted);
          }
        };
      } catch (err) {
        console.error('Error creating audio blob preview:', err);
      }
    }
  };

  const handleAudioCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioCoverFile(file);
      try {
        const compressed = await compressImageFile(file);
        setAudCover(compressed);
      } catch (err) {
        console.error('Error creating audio cover preview:', err);
      }
    }
  };

  const openAddAudio = () => {
    setEditingAud(null);
    setAudTitle('');
    setAudSpeaker('استاد حسینی');
    setAudUrl('');
    setAudDuration('۱۵ دقیقه');
    setAudDesc('');
    setAudCategory('پادکست صوتی');
    setAudCover('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80');
    setAudioFile(null);
    setAudioCoverFile(null);
    setShowAudModal(true);
  };

  const openEditAudio = (aud: AudioItem) => {
    setEditingAud(aud);
    setAudTitle(aud.title_fa);
    setAudSpeaker(aud.speaker_fa);
    setAudUrl(aud.audio_url);
    setAudDuration(aud.duration_fa);
    setAudDesc(aud.description_fa);
    setAudCategory(aud.category_fa);
    setAudCover(aud.cover_image);
    setAudioFile(null);
    setAudioCoverFile(null);
    setShowAudModal(true);
  };

  const handleSaveAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audTitle.trim()) return;

    setSaveToast({ msg: 'در حال پردازش و ثبت پادکست...', type: 'loading' });

    try {
      let finalAudioUrl = audUrl;
      let finalCoverUrl = audCover;

      if (audioCoverFile) {
        setSaveToast({ msg: 'در حال آپلود کاور پادکست به حافظه ابری Supabase...', type: 'loading' });
        finalCoverUrl = await uploadMagazineFile(audioCoverFile, 'covers');
      }

      if (audioFile) {
        setSaveToast({ msg: 'در حال آپلود فایل صوتی پادکست به حافظه ابری Supabase (لطفاً منتظر بمانید)...', type: 'loading' });
        finalAudioUrl = await uploadMagazineFile(audioFile, 'audios');
      }

      setSaveToast({ msg: 'در حال ثبت نهایی اطلاعات پادکست در دیتابیس...', type: 'loading' });

      if (editingAud) {
        await updateAudio(editingAud.id, {
          title_fa: audTitle,
          speaker_fa: audSpeaker,
          audio_url: finalAudioUrl,
          duration_fa: audDuration,
          description_fa: audDesc,
          category_fa: audCategory,
          cover_image: finalCoverUrl,
        });
        setSaveToast({ msg: '✅ پادکست/فایل صوتی با موفقیت بروزرسانی شد!', type: 'success' });
      } else {
        await addAudio({
          title_fa: audTitle,
          speaker_fa: audSpeaker,
          audio_url: finalAudioUrl,
          duration_fa: audDuration,
          description_fa: audDesc,
          published_at: new Date().toLocaleDateString('fa-IR'),
          category_fa: audCategory,
          cover_image: finalCoverUrl,
          featured: true,
        });
        setSaveToast({ msg: '✅ پادکست جدید با موفقیت منتشر گردید!', type: 'success' });
      }
      setTimeout(() => setSaveToast(null), 3000);
      setShowAudModal(false);
      setAudioFile(null);
      setAudioCoverFile(null);
    } catch (err: any) {
      console.error('Error saving audio:', err);
      setSaveToast({ msg: `❌ خطا در ذخیره پادکست: ${err?.message || 'مشکلی رخ داد'}`, type: 'error' });
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  // Team Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('نویسنده و پژوهشگر');
  const [teamBio, setTeamBio] = useState('');
  const [teamAvatar, setTeamAvatar] = useState('');
  const [teamSpec, setTeamSpec] = useState('تحریریه');
  const [teamOrderIndex, setTeamOrderIndex] = useState<number>(1);
  const [teamAvatarFile, setTeamAvatarFile] = useState<File | null>(null);

  const handleTeamAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamAvatarFile(file);
      try {
        const compressed = await compressImageFile(file);
        setTeamAvatar(compressed);
      } catch (err) {
        console.error('Error creating team avatar preview:', err);
      }
    }
  };

  const openAddTeam = () => {
    setEditingTeam(null);
    setTeamName('');
    setTeamRole('نویسنده و پژوهشگر');
    setTeamBio('پژوهشگر حوزه مهدویت و حکمت اسلامی');
    setTeamAvatar('');
    setTeamSpec('تحریریه');
    setTeamOrderIndex(teamMembers.length + 1);
    setTeamAvatarFile(null);
    setShowTeamModal(true);
  };

  const openEditTeam = (tm: TeamMember) => {
    setEditingTeam(tm);
    setTeamName(tm.name_fa);
    setTeamRole(tm.role_fa);
    setTeamBio(tm.bio_fa);
    setTeamAvatar(tm.avatar_url);
    setTeamSpec(tm.specialization_fa);
    setTeamOrderIndex(tm.order_index || 1);
    setTeamAvatarFile(null);
    setShowTeamModal(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setSaveToast({ msg: 'در حال پردازش و ثبت اطلاعات نویسنده...', type: 'loading' });

    try {
      let finalAvatarUrl = teamAvatar;

      if (teamAvatarFile) {
        setSaveToast({ msg: 'در حال آپلود عکس پروفایل نویسنده به حافظه ابری Supabase...', type: 'loading' });
        finalAvatarUrl = await uploadMagazineFile(teamAvatarFile, 'covers');
      }

      setSaveToast({ msg: 'در حال ثبت نهایی در دیتابیس...', type: 'loading' });

      if (editingTeam) {
        await updateTeamMember(editingTeam.id, {
          name_fa: teamName,
          role_fa: teamRole,
          bio_fa: teamBio,
          avatar_url: finalAvatarUrl,
          specialization_fa: teamSpec,
          order_index: teamOrderIndex,
        });
        setSaveToast({ msg: '✅ اطلاعات نویسنده با موفقیت بروزرسانی شد!', type: 'success' });
      } else {
        await addTeamMember({
          name_fa: teamName,
          role_fa: teamRole,
          bio_fa: teamBio,
          avatar_url: finalAvatarUrl,
          specialization_fa: teamSpec,
          order_index: teamOrderIndex,
        });
        setSaveToast({ msg: '✅ نویسنده جدید با موفقیت اضافه شد!', type: 'success' });
      }
      setTimeout(() => setSaveToast(null), 3000);
      setShowTeamModal(false);
      setTeamAvatarFile(null);
    } catch (err: any) {
      console.error('Error saving team member:', err);
      setSaveToast({ msg: `❌ خطا در ذخیره نویسنده: ${err?.message || 'مشکلی رخ داد'}`, type: 'error' });
      setTimeout(() => setSaveToast(null), 4000);
    }
  };

  const handleMoveTeamMember = (index: number, direction: 'up' | 'down') => {
    const list = [...teamMembers].sort((a, b) => (a.order_index || 99) - (b.order_index || 99));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const currentItem = list[index];
    const targetItem = list[targetIndex];

    const tempOrder = currentItem.order_index || (index + 1);
    const newTargetOrder = targetItem.order_index || (targetIndex + 1);

    updateTeamMember(currentItem.id, { order_index: newTargetOrder });
    updateTeamMember(targetItem.id, { order_index: tempOrder });

    setSaveToast({ msg: `✅ اولویت نویسنده «${currentItem.name_fa}» جابجا شد!`, type: 'success' });
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Pending items count calculation
  const pendingArticles = articles.filter(a => a.status === 'pending_approval');
  const pendingMagazines = magazineIssues.filter(m => m.status === 'pending_approval');
  const pendingVideos = videos.filter(v => v.status === 'pending_approval');
  const pendingAudios = audios.filter(a => a.status === 'pending_approval');
  const pendingTeam = teamMembers.filter(t => t.status === 'pending_approval');

  const totalPendingCount = pendingArticles.length + pendingMagazines.length + pendingVideos.length + pendingAudios.length + pendingTeam.length;

  // Storage Stats Calculation
  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const fullPayloadStr = JSON.stringify({
          articles,
          magazineIssues,
          videos,
          audios,
          teamMembers,
          contactMessages,
          aboutUsMission
        });
        const bytes = new Blob([fullPayloadStr]).size;
        setStorageUsedBytes(bytes);
        const pct = Math.min(Math.round((bytes / (5000 * 1024 * 1024)) * 100 * 100) / 100, 100);
        setStoragePercentage(pct);
      } catch (e) {}
    }
  }, [articles, magazineIssues, videos, audios, teamMembers, contactMessages, aboutUsMission]);

  // About Us Edit Form State
  const [aboutInputText, setAboutInputText] = useState(aboutUsMission);
  const [aboutSavedNotify, setAboutSavedNotify] = useState(false);

  useEffect(() => {
    setAboutInputText(aboutUsMission);
  }, [aboutUsMission]);

  const handleSaveAboutUs = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = aboutInputText.trim();
    if (trimmed) {
      setAboutUsMission(trimmed);
      setAboutSavedNotify(true);
      setTimeout(() => setAboutSavedNotify(false), 3500);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(passcode);
    if (!success) {
      setErrorMsg('کد عبور وارد شده نادرست است.');
    } else {
      setErrorMsg('');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 space-y-6 modern-card shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">
              ورود به پنل مدیریت دیتابیس
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              برای دسترسی به بخش‌های مجاز، کد عبور مدیریت را وارد نمایید.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="کد ورودی مدیر (پیش‌فرض: 190716)"
                className="w-full px-4 py-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-center font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#1B889A]"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-sm transition-all shadow-md active:scale-95"
            >
              ورود به پنل کامل مدیریت
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 relative">
      
      {/* Toast Save Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 left-6 z-[9999] bg-[#1B889A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-white/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div>
            <h4 className="text-xs font-bold font-serif-persian">تغییرات با موفقیت ذخیره شد</h4>
            <p className="text-[11px] text-white/80">تمام ویرایش‌ها و آپلودها در Supabase و سایت آنلاین ثبت گردیدند.</p>
          </div>
        </div>
      )}

      {/* STICKY TOP HEADER WITH GLOBAL SAVE BUTTON */}
      <div className="bg-[var(--card-bg)] border-2 border-[#1B889A]/40 rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 modern-card shadow-xl sticky top-20 z-40 backdrop-blur-md bg-opacity-95">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/15 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                خوش آمدید {isSuperAdmin ? 'M. Nazir Yosuf' : (currentUser?.name_fa || 'مدیر سامانه')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] sm:text-[11px] font-bold">
                {isSuperAdmin ? 'سردبیر ارشد (NAZIR YOSUF) 👑' : currentUser?.role_fa || 'همکار'}
              </span>
            </div>
            <p className="text-xs text-[#1B889A] font-bold mt-0.5 flex items-center gap-1.5">
              <span>{isSuperAdmin ? 'کنترل کامل وب‌سایت و آپلود محتوا در دیتابیس ابری' : `ورود با اکانت: ${currentUser?.name_fa}`}</span>
            </p>
          </div>
        </div>

        {/* TOP RIGHT ACTIONS: SAVE & DISCARD & LOGOUT */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          <div className="flex items-center gap-2">
            {(hasUnsavedChanges || stagedChangesCount > 0) && (
              <button
                onClick={() => {
                  setIsSaving(false);
                  discardStagedChanges();
                }}
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="لغو تغییرات و ریست صف ذخیره‌سازی"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">انصراف</span>
              </button>
            )}

            <button
              onClick={handleGlobalSave}
              onDoubleClick={() => {
                setIsSaving(false);
                discardStagedChanges();
              }}
              disabled={isSaving}
              title="دوبار کلیک جهت پاک‌سازی اضطراری صف ذخیره‌سازی"
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                hasUnsavedChanges || stagedChangesCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse shadow-emerald-600/30'
                  : 'bg-[#1B889A] hover:bg-[#156d7b] text-white shadow-[#1B889A]/30'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره و انتشار روی وب‌سایت (SAVE)'}</span>
              {stagedChangesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-[10px] font-black flex items-center justify-center">
                  {stagedChangesCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            title="خروج از پنل"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>

      </div>

      {/* FLOATING STATUS TOAST FOR INSTANT NON-BLOCKING SAVING */}
      {saveToast && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold shadow-xl animate-in slide-in-from-top-4 duration-300 ${
          saveToast.type === 'loading'
            ? 'bg-[#1B889A]/15 border-[#1B889A]/50 text-[#1B889A] animate-pulse'
            : saveToast.type === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
            : 'bg-red-500/15 border-red-500/50 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {saveToast.type === 'loading' && (
              <div className="w-4 h-4 border-2 border-[#1B889A] border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            <span>{saveToast.msg}</span>
          </div>
          {saveToast.type !== 'loading' && (
            <button onClick={() => setSaveToast(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* NAVIGATION TABS FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Pending Approvals Queue Tab */}
          {(isSuperAdmin || userPerms.can_direct_publish) && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'pending' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-[var(--card-bg)] text-amber-500 border border-amber-500/30 hover:border-amber-500'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>در انتظار تایید</span>
              {totalPendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-bounce">
                  {totalPendingCount}
                </span>
              )}
            </button>
          )}

          {/* Audit Logs Tab */}
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'audit_logs' 
                ? 'bg-[#1B889A] text-white shadow-md' 
                : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:text-[var(--text-primary)]'
            }`}
          >
            <History className="w-4 h-4 text-[#1B889A]" />
            <span>تاریخچه فعالیت‌ها & دیوایس‌ها</span>
          </button>

          {/* Articles */}
          {userPerms.can_manage_articles && (
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'articles' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مقالات ({articles.length})</span>
            </button>
          )}

          {/* Magazines */}
          {userPerms.can_manage_magazines && (
            <button
              onClick={() => setActiveTab('magazines')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'magazines' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>مجله‌ها ({magazineIssues.length})</span>
            </button>
          )}

          {/* Videos */}
          {userPerms.can_manage_videos && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'videos' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>ویدیوها ({videos.length})</span>
            </button>
          )}

          {/* Audios */}
          {userPerms.can_manage_audios && (
            <button
              onClick={() => setActiveTab('audios')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'audios' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>پادکست‌ها ({audios.length})</span>
            </button>
          )}

          {/* Team Members */}
          {userPerms.can_manage_team && (
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'team' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>اعضای تیم ({teamMembers.length})</span>
            </button>
          )}

          {/* Messages */}
          {userPerms.can_manage_messages && (
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'messages' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>پیام‌ها ({contactMessages.length})</span>
            </button>
          )}

          {/* EDIT ABOUT US */}
          {(isSuperAdmin || userPerms.can_manage_about) && (
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'about' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>ویرایش «درباره ما»</span>
            </button>
          )}

          {/* VIEW STORAGE STATS */}
          {(isSuperAdmin || userPerms.can_view_storage) && (
            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'storage' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>فضای دیتابیس</span>
            </button>
          )}

          {/* DESIGNER LINK TAB (DESIGN BY) */}
          {(isSuperAdmin || userPerms.can_manage_about) && (
            <button
              onClick={() => setActiveTab('footer_designer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'footer_designer' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#1B889A]" />
              <span>ویرایش لینک طراح (design by)</span>
            </button>
          )}

          {/* CO-HOSTS MANAGEMENT */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('cohosts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'cohosts' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>مدیریت همکاران ({coHosts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && userPerms.can_manage_articles && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] p-6 border border-[var(--card-border)] rounded-3xl">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">مدیریت مقالات علمی و تحلیل‌ها</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">افزودن، ویرایش و مدیریت تمامی مقالات نشریه</p>
            </div>
            <button
              onClick={openAddArticle}
              className="px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مقاله جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {articles.map(art => (
              <div key={art.id} className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between gap-4 hover:border-[#1B889A] transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#1B889A]/10 text-[#1B889A] font-bold text-[10px]">{art.category_fa}</span>
                    {art.is_editorial && (
                      <span className="px-2 py-0.5 rounded-md bg-[#1B889A] text-white font-extrabold text-[10px] flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 fill-current" />
                        <span>سرمقاله</span>
                      </span>
                    )}
                    {art.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>پین‌شده</span>
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{art.title_fa}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">نویسنده: {art.author_name_fa} | زمان مطالعه: {art.read_time_fa} | تاریخ: {art.published_at}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      const newIsEditorial = !art.is_editorial;
                      updateArticle(art.id, { is_editorial: newIsEditorial });
                      setSaveToast({
                        msg: newIsEditorial ? '⭐ مقاله به عنوان «سرمقاله اصلی» انتخاب شد!' : '⭐ وضعیت سرمقاله برداشته شد',
                        type: 'success'
                      });
                      setTimeout(() => setSaveToast(null), 3000);
                    }}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                      art.is_editorial
                        ? 'bg-[#1B889A] border-[#1B889A] text-white shadow-xs'
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                    }`}
                    title={art.is_editorial ? 'حذف از وضعیت سرمقاله' : 'تعیین به عنوان سرمقاله اصلی نشریه'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${art.is_editorial ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{art.is_editorial ? 'سرمقاله' : 'تعیین سرمقاله'}</span>
                  </button>
                  <button
                    onClick={() => {
                      updateArticle(art.id, { featured: !art.featured });
                      setSaveToast({ msg: !art.featured ? '📌 مقاله در بخش مطالب ویژه صفحه اصلی پین شد!' : '📌 مقاله از پین در آمد', type: 'success' });
                      setTimeout(() => setSaveToast(null), 3000);
                    }}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                      art.featured
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                    }`}
                    title={art.featured ? 'حذف از مطالب پین‌شده' : 'پین کردن در صفحه اصلی'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${art.featured ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{art.featured ? 'پین‌شده' : 'پین'}</span>
                  </button>
                  <button onClick={() => openEditArticle(art)} className="p-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] border border-[var(--card-border)] transition-all" title="ویرایش">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteArticle(art.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all" title="حذف">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAGAZINES TAB */}
      {activeTab === 'magazines' && userPerms.can_manage_magazines && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] p-6 border border-[var(--card-border)] rounded-3xl">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">مدیریت شماره‌های مجله (نسخه‌های PDF)</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">آپدیت و افزودن فایل‌های PDF مجله مهدویت</p>
            </div>
            <button
              onClick={openAddMagazine}
              className="px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن شماره جدید مجله</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {magazineIssues.map(mag => (
              <div key={mag.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3 hover:border-[#1B889A] transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1B889A]/15 text-[#1B889A] font-extrabold text-xs">شماره {mag.issue_number}</span>
                      {mag.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          <span>پین‌شده</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{mag.title_fa}</h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{mag.description_fa}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        updateMagazineIssue(mag.id, { featured: !mag.featured });
                        setSaveToast({ msg: !mag.featured ? '📌 شماره مجله در صفحه اصلی پین شد!' : '📌 مجله از پین در آمد', type: 'success' });
                        setTimeout(() => setSaveToast(null), 3000);
                      }}
                      className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                        mag.featured
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                      }`}
                      title={mag.featured ? 'حذف از مجلات پین‌شده' : 'پین کردن مجله در صفحه اصلی'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${mag.featured ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{mag.featured ? 'پین‌شده' : 'پین'}</span>
                    </button>
                    <button onClick={() => openEditMagazine(mag)} className="p-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] border border-[var(--card-border)]" title="ویرایش">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteMagazineIssue(mag.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" title="حذف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--card-border)] text-[var(--text-secondary)] font-mono">
                  <span>دانلودها: {mag.download_count}</span>
                  <span>تاریخ: {mag.publish_date_fa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEOS TAB */}
      {activeTab === 'videos' && userPerms.can_manage_videos && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] p-6 border border-[var(--card-border)] rounded-3xl">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">مدیریت ویدیوها و نشریات تصویری</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">آپدیت و آپلود ویدیوهای تحلیلی در دیتابیس</p>
            </div>
            <button
              onClick={openAddVideo}
              className="px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن ویدیو جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map(vid => (
              <div key={vid.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3 hover:border-[#1B889A] transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1B889A]/15 text-[#1B889A] font-extrabold text-xs">{vid.category_fa}</span>
                      {vid.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          <span>پین‌شده</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{vid.title_fa}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">سخنران: {vid.speaker_fa} | مدت: {vid.duration_fa}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        updateVideo(vid.id, { featured: !vid.featured });
                        setSaveToast({ msg: !vid.featured ? '📌 ویدیو در صفحه اصلی پین شد!' : '📌 ویدیو از پین در آمد', type: 'success' });
                        setTimeout(() => setSaveToast(null), 3000);
                      }}
                      className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                        vid.featured
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                      }`}
                      title={vid.featured ? 'حذف از ویدیوهای پین‌شده' : 'پین کردن ویدیو در صفحه اصلی'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${vid.featured ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{vid.featured ? 'پین‌شده' : 'پین'}</span>
                    </button>
                    <button onClick={() => openEditVideo(vid)} className="p-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] border border-[var(--card-border)]" title="ویرایش">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteVideo(vid.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" title="حذف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIOS TAB */}
      {activeTab === 'audios' && userPerms.can_manage_audios && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] p-6 border border-[var(--card-border)] rounded-3xl">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">مدیریت پادکست‌ها و فایل‌های صوتی</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">افزودن و ویرایش پادکست‌های شناختی مهدویت</p>
            </div>
            <button
              onClick={openAddAudio}
              className="px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن پادکست جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audios.map(aud => (
              <div key={aud.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3 hover:border-[#1B889A] transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1B889A]/15 text-[#1B889A] font-extrabold text-xs">{aud.category_fa}</span>
                      {aud.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          <span>پین‌شده</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{aud.title_fa}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">گوینده: {aud.speaker_fa} | زمان: {aud.duration_fa}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        updateAudio(aud.id, { featured: !aud.featured });
                        setSaveToast({ msg: !aud.featured ? '📌 پادکست در صفحه اصلی پین شد!' : '📌 پادکست از پین در آمد', type: 'success' });
                        setTimeout(() => setSaveToast(null), 3000);
                      }}
                      className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                        aud.featured
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                      }`}
                      title={aud.featured ? 'حذف از پادکست‌های پین‌شده' : 'پین کردن پادکست در صفحه اصلی'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${aud.featured ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{aud.featured ? 'پین‌شده' : 'پین'}</span>
                    </button>
                    <button onClick={() => openEditAudio(aud)} className="p-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] border border-[var(--card-border)]" title="ویرایش">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteAudio(aud.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" title="حذف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM MEMBERS TAB */}
      {activeTab === 'team' && userPerms.can_manage_team && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] p-6 border border-[var(--card-border)] rounded-3xl">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">مدیریت اعضای تیم و نویسندگان</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">افزودن و ویرایش اطلاعات نویسندگان آزاد</p>
            </div>
            <button
              onClick={openAddTeam}
              className="px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>افزودن عضو جدید تیم</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...teamMembers]
              .sort((a, b) => (a.order_index || 99) - (b.order_index || 99))
              .map((tm, idx, sortedArr) => (
                <div key={tm.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between gap-4 hover:border-[#1B889A] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tm.avatar_url} alt={tm.name_fa} className="w-12 h-12 rounded-full object-cover border border-[#1B889A]" />
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#1B889A] text-white text-[9px] font-mono font-bold shadow-xs">
                        #{tm.order_index || idx + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{tm.name_fa}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{tm.role_fa} | {tm.specialization_fa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Up / Down Re-ordering Buttons */}
                    <div className="flex flex-col gap-0.5 bg-[var(--bg-color)] p-0.5 rounded-xl border border-[var(--card-border)]">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveTeamMember(idx, 'up')}
                        className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 disabled:opacity-30 disabled:hover:text-[var(--text-secondary)] transition-colors"
                        title="انتقال به بالاتر (اولویت بالاتر)"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedArr.length - 1}
                        onClick={() => handleMoveTeamMember(idx, 'down')}
                        className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[#1B889A] hover:bg-[#1B889A]/10 disabled:opacity-30 disabled:hover:text-[var(--text-secondary)] transition-colors"
                        title="انتقال به پایین‌تر (اولویت پایین‌تر)"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        updateTeamMember(tm.id, { featured: !tm.featured });
                        setSaveToast({ msg: !tm.featured ? '📌 نویسنده ویژه شد!' : '📌 نویسنده از حالت ویژه در آمد', type: 'success' });
                        setTimeout(() => setSaveToast(null), 3000);
                      }}
                      className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                        tm.featured
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[#1B889A]'
                      }`}
                      title={tm.featured ? 'حذف از نویسندگان ویژه' : 'ویژه/پین کردن نویسنده'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${tm.featured ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{tm.featured ? 'ویژه' : 'پین'}</span>
                    </button>
                    <button onClick={() => openEditTeam(tm)} className="p-2 rounded-xl bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] border border-[var(--card-border)]" title="ویرایش">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteTeamMember(tm.id)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" title="حذف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && userPerms.can_manage_messages && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] p-6 border border-[var(--card-border)] rounded-3xl">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">پیام‌های دریافتی از کاربران و مخاطبان</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">مشاهده و رسیدگی به پیام‌ها و مقالات ارسالی مخاطبان</p>
          </div>

          {contactMessages.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl">
              هیچ پیامی یافت نشد.
            </div>
          ) : (
            <div className="space-y-3">
              {contactMessages.map(msg => (
                <div key={msg.id} className={`p-5 rounded-2xl border transition-all ${msg.status === 'unread' ? 'bg-[#1B889A]/10 border-[#1B889A]' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)] font-serif-persian">{msg.sender_name}</span>
                        <span className="text-xs text-[var(--text-secondary)] font-mono">({msg.sender_email || msg.email})</span>
                      </div>
                      <h5 className="text-xs font-bold text-[#1B889A]">{msg.subject}</h5>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed pt-1">{msg.message_text || msg.message}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {msg.status === 'unread' && (
                        <button onClick={() => markContactRead(msg.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                          خوانده شد
                        </button>
                      )}
                      <button onClick={() => deleteContactMessage(msg.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL FOR ARTICLES */}
      {showArticleModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">{editingArticle ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</h3>
              <button onClick={() => setShowArticleModal(false)}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
            </div>
            <form onSubmit={handleSaveArticle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان مقاله:</label>
                <input type="text" value={artTitle} onChange={e => setArtTitle(e.target.value)} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">چکیده / خلاصه:</label>
                <textarea rows={2} value={artExcerpt} onChange={e => setArtExcerpt(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">متن کامل مقاله:</label>
                <textarea rows={6} value={artContent} onChange={e => setArtContent(e.target.value)} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              {/* DYNAMIC CATEGORIES MANAGEMENT (ADD / DELETE / SELECT) */}
              <div className="space-y-2 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[var(--text-primary)]">دسته‌بندی مقاله:</label>
                  <span className="text-[11px] text-[#1B889A] font-bold">انتخاب‌شده: {artCategory}</span>
                </div>

                {/* Add New Category Input Form */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={e => setNewCatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewCategory();
                      }
                    }}
                    placeholder="تایپ نام دسته‌بندی جدید و زدن افزودن..."
                    className="w-full p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] focus:border-[#1B889A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNewCategory()}
                    className="px-3 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shrink-0 flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                    title="افزودن دسته‌بندی جدید"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                </div>

                {/* Dynamic Category Chips with Delete (×) button */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 max-h-36 overflow-y-auto">
                  {articleCategories.map((catName) => (
                    <div
                      key={catName}
                      onClick={() => setArtCategory(catName)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        artCategory === catName
                          ? 'bg-[#1B889A] text-white border-[#1B889A] shadow-xs'
                          : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[#1B889A]'
                      }`}
                    >
                      <span>{catName}</span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCategory(catName, e)}
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                          artCategory === catName
                            ? 'bg-white/20 hover:bg-red-500 hover:text-white'
                            : 'text-stone-400 hover:bg-red-500 hover:text-white'
                        }`}
                        title={`حذف دسته‌بندی «${catName}»`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* IS LEAD EDITORIAL CHECKBOX / TOGGLE */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#1B889A]/10 to-[var(--bg-color)] border-2 border-[#1B889A]/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-[var(--text-primary)] font-serif-persian flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1B889A]" />
                    <span>تعیین به عنوان «سرمقاله اصلی نشریه» (Lead Editorial)</span>
                  </span>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    تنها مقاله‌ای که این گزینه برای آن فعال باشد، به عنوان سرمقاله در کارت ویژه صفحه اول نمایش داده می‌شود.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={artIsEditorial}
                    onChange={e => setArtIsEditorial(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-[#1B889A]"></div>
                </label>
              </div>

              {/* AUTHOR SELECTION & DETAILS */}
              <div className="relative space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[var(--text-primary)]">نام نویسنده:</label>
                  <button
                    type="button"
                    onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
                    className="text-[10px] font-bold text-[#1B889A] hover:underline flex items-center gap-1 bg-[#1B889A]/10 px-2 py-0.5 rounded-lg border border-[#1B889A]/30"
                  >
                    <UserCheck className="w-3 h-3 text-[#1B889A]" />
                    <span>@ انتخاب از تیم (درباره ما)</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={artAuthor}
                  onChange={e => {
                    setArtAuthor(e.target.value);
                    if (e.target.value.includes('@')) {
                      setShowAuthorDropdown(true);
                    }
                  }}
                  placeholder="مثلاً: @احمد یا انتخاب از لیست زیر"
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-serif-persian"
                />

                {/* Team Members Quick Selector Chips */}
                {teamMembers && teamMembers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {teamMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setArtAuthor(member.name_fa);
                          if (member.role_fa) setArtAuthorTitle(member.role_fa);
                          setShowAuthorDropdown(false);
                        }}
                        className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 border ${
                          artAuthor === member.name_fa
                            ? 'bg-[#1B889A] text-white border-[#1B889A] shadow-xs'
                            : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[#1B889A]'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={member.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                        <span>@{member.name_fa}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Dropdown Menu when typing @ */}
                {showAuthorDropdown && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto p-1.5 space-y-1">
                    <div className="text-[10px] font-bold text-[#1B889A] p-1.5 border-b border-[var(--card-border)] flex items-center justify-between">
                      <span>انتخاب نویسنده از لیست اعضای ثبت‌شده:</span>
                      <button type="button" onClick={() => setShowAuthorDropdown(false)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => {
                          setArtAuthor(member.name_fa);
                          if (member.role_fa) setArtAuthorTitle(member.role_fa);
                          setShowAuthorDropdown(false);
                        }}
                        className="p-2 rounded-xl hover:bg-[#1B889A]/15 cursor-pointer flex items-center gap-2.5 transition-colors text-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={member.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-[#1B889A] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-[var(--text-primary)] block truncate">@{member.name_fa}</span>
                          <span className="text-[10px] text-[#1B889A] block truncate">{member.role_fa}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DEDICATED AUTHOR TITLE / POSITION (موقف) FIELD */}
              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">موقف / سمت نویسنده (مثلاً: سردبیر ارشد / پژوهشگر):</label>
                <input
                  type="text"
                  value={artAuthorTitle}
                  onChange={e => setArtAuthorTitle(e.target.value)}
                  placeholder="مثلاً: سردبیر ارشد، استاد دانشگاه، نویسنده آزاد..."
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-serif-persian"
                />
              </div>
              {/* ARTICLE COVER IMAGE & DEVICE UPLOAD */}
              <div className="space-y-2 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-primary)]">تصویر کاور مقاله (Cover Image):</label>
                  
                  {/* File Upload Button from Device */}
                  <label className="px-3 py-1.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center gap-1.5 text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>انتخاب فایل از دیوایس</span>
                    <input type="file" accept="image/*" onChange={handleArticleCoverFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={artImage}
                  onChange={e => setArtImage(e.target.value)}
                  placeholder="یا لینک تصویر اینترنتی را پیست نمایید..."
                  className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[var(--text-primary)] dir-ltr text-left"
                />

                <div className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 p-2 rounded-lg border border-teal-200/50 mt-1.5 flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 shrink-0 text-[#1B889A]" />
                  <span>سایز پیشنهادی و استاندارد: ۱۲۸۰ × ۷۲۰ پیکسل (نسبت 16:9 کیفیت HD - تنظیم خودکار و بدون کشیدگی در موبایل و کامپیوتر)</span>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">کلمات کلیدی و هشتگ‌ها (#هشتگ با کاما جدا کنید):</label>
                <input
                  type="text"
                  value={artTags}
                  onChange={e => setArtTags(e.target.value)}
                  placeholder="مثلا: #معرفت‌شناسی, #مهدویت, #سرمقاله"
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] dir-ltr text-left font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <button type="button" onClick={() => setShowArticleModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)]">انصراف</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold">ثبت مقاله در دیتابیس</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR MAGAZINES */}
      {showMagModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto modern-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#1B889A]" />
                <span>{editingMag ? 'ویرایش شماره مجله' : 'افزودن شماره جدید مجله'}</span>
              </h3>
              <button onClick={() => setShowMagModal(false)}><X className="w-5 h-5 text-[var(--text-secondary)] hover:text-white" /></button>
            </div>
            
            <form onSubmit={handleSaveMagazine} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">شماره نشریه:</label>
                  <input type="number" value={magNumber} onChange={e => setMagNumber(Number(e.target.value))} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">تاریخ انتشار:</label>
                  <input type="text" value={magPublishDate} onChange={e => setMagPublishDate(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">تعداد صفحات:</label>
                  <input type="text" value={magPageCount} onChange={e => setMagPageCount(e.target.value)} placeholder="مثلا: ۴۵ صفحه" className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-serif-persian" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">عنوان شماره مجله:</label>
                <input type="text" value={magTitle} onChange={e => setMagTitle(e.target.value)} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]" />
              </div>

              {/* AUTHOR NAME AND TITLE / ROLE FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">نام نویسنده / صاحب اثر:</label>
                  <input
                    type="text"
                    value={magAuthorName}
                    onChange={e => setMagAuthorName(e.target.value)}
                    placeholder="مثلا: M. Nazir Yosufi"
                    className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-serif-persian"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">لقب / عنوان نویسنده:</label>
                  <input
                    type="text"
                    value={magAuthorTitle}
                    onChange={e => setMagAuthorTitle(e.target.value)}
                    placeholder="مثلا: سردبیر ارشد / پژوهشگر"
                    className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-serif-persian"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">توضیحات مجله:</label>
                <textarea rows={3} value={magDesc} onChange={e => setMagDesc(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]" />
              </div>

              {/* COVER IMAGE & DEVICE UPLOAD & POSITION SELECTOR */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-primary)]">تصویر روی جلد (Cover Image):</label>
                  
                  {/* File Upload Button from Device */}
                  <label className="px-3 py-1.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>انتخاب فایل از دیوایس</span>
                    <input type="file" accept="image/*" onChange={handleCoverFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={magCoverImage}
                  onChange={e => setMagCoverImage(e.target.value)}
                  placeholder="یا لینک تصویر اینترنتی را پیست نمایید..."
                  className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[var(--text-primary)] dir-ltr text-left"
                />

                <div className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 p-2 rounded-lg border border-teal-200/50 mt-1.5 flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 shrink-0 text-[#1B889A]" />
                  <span>سایز پیشنهادی و استاندارد: ۱۲۸۰ × ۷۲۰ پیکسل (نسبت 16:9 کیفیت HD - تنظیم خودکار و بدون کشیدگی در موبایل و کامپیوتر)</span>
                </div>

                {/* COVER FOCUS / POSITION SELECTOR (مشخص کردن بخش مورد نظر تصویر در کاور) */}
                <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
                  <span className="block font-bold text-[#1B889A]">مشخص کردن بخش مورد نظر تصویر در کاور (ترازش و برش):</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'cover', label: 'کاور کامل (Cover)' },
                      { id: 'top', label: 'بالای تصویر (Top)' },
                      { id: 'center', label: 'مرکز تصویر (Center)' },
                      { id: 'bottom', label: 'پایین تصویر (Bottom)' },
                      { id: 'contain', label: 'فیت کامل (Contain)' },
                    ].map(pos => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setMagCoverPosition(pos.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          magCoverPosition === pos.id
                            ? 'bg-[#1B889A] text-white shadow-md'
                            : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-[#1B889A]'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>

                  {/* Real-time Cover Position Preview */}
                  {magCoverImage && (
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-[11px] text-[var(--text-secondary)] shrink-0">پیش‌نمایش برش:</span>
                      <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-[#1B889A]/40 bg-stone-900 shadow-md relative">
                        <img
                          src={magCoverImage}
                          alt="Preview"
                          className={`w-full h-full object-${magCoverPosition || 'cover'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PDF FILE URL & DEVICE UPLOAD */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-primary)]">فایل PDF مجله (مطالعه آنلاین & دانلود):</label>
                  
                  {/* PDF Upload Button from Device */}
                  <label className="px-3 py-1.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>انتخاب PDF از دیوایس</span>
                    <input type="file" accept="application/pdf,.pdf" onChange={handlePdfFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={magPdfUrl}
                  onChange={e => setMagPdfUrl(e.target.value)}
                  placeholder="آدرس لینک فایل PDF یا انتخاب مستقیم از دیوایس"
                  className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[var(--text-primary)] dir-ltr text-left"
                />
              </div>

              {/* HASHTAGS & KEYWORDS FIELD */}
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">کلمات کلیدی و هشتگ‌ها (#هشتگ با کاما جدا کنید):</label>
                <input
                  type="text"
                  value={magTags}
                  onChange={e => setMagTags(e.target.value)}
                  placeholder="مثلا: #نشریه_کامل, #شماره_یک, #عقلانیت"
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] dir-ltr text-left font-mono"
                />
              </div>

              {uploadStatusMsg && (
                <div className="p-3 rounded-xl bg-[#1B889A]/15 border border-[#1B889A]/40 text-[#1B889A] text-xs font-bold flex items-center gap-2 animate-pulse">
                  <div className="w-4 h-4 border-2 border-[#1B889A] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>{uploadStatusMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <button
                  type="button"
                  disabled={isSavingMagazine}
                  onClick={() => setShowMagModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] font-bold disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSavingMagazine}
                  className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold hover:bg-[#156d7b] shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingMagazine && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isSavingMagazine ? 'در حال آپلود و ثبت...' : 'ثبت شماره مجله در دیتابیس'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR VIDEOS */}
      {showVidModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">{editingVid ? 'ویرایش ویدیو' : 'افزودن ویدیو جدید'}</h3>
              <button onClick={() => setShowVidModal(false)}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
            </div>
            <form onSubmit={handleSaveVideo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان ویدیو:</label>
                <input type="text" value={vidTitle} onChange={e => setVidTitle(e.target.value)} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">سخنران / ارائه دهنده:</label>
                  <input type="text" value={vidSpeaker} onChange={e => setVidSpeaker(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold">مدت زمان:</label>
                    <button
                      type="button"
                      onClick={() => vidUrl && extractDurationFromMedia(vidUrl)}
                      className="text-[10px] font-bold text-[#1B889A] hover:underline flex items-center gap-1"
                      title="محاسبه خودکار طول ویدیو"
                    >
                      <Clock className="w-3 h-3 text-[#1B889A]" />
                      <span>محاسبه خودکار ⏱️</span>
                    </button>
                  </div>
                  <input type="text" value={vidDuration} onChange={e => setVidDuration(e.target.value)} placeholder="مثلا: ۰۵:۳۰ یا ۱۰ دقیقه" className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl font-mono text-center font-bold" />
                  
                  {/* Quick Duration Preset Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {['۰۳:۰۰', '۰۵:۰۰', '۱۰:۰۰', '۱۵:۰۰', '۲۰:۰۰', '۳۰:۰۰'].map((durPreset) => (
                      <button
                        key={durPreset}
                        type="button"
                        onClick={() => setVidDuration(durPreset)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                          vidDuration === durPreset
                            ? 'bg-[#1B889A] text-white border-[#1B889A]'
                            : 'bg-[var(--bg-color)] text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[#1B889A]'
                        }`}
                      >
                        {durPreset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* DUAL VIDEO SOURCE SELECTOR (LINK VS UPLOAD) */}
              <div className="space-y-2 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <label className="block font-bold text-[var(--text-primary)]">روش افزودن ویدیو:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVidSourceType('link')}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      vidSourceType === 'link'
                        ? 'bg-[#1B889A] text-white shadow-md'
                        : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>لینک ویدیو (یوتیوب / آپارات)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVidSourceType('upload')}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      vidSourceType === 'upload'
                        ? 'bg-[#1B889A] text-white shadow-md'
                        : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود فایل ویدیو (MP4)</span>
                  </button>
                </div>

                {vidSourceType === 'link' ? (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold">لینک ویدیو (YouTube, Aparat, Direct URL):</label>
                      <button
                        type="button"
                        onClick={() => handleAnalyzeYouTubeUrl(vidUrl)}
                        className="text-[11px] font-bold text-[#1B889A] hover:underline flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-[#1B889A]" />
                        <span>آنالیز خودکار YouTube ⚡</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={vidUrl}
                      onChange={e => {
                        setVidUrl(e.target.value);
                        handleAnalyzeYouTubeUrl(e.target.value);
                      }}
                      placeholder="https://www.youtube.com/watch?v=... یا لینک آپارات"
                      required
                      className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono dir-ltr text-left"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <label className="block font-bold">انتخاب و آپلود فایل ویدیو از دستگاه (MP4 / WebM):</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-4 py-2.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center justify-center gap-2 text-xs border border-[#1B889A]/30">
                        <Upload className="w-4 h-4" />
                        <span>{isUploadingVidFile ? 'در حال آپلود...' : 'انتخاب فایل ویدیو'}</span>
                        <input type="file" accept="video/mp4,video/webm" onChange={handleVideoFileUpload} className="hidden" />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={vidUrl}
                      onChange={e => setVidUrl(e.target.value)}
                      placeholder="لینک مستقیم فایل ویدیو..."
                      readOnly
                      className="w-full p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[11px] text-[var(--text-secondary)] dir-ltr text-left"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">لینک تصویر کاور/پوستر ویدیو (اختیاری):</label>
                <input
                  type="text"
                  value={vidThumb}
                  onChange={e => setVidThumb(e.target.value)}
                  placeholder="در صورت خالی بودن، پوستر YouTube خودکار تنظیم می‌شود..."
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl font-mono dir-ltr text-left text-xs"
                />

                {/* THUMBNAIL LIVE PREVIEW BOX */}
                {(vidThumb || vidUrl.includes('youtube.com') || vidUrl.includes('youtu.be')) && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--card-border)] bg-stone-900 flex items-center justify-center group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        vidThumb ||
                        (vidUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
                          ? `https://img.youtube.com/vi/${vidUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1]}/hqdefault.jpg`
                          : '')
                      }
                      alt="پیش‌نمایش کاور ویدیو"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white font-mono text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#1B889A]" />
                      <span>پیش‌نمایش کاور ۱۶:۹ HD</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 p-2 rounded-lg border border-teal-200/50 mt-1.5 flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 shrink-0 text-[#1B889A]" />
                  <span>سایز پیشنهادی و استاندارد: ۱۲۸۰ × ۷۲۰ پیکسل (نسبت 16:9 کیفیت HD - تنظیم خودکار و بدون کشیدگی در موبایل و کامپیوتر)</span>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">توضیحات کامل ویدیو:</label>
                <textarea rows={3} value={vidDesc} onChange={e => setVidDesc(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <button type="button" onClick={() => setShowVidModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)]">انصراف</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold">ثبت ویدیو در دیتابیس</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR AUDIOS */}
      {showAudModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">{editingAud ? 'ویرایش پادکست صوتی' : 'افزودن پادکست جدید'}</h3>
              <button onClick={() => setShowAudModal(false)}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
            </div>
            <form onSubmit={handleSaveAudio} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان پادکست / فایل صوتی:</label>
                <input type="text" value={audTitle} onChange={e => setAudTitle(e.target.value)} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">گوینده / سخنران:</label>
                  <input type="text" value={audSpeaker} onChange={e => setAudSpeaker(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">مدت زمان:</label>
                  <input type="text" value={audDuration} onChange={e => setAudDuration(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
                </div>
              </div>
              {/* AUDIO MP3 FILE & DEVICE UPLOAD */}
              <div className="space-y-2 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-primary)]">فایل صوتی پادکست (MP3 / WAV / M4A):</label>
                  
                  {/* File Upload Button from Device */}
                  <label className="px-3 py-1.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center gap-1.5 text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود فایل صوتی از دیوایس</span>
                    <input type="file" accept="audio/*" onChange={handleAudioFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={audUrl}
                  onChange={e => setAudUrl(e.target.value)}
                  placeholder="یا لینک مستقیم فایل MP3 صوتی را پیست نمایید..."
                  className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[var(--text-primary)] dir-ltr text-left"
                />

                {audioFile && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/50 flex items-center justify-between font-bold">
                    <span>فایل انتخاب شده: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    <span className="text-[#1B889A]">مدت: {audDuration}</span>
                  </div>
                )}
              </div>

              {/* PODCAST COVER IMAGE & DEVICE UPLOAD */}
              <div className="space-y-2 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-primary)]">تصویر کاور پادکست (Cover Image):</label>
                  
                  {/* File Upload Button from Device */}
                  <label className="px-3 py-1.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center gap-1.5 text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود کاور از دیوایس</span>
                    <input type="file" accept="image/*" onChange={handleAudioCoverFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={audCover}
                  onChange={e => setAudCover(e.target.value)}
                  placeholder="یا لینک تصویر اینترنتی کاور را پیست نمایید..."
                  className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[var(--text-primary)] dir-ltr text-left"
                />

                {/* 16:9 Cover Image Preview Box */}
                {audCover && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--card-border)] bg-slate-900 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={audCover}
                      alt="پیش‌نمایش کاور پادکست"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white font-mono text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#1B889A]" />
                      <span>پیش‌نمایش کاور ۱۶:۹ HD</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 p-2 rounded-lg border border-teal-200/50 mt-1.5 flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 shrink-0 text-[#1B889A]" />
                  <span>سایز پیشنهادی و استاندارد: ۱۲۸۰ × ۷۲۰ پیکسل (نسبت 16:9 کیفیت HD - تنظیم خودکار و بدون کشیدگی در موبایل و کامپیوتر)</span>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">توضیحات صوتی:</label>
                <textarea rows={3} value={audDesc} onChange={e => setAudDesc(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <button type="button" onClick={() => setShowAudModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)]">انصراف</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold">ثبت پادکست در دیتابیس</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR TEAM MEMBERS */}
      {showTeamModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">{editingTeam ? 'ویرایش عضو تیم' : 'افزودن عضو جدید تیم'}</h3>
              <button onClick={() => setShowTeamModal(false)}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
            </div>
            <form onSubmit={handleSaveTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">نام و تخلص عضو:</label>
                <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">سمت / نقش:</label>
                  <input type="text" value={teamRole} onChange={e => setTeamRole(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">تخصص / پژوهش:</label>
                  <input type="text" value={teamSpec} onChange={e => setTeamSpec(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">ترتیب / اولویت (#):</label>
                  <input type="number" min={1} value={teamOrderIndex} onChange={e => setTeamOrderIndex(parseInt(e.target.value) || 1)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-center font-bold font-mono" />
                </div>
              </div>
              {/* TEAM MEMBER AVATAR & DEVICE UPLOAD */}
              <div className="space-y-2 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--text-primary)]">عکس پروفایل (Avatar Image):</label>
                  
                  {/* File Upload Button from Device */}
                  <label className="px-3 py-1.5 rounded-xl bg-[#1B889A]/15 text-[#1B889A] hover:bg-[#1B889A] hover:text-white font-bold cursor-pointer transition-all flex items-center gap-1.5 text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود عکس از دیوایس</span>
                    <input type="file" accept="image/*" onChange={handleTeamAvatarFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={teamAvatar}
                  onChange={e => setTeamAvatar(e.target.value)}
                  placeholder="یا لینک اینترنتی تصویر پروفایل را پیست نمایید..."
                  className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl font-mono text-[var(--text-primary)] dir-ltr text-left"
                />

                {/* Avatar Preview Box */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#1B889A] bg-slate-800 shrink-0">
                    {teamAvatar && !teamAvatar.includes('unsplash.com') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={teamAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1B889A] text-white flex items-center justify-center font-bold text-lg font-serif-persian">
                        {teamName ? teamName.trim().charAt(0) : 'ن'}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-serif-persian">
                    در صورت عدم آپلود عکس، حروف اول نام به عنوان پروفایل گرد نمایش می‌یابد.
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">بیوگرافی / سوابق:</label>
                <textarea rows={3} value={teamBio} onChange={e => setTeamBio(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <button type="button" onClick={() => setShowTeamModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)]">انصراف</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold">ثبت عضو جدید در دیتابیس</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STORAGE STATS TAB */}
      {activeTab === 'storage' && (isSuperAdmin || userPerms.can_view_storage) && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#1B889A]" />
              <span>وضعیت دیتابیس و حجم داده‌های ذخیره‌شده</span>
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[var(--text-primary)]">
                <span>حجم اشغال شده در دیتابیس Supabase:</span>
                <span>{(storageUsedBytes / 1024).toFixed(2)} KB</span>
              </div>
              <div className="w-full h-3 bg-[var(--bg-color)] rounded-full overflow-hidden border border-[var(--card-border)]">
                <div className="h-full bg-[#1B889A] transition-all" style={{ width: `${Math.max(storagePercentage, 2)}%` }}></div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">دیتابیس ابری Supabase آماده پذیرش نامحدود مقالات، مجلات و پادکست‌های شما می‌باشد.</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER DESIGNER LINK TAB */}
      {activeTab === 'footer_designer' && (isSuperAdmin || userPerms.can_manage_about) && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1B889A]/15 via-[var(--card-bg)] to-[var(--bg-color)] border-2 border-[#1B889A] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl modern-card">
            
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1B889A] text-white flex items-center justify-center font-bold shadow-lg shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] font-serif-persian">
                  مدیریت اختصاصی متن و لینک طراح سایت (design by)
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  ویرایش مستقیم نام طراح و آدرس وب‌سایت در پایین‌ترین قسمت وب‌سایت
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5 bg-[var(--bg-color)] p-5 rounded-2xl border border-[var(--card-border)]">
                <label className="text-xs font-extrabold text-[var(--text-primary)] block flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1B889A]/20 text-[#1B889A] flex items-center justify-center text-xs">۱</span>
                  <span>نام / متن نمایش داده‌شده پس از design by:</span>
                </label>
                <input
                  type="text"
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  placeholder="M. Nazir Yosufi"
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#1B889A] dir-ltr text-left font-bold"
                />
                <p className="text-[11px] text-[var(--text-secondary)]">مثلاً: M. Nazir Yosufi</p>
              </div>

              <div className="space-y-2.5 bg-[var(--bg-color)] p-5 rounded-2xl border border-[var(--card-border)]">
                <label className="text-xs font-extrabold text-[var(--text-primary)] block flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1B889A]/20 text-[#1B889A] flex items-center justify-center text-xs">۲</span>
                  <span>آدرس وب‌سایت یا نمونه‌کار طراح (URL):</span>
                </label>
                <input
                  type="url"
                  value={designerWebsiteUrl}
                  onChange={(e) => setDesignerWebsiteUrl(e.target.value)}
                  placeholder="https://github.com/naziryosuf"
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[#1B889A] dir-ltr text-left font-bold"
                />
                <p className="text-[11px] text-[var(--text-secondary)]">مثلاً: https://github.com/naziryosuf</p>
              </div>
            </div>

            {/* Live Preview Card & Instant Save Button */}
            <div className="p-5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] space-y-4 text-center">
              <span className="text-xs text-[var(--text-secondary)] font-bold block dir-rtl text-right">پیش‌نمایش زنده در فوتر:</span>
              <div className="text-xs text-stone-400 font-mono tracking-wider flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] w-fit mx-auto dir-ltr">
                <span>design by</span>
                <a
                  href={designerWebsiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1B889A] font-bold underline flex items-center gap-1"
                >
                  <span>{designerName || 'M. Nazir Yosufi'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await saveAllChangesToLive();
                  alert('اطلاعات فوتر طراح با موفقیت ذخیره شد و زنده در کل سایت اعمال گردید!');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره و به روز رسانی آنی لینک فوتر در سایت</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB CONTENT */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl modern-card">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <History className="w-5 h-5 text-[#1B889A]" />
                <span>تاریخچه فعالیت‌ها، تغییرات و دستگاه‌های استفاده‌شده</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                در این بخش تمامی اقدامات انجام شده توسط مدیر ارشد و دستیاران به همراه ساعت دقیق و دیوایس مربوطه ثبت می‌گردد.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#1B889A]/50 transition-all">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#1B889A]/15 text-[#1B889A] font-bold text-xs">
                      {log.user_name} ({log.user_role})
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      log.action_type === 'افزودن' ? 'bg-emerald-500/15 text-emerald-400' :
                      log.action_type === 'ویرایش' ? 'bg-amber-500/15 text-amber-400' :
                      log.action_type === 'حذف' ? 'bg-red-500/15 text-red-400' : 'bg-purple-500/15 text-purple-400'
                    }`}>
                      {log.action_type} {log.item_type}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">
                    {log.target_title}
                  </h4>

                  {log.status_note && (
                    <p className="text-xs text-[var(--text-secondary)] italic">
                      توضیحات: {log.status_note}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 text-left dir-ltr">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1B889A] bg-[#1B889A]/10 px-2.5 py-1 rounded-xl">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{log.device_info}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                    ⏰ {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENDING APPROVALS QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-3xl space-y-2">
            <h2 className="text-lg font-bold text-amber-400 font-serif-persian flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>پست‌ها و ویرایش‌های در انتظار تایید مدیر ارشد (NAZIR YOSUF)</span>
            </h2>
          </div>

          {totalPendingCount === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl">
              هیچ پستی در انتظار تایید وجود ندارد.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map(art => (
                <div key={art.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">مقاله</span>
                    <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">{art.title_fa}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">ارسال شده توسط: {art.submitted_by_name} | دیوایس: {art.submitted_device}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approvePendingItem('article', art.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>تایید و انتشار</span>
                    </button>
                    <button
                      onClick={() => rejectPendingItem('article', art.id)}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs flex items-center gap-1.5 hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>رد درخواست</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CO-HOST MANAGEMENT TAB */}
      {activeTab === 'cohosts' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-3xl modern-card">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#1B889A]" />
                <span>مدیریت همکاران، پسوردها و تعیین دقیق سطوح دسترسی (Co-Hosts)</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                کنترل کامل دسترسی همکاران به مقالات، درباره ما، فضای دیتابیس و مجوز انتشار مستقیم.
              </p>
            </div>

            <button
              onClick={openAddCoHost}
              className="px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>افزودن همکار جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coHosts.map((ch) => (
              <div key={ch.id} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4 hover:border-[#1B889A] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B889A]/15 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] font-bold">
                      {ch.name_fa.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                        <span>{ch.name_fa}</span>
                        {ch.is_super_admin && <span className="text-xs text-amber-400">👑 (ادمین ارشد)</span>}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">{ch.role_fa}</p>
                    </div>
                  </div>

                  {!ch.is_super_admin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCoHost(ch)}
                        className="p-2 rounded-lg bg-[var(--bg-color)] text-[var(--text-secondary)] hover:text-[#1B889A] hover:border-[#1B889A] border border-[var(--card-border)] transition-all"
                        title="ویرایش سطح دسترسی"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCoHost(ch.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all"
                        title="حذف همکار"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[var(--card-border)] text-xs">
                  <div className="flex items-center justify-between text-[var(--text-secondary)] font-mono">
                    <span>کد عبور ورود:</span>
                    <span className="font-bold text-[#1B889A] bg-[#1B889A]/10 px-2 py-0.5 rounded-md">{ch.password_code}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span>ویرایش درباره ما:</span>
                    <span className={`font-bold ${ch.permissions.can_manage_about ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ch.permissions.can_manage_about ? 'مجاز' : 'غیرمجاز'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span>مشاهده فضای دیتابیس:</span>
                    <span className={`font-bold ${ch.permissions.can_view_storage ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ch.permissions.can_view_storage ? 'مجاز' : 'غیرمجاز'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CO-HOST MODAL */}
      {showCoHostModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-lg w-full space-y-5 modern-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1B889A]" />
                <span>{editingCoHost ? 'ویرایش همکار' : 'افزودن همکار جدید'}</span>
              </h3>
              <button onClick={() => setShowCoHostModal(false)} className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoHost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">نام همکار:</label>
                <input
                  type="text"
                  value={coHostName}
                  onChange={(e) => setCoHostName(e.target.value)}
                  placeholder="مثلا: محمد رضایی"
                  required
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">کد عبور اختصاصی (پسورد):</label>
                <input
                  type="text"
                  value={coHostPassword}
                  onChange={(e) => setCoHostPassword(e.target.value)}
                  placeholder="کد ۶ رقمی ورود"
                  required
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-mono"
                />
              </div>

              {/* GRANULAR PERMISSIONS */}
              <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
                <span className="block font-bold text-[#1B889A] mb-1">تعیین سطوح دسترسی همکار:</span>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permArticles}
                    onChange={(e) => setPermArticles(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به بخش مقالات</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permMagazines}
                    onChange={(e) => setPermMagazines(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به بخش مجله‌ها</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permManageAbout}
                    onChange={(e) => setPermManageAbout(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به ویرایش بخش «درباره ما»</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={permViewStorage}
                    onChange={(e) => setPermViewStorage(e.target.checked)}
                    className="w-4 h-4 accent-[#1B889A] rounded"
                  />
                  <span>دسترسی به مشاهده «فضای دیتابیس & آمار»</span>
                </label>

                <div className="p-3 rounded-xl bg-[#1B889A]/10 border border-[#1B889A]/30 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={permDirectPublish}
                      onChange={(e) => setPermDirectPublish(e.target.checked)}
                      className="w-4 h-4 accent-[#1B889A] rounded"
                    />
                    <span>مجوز انتشار مستقیم بدون نیاز به تایید NAZIR YOSUF</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--card-border)]">
                <button
                  type="button"
                  onClick={() => setShowCoHostModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1B889A] text-white font-bold hover:bg-[#156d7b]"
                >
                  ذخیره اطلاعات همکار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
