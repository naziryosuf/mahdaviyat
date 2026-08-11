'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Upload, 
  Sparkles,
  Globe,
  Link as LinkIcon,
  Users,
  HardDrive,
  Database,
  Mail,
  Check,
  ImageIcon,
  Paperclip,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Copy,
  Info,
  Save,
  Server,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Quote,
  Code,
  VolumeX,
  Eye,
  Type,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Headphones,
  Pin,
  KeyRound,
  UserPlus,
  UserCheck,
  UserX,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { parseVideoUrl } from '@/utils/videoEmbed';
import { calculateReadingTimeFa } from '@/utils/readingTime';
import { Article, MagazineIssue, VideoItem, AudioItem, TeamMember, ContactMessage, CoHostUser } from '@/types';

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
    articles, 
    magazineIssues, 
    videos, 
    audios,
    infographics,
    teamMembers,
    contactMessages,
    aboutUsMission,
    setAboutUsMission,
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
    addInfographic,
    deleteInfographic,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    markContactRead,
    deleteContactMessage
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
  };

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'team' | 'messages' | 'articles' | 'magazines' | 'videos' | 'audios' | 'about' | 'storage' | 'cohosts'>('articles');

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

  // Track expanded long messages IDs
  const [expandedMessageIds, setExpandedMessageIds] = useState<string[]>([]);
  // Track copied message state
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

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

  const toggleExpandMessage = (id: string) => {
    setExpandedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyMessage = (msg: ContactMessage) => {
    if (typeof window !== 'undefined') {
      const fullText = `نام فرستنده: ${msg.sender_name}\nایمیل: ${msg.email}\nموضوع: ${msg.subject}\nتاریخ: ${msg.created_at || msg.sent_at}\n\nمتن پیام:\n${msg.message || msg.message_text}`;
      navigator.clipboard.writeText(fullText);
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 3000);
    }
  };

  // Storage Stats Calculation
  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [storagePercentage, setStoragePercentage] = useState(0);

  const totalRecordsCount = articles.length + magazineIssues.length + videos.length + audios.length + infographics.length + teamMembers.length + contactMessages.length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const fullPayloadStr = JSON.stringify({
          articles,
          magazineIssues,
          videos,
          audios,
          infographics,
          teamMembers,
          contactMessages,
          aboutUsMission
        });
        const bytes = new Blob([fullPayloadStr]).size;
        setStorageUsedBytes(bytes);
        // Calculate percentage out of 5GB (5000MB) Unlimited Free Quota
        const pct = Math.min(Math.round((bytes / (5000 * 1024 * 1024)) * 100 * 100) / 100, 100);
        setStoragePercentage(pct);
      } catch (e) {}
    }
  }, [articles, magazineIssues, videos, audios, infographics, teamMembers, contactMessages, aboutUsMission]);

  const formattedStorageKB = (storageUsedBytes / 1024).toFixed(1);

  // Create Modals State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Edit State Targets
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingMagazine, setEditingMagazine] = useState<MagazineIssue | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingAudio, setEditingAudio] = useState<AudioItem | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);

  // Form State: Article Rich Text Editor
  const [artTitle, setArtTitle] = useState('');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState<'سرمقاله‌ها' | 'تحلیل‌ها' | 'نقد مکاتب' | 'شناخت مهدویت'>('تحلیل‌ها');
  const [artAuthor, setArtAuthor] = useState('میر الهام الدین سادات');
  const [artAuthorTitle, setArtAuthorTitle] = useState('');
  const [artReadTime, setArtReadTime] = useState('۷ دقیقه');
  const [artImage, setArtImage] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80');
  const [artImagePosition, setArtImagePosition] = useState<'center' | 'top' | 'bottom'>('center');
  const [artImageFileName, setArtImageFileName] = useState('');
  const [artAudioUrl, setArtAudioUrl] = useState('');
  const [artAudioFileName, setArtAudioFileName] = useState('');
  const [artAudioSpeaker, setArtAudioSpeaker] = useState('میر الهام الدین سادات');
  const [artTag1, setArtTag1] = useState('مهدویت');
  const [artTag2, setArtTag2] = useState('عدالت');
  const [artTag3, setArtTag3] = useState('ظهور');

  // Auto calculate reading time based on content length
  useEffect(() => {
    if (artContent) {
      const autoTime = calculateReadingTimeFa(artContent);
      setArtReadTime(autoTime);
    }
  }, [artContent]);

  // Local Cover Image Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setArtImage(event.target.result as string);
          setArtImageFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Local Audio File Upload Handler
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setArtAudioUrl(event.target.result as string);
          setArtAudioFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert formatting tags into text area
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = contentTextAreaRef.current;
    if (!textarea) {
      setArtContent((prev) => prev + prefix + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = artContent.substring(start, end) || 'متن نمونه';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = artContent.substring(0, start) + replacement + artContent.substring(end);
    
    setArtContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Form State: Video
  const [vidTitle, setVidTitle] = useState('');
  const [vidDesc, setVidDesc] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidCategory, setVidCategory] = useState('وبینارها');
  const [vidSpeaker, setVidSpeaker] = useState('میر الهام الدین سادات');
  const [vidDuration, setVidDuration] = useState('۳۰ دقیقه');
  const [vidThumbnail, setVidThumbnail] = useState('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80');
  const [vidTag1, setVidTag1] = useState('درس‌گفتار');
  const [vidTag2, setVidTag2] = useState('وبینار');
  const [vidTag3, setVidTag3] = useState('مهدویت');

  // Form State: Magazine Issue
  const [issNumber, setIssNumber] = useState(1);
  const [issTitle, setIssTitle] = useState('');
  const [issDesc, setIssDesc] = useState('');
  const [issDate, setIssDate] = useState('تابستان ۱۴۰۴');
  const [issCover, setIssCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80');
  const [issCoverFileName, setIssCoverFileName] = useState('');
  const [issPdfUrl, setIssPdfUrl] = useState('');
  const [issPdfFileName, setIssPdfFileName] = useState('');
  const [issTag1, setIssTag1] = useState('مجله');
  const [issTag2, setIssTag2] = useState('مهدویت');
  const [issTag3, setIssTag3] = useState('ایدئولوژی');

  const handleMagazineCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setIssCover(event.target.result as string);
          setIssCoverFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagazinePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setIssPdfUrl(event.target.result as string);
          setIssPdfFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Form State: Audio Podcast
  const [audTitle, setAudTitle] = useState('');
  const [audSpeaker, setAudSpeaker] = useState('میر الهام الدین سادات');
  const [audUrl, setAudUrl] = useState('');
  const [audDuration, setAudDuration] = useState('۲۰ دقیقه');
  const [audDesc, setAudDesc] = useState('');
  const [audCategory, setAudCategory] = useState('پادکست‌ها');
  const [audCover, setAudCover] = useState('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80');
  const [audTag1, setAudTag1] = useState('پادکست');
  const [audTag2, setAudTag2] = useState('صوتی');
  const [audTag3, setAudTag3] = useState('معرفت');

  // Form State: Team Member
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamAvatar, setTeamAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
  const [teamSpec, setTeamSpec] = useState('شناخت مهدویت & فلسفه اسلامی');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(passcode);
    if (!success) {
      setErrorMsg('کد عبور وارد شده نادرست است.');
    } else {
      setErrorMsg('');
    }
  };

  const resetForm = () => {
    setArtTitle('');
    setArtExcerpt('');
    setArtContent('');
    setArtAuthor('میر الهام الدین سادات');
    setArtAuthorTitle('');
    setArtImagePosition('center');
    setArtImageFileName('');
    setArtAudioUrl('');
    setArtAudioFileName('');
    setArtAudioSpeaker('میر الهام الدین سادات');
    setVidTitle('');
    setVidDesc('');
    setVidUrl('');
    setTeamName('');
    setTeamRole('');
    setTeamBio('');
  };

  // Save Article Handler
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (artTitle && artContent) {
      const parsedTags = [artTag1, artTag2, artTag3].map(t => t.trim()).filter(Boolean).slice(0, 3);
      if (editingArticle) {
        await updateArticle(editingArticle.id, {
          title_fa: artTitle,
          excerpt_fa: artExcerpt || artContent.slice(0, 150),
          content_fa: artContent,
          category_fa: artCategory,
          author_name_fa: artAuthor,
          author_title_fa: artAuthorTitle || undefined,
          read_time_fa: artReadTime,
          image_url: artImage || '',
          image_position: artImagePosition || 'center',
          audio_url: artAudioUrl || undefined,
          audio_speaker_fa: artAudioSpeaker || undefined,
          tags: parsedTags,
        });
        setEditingArticle(null);
      } else {
        await addArticle({
          title_fa: artTitle,
          slug: artTitle.toLowerCase().replace(/\s+/g, '-'),
          excerpt_fa: artExcerpt || artContent.slice(0, 150),
          content_fa: artContent,
          category_fa: artCategory,
          author_name_fa: artAuthor,
          author_title_fa: artAuthorTitle || undefined,
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          read_time_fa: artReadTime,
          published_at: new Date().toLocaleDateString('fa-IR'),
          image_url: artImage || '',
          image_position: artImagePosition || 'center',
          audio_url: artAudioUrl || undefined,
          audio_speaker_fa: artAudioSpeaker || undefined,
          featured: false,
          tags: parsedTags,
        });
      }
      setShowArticleModal(false);
      resetForm();
    }
  };

  const openEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtTitle(art.title_fa || '');
    setArtExcerpt(art.excerpt_fa || '');
    setArtContent(art.content_fa || '');
    setArtCategory(art.category_fa || 'تحلیل‌ها');
    setArtAuthor(art.author_name_fa || '');
    setArtAuthorTitle(art.author_title_fa || '');
    setArtReadTime(art.read_time_fa || '۷ دقیقه');
    setArtImage(art.image_url || '');
    setArtImagePosition((art.image_position as any) || 'center');
    setArtAudioUrl(art.audio_url || '');
    setArtAudioSpeaker(art.audio_speaker_fa || art.author_name_fa || 'میر الهام الدین سادات');
    setArtTag1(art.tags?.[0] || 'مهدویت');
    setArtTag2(art.tags?.[1] || 'عدالت');
    setArtTag3(art.tags?.[2] || 'ظهور');
    setShowArticleModal(true);
  };

  // Open Edit Magazine Issue
  const openEditMagazine = (iss: MagazineIssue) => {
    setEditingMagazine(iss);
    setIssNumber(iss.issue_number || 1);
    setIssTitle(iss.title_fa || '');
    setIssDesc(iss.description_fa || '');
    setIssDate(iss.publish_date_fa || 'تابستان ۱۴۰۴');
    setIssCover(iss.cover_image || '');
    setIssPdfUrl(iss.pdf_url || '');
    setIssTag1(iss.tags?.[0] || 'مجله');
    setIssTag2(iss.tags?.[1] || 'مهدویت');
    setIssTag3(iss.tags?.[2] || 'ایدئولوژی');
    setShowMagazineModal(true);
  };

  // Open Edit Video
  const openEditVideo = (vid: VideoItem) => {
    setEditingVideo(vid);
    setVidTitle(vid.title_fa || '');
    setVidDesc(vid.description_fa || '');
    setVidUrl(vid.video_url || '');
    setVidSpeaker(vid.speaker_fa || '');
    setVidDuration(vid.duration_fa || '۳۰ دقیقه');
    setVidCategory(vid.category_fa || 'وبینارها');
    setVidThumbnail(vid.thumbnail_url || '');
    setVidTag1(vid.tags?.[0] || 'درس‌گفتار');
    setVidTag2(vid.tags?.[1] || 'وبینار');
    setVidTag3(vid.tags?.[2] || 'مهدویت');
    setShowVideoModal(true);
  };

  // Open Edit Audio
  const openEditAudio = (aud: AudioItem) => {
    setEditingAudio(aud);
    setAudTitle(aud.title_fa || '');
    setAudSpeaker(aud.speaker_fa || '');
    setAudDuration(aud.duration_fa || '۲۰ دقیقه');
    setAudCategory(aud.category_fa || 'پادکست‌ها');
    setAudUrl(aud.audio_url || '');
    setAudCover(aud.cover_image || '');
    setAudDesc(aud.description_fa || '');
    setAudTag1(aud.tags?.[0] || 'پادکست');
    setAudTag2(aud.tags?.[1] || 'صوتی');
    setAudTag3(aud.tags?.[2] || 'معرفت');
    setShowAudioModal(true);
  };

  // Save Magazine Issue Handler
  const handleSaveMagazine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (issTitle) {
      const parsedTags = [issTag1, issTag2, issTag3].map(t => t.trim()).filter(Boolean).slice(0, 3);
      if (editingMagazine) {
        updateMagazineIssue(editingMagazine.id, {
          issue_number: Number(issNumber) || 1,
          title_fa: issTitle,
          description_fa: issDesc || 'شماره مجله ایدئولوژی مهدویت',
          publish_date_fa: issDate || 'تابستان ۱۴۰۴',
          cover_image: issCover || '',
          pdf_url: issPdfUrl || '',
          tags: parsedTags,
        });
        setEditingMagazine(null);
      } else {
        await addMagazineIssue({
          issue_number: Number(issNumber) || 1,
          title_fa: issTitle,
          description_fa: issDesc || 'شماره جدید مجله علمی-معنوی ایدئولوژی مهدویت',
          publish_date_fa: issDate || 'تابستان ۱۴۰۴',
          cover_image: issCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
          pdf_url: issPdfUrl || '/magazines/issue-1-mahdaviyat.pdf',
          pages: [],
          featured: false,
          tags: parsedTags,
        });
      }
      setShowMagazineModal(false);
      resetForm();
    }
  };

  // Save Video Handler
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vidTitle) {
      const parsedTags = [vidTag1, vidTag2, vidTag3].map(t => t.trim()).filter(Boolean).slice(0, 3);
      if (editingVideo) {
        updateVideo(editingVideo.id, {
          title_fa: vidTitle,
          description_fa: vidDesc,
          video_url: vidUrl,
          thumbnail_url: vidThumbnail,
          duration_fa: vidDuration,
          category_fa: vidCategory,
          speaker_fa: vidSpeaker,
          tags: parsedTags,
        });
        setEditingVideo(null);
      } else {
        addVideo({
          title_fa: vidTitle,
          description_fa: vidDesc || 'درس‌گفتار و وبینار تخصصی مجله ایدئولوژی مهدویت',
          video_url: vidUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: vidThumbnail || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
          duration_fa: vidDuration || '۳۰ دقیقه',
          category_fa: vidCategory || 'وبینارها',
          speaker_fa: vidSpeaker || 'میر الهام الدین سادات',
          published_at: new Date().toLocaleDateString('fa-IR'),
          featured: false,
          tags: parsedTags,
        });
      }
      setShowVideoModal(false);
      resetForm();
    }
  };

  // Save Audio Podcast Handler
  const handleSaveAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (audTitle) {
      const parsedTags = [audTag1, audTag2, audTag3].map(t => t.trim()).filter(Boolean).slice(0, 3);
      if (editingAudio) {
        updateAudio(editingAudio.id, {
          title_fa: audTitle,
          speaker_fa: audSpeaker,
          audio_url: audUrl,
          duration_fa: audDuration,
          description_fa: audDesc,
          category_fa: audCategory,
          cover_image: audCover,
          tags: parsedTags,
        });
        setEditingAudio(null);
      } else {
        addAudio({
          title_fa: audTitle,
          speaker_fa: audSpeaker || 'میر الهام الدین سادات',
          audio_url: audUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          duration_fa: audDuration || '۲۰ دقیقه',
          description_fa: audDesc || 'فایل صوتی و پادکست اختصاصی مجله ایدئولوژی مهدویت',
          published_at: new Date().toLocaleDateString('fa-IR'),
          category_fa: audCategory || 'پادکست‌ها',
          cover_image: audCover || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
          featured: false,
          tags: parsedTags,
        });
      }
      setShowAudioModal(false);
      resetForm();
    }
  };

  // Team Member Handlers
  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName && teamRole) {
      if (editingTeam) {
        updateTeamMember(editingTeam.id, {
          name_fa: teamName,
          role_fa: teamRole,
          bio_fa: teamBio,
          avatar_url: teamAvatar,
          specialization_fa: teamSpec
        });
        setEditingTeam(null);
      } else {
        addTeamMember({
          name_fa: teamName,
          role_fa: teamRole,
          bio_fa: teamBio,
          avatar_url: teamAvatar,
          specialization_fa: teamSpec
        });
        setShowTeamModal(false);
      }
      resetForm();
    }
  };

  const openEditTeam = (tm: TeamMember) => {
    setEditingTeam(tm);
    setTeamName(tm.name_fa);
    setTeamRole(tm.role_fa);
    setTeamBio(tm.bio_fa);
    setTeamAvatar(tm.avatar_url);
    setTeamSpec(tm.specialization_fa);
    setShowTeamModal(true);
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
              برای دسترسی کامل به مدیریت اعضا، پیام‌ها و مقالات، کد عبور مدیریت را وارد نمایید.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="کد ورودی مدیر (پیش‌فرض: 123456)"
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
    <div className="space-y-8 py-6">
      
      {/* Top Admin Header */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 modern-card shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--text-primary)] font-serif-persian">
                خوش آمدید {isSuperAdmin ? 'M. Nazir Yosuf' : (currentUser?.name_fa || 'M. Nazir Yosuf')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full teal-badge text-[11px] font-bold">
                {isSuperAdmin ? 'سردبیر ارشد 👑' : currentUser?.role_fa || 'مدیر'}
              </span>
            </div>
            <p className="text-xs text-[#1B889A] font-bold mt-0.5">
              {isSuperAdmin 
                ? 'شما کنترل کامل وب‌سایت را به عهده دارید' 
                : `وارد شده به عنوان: ${currentUser?.name_fa} (${currentUser?.role_fa})`}
            </p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>خروج از پنل</span>
        </button>
      </div>

      {/* Navigation Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          
          {userPerms.can_manage_articles && (
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'articles' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>مقالات ({articles.length})</span>
            </button>
          )}

          {userPerms.can_manage_magazines && (
            <button
              onClick={() => setActiveTab('magazines')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'magazines' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>مجله ({magazineIssues.length})</span>
            </button>
          )}

          {userPerms.can_manage_videos && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'videos' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>ویدیوها ({videos.length})</span>
            </button>
          )}

          {userPerms.can_manage_audios && (
            <button
              onClick={() => setActiveTab('audios')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audios' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>پادکست‌ها ({audios.length})</span>
            </button>
          )}

          {userPerms.can_manage_team && (
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'team' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>اعضا ({teamMembers.length})</span>
            </button>
          )}

          {userPerms.can_manage_messages && (
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'messages' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>پیام‌ها ({contactMessages.length})</span>
            </button>
          )}

          {/* STRICTLY SUPER ADMIN 190716 TAB */}
          {userPerms.can_manage_cohosts && (
            <button
              onClick={() => setActiveTab('cohosts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cohosts' ? 'bg-[#1B889A] text-white shadow-md ring-2 ring-[#1B889A]/40' : 'bg-[#1B889A]/10 text-[#1B889A] border border-[#1B889A]/30 hover:bg-[#1B889A]/20'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>🔐 مدیریت پسوردها و دسترسی همکاران</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'about' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>ویرایش «درباره ما»</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'storage' ? 'bg-[#1B889A] text-white shadow-md' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)]'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>نمایش فضای دیتابیس</span>
          </button>

        </div>

        {/* Action Creation Buttons */}
        {activeTab === 'team' && (
          <button onClick={() => { setEditingTeam(null); resetForm(); setShowTeamModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>افزودن عضو جدید</span>
          </button>
        )}

        {activeTab === 'articles' && (
          <button onClick={() => { setEditingArticle(null); resetForm(); setShowArticleModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>ایجاد مقاله جدید با ویرایشگر غنی Word</span>
          </button>
        )}

        {activeTab === 'magazines' && (
          <button onClick={() => { resetForm(); setShowMagazineModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>افزودن شماره جدید مجله</span>
          </button>
        )}

        {activeTab === 'videos' && (
          <button onClick={() => { resetForm(); setShowVideoModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>افزودن ویدیوی جدید</span>
          </button>
        )}

        {activeTab === 'audios' && (
          <button onClick={() => { resetForm(); setShowAudioModal(true); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>افزودن پادکست جدید</span>
          </button>
        )}

        {activeTab === 'cohosts' && userPerms.can_manage_cohosts && (
          <button onClick={openAddCoHost} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all">
            <UserPlus className="w-4 h-4" />
            <span>افزودن پسورد و همکار جدید</span>
          </button>
        )}
      </div>

      {/* 1. DATABASE STORAGE & SYSTEM METRICS DISPLAY TAB */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl modern-card">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shadow-sm">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
                    نمایش وضعیت و میزان مصرف حافظه دیتابیس
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">آمار کامل رکوردها و فضای ذخیره‌سازی ابری سوپربیس (Supabase PostgreSQL Cloud)</p>
                </div>
              </div>

              <div className="px-4 py-1.5 rounded-full teal-badge text-xs font-bold flex items-center gap-2 w-fit">
                <Server className="w-4 h-4 text-[#1B889A]" />
                <span>وضعیت: دیتابیس ابری سوپربیس (Supabase Cloud Online)</span>
              </div>
            </div>

            {/* Storage Meter Bar */}
            <div className="space-y-3 bg-[var(--bg-color)] p-5 rounded-2xl border border-[var(--card-border)]">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                <span>حجم اشغال‌شده دیتابیس ابری سوپربیس (Supabase):</span>
                <span className="font-mono text-[#1B889A]">{formattedStorageKB} KB / Supabase Cloud PostgreSQL</span>
              </div>

              <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-[var(--card-border)]">
                <div 
                  className="h-full bg-gradient-to-r from-[#1B889A] to-cyan-400 rounded-full transition-all duration-500 shadow-md"
                  style={{ width: `${Math.max(storagePercentage, 1)}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1 gap-1">
                <span>مجموع رکوردهای همگام‌سازی‌شده: <strong className="text-[var(--text-primary)]">{totalRecordsCount} مورد</strong></span>
                <span className="text-[#1B889A] font-bold">میزبانی ابری: Supabase Cloud (PostgreSQL 500MB+ نامحدود ابری)</span>
              </div>
            </div>

            {/* Breakdown Grid of Database Tables */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">مقالات و متون</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{articles.length}</span>
              </div>

              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">شماره‌های مجله</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{magazineIssues.length}</span>
              </div>

              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">پادکست‌های صوتی</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{audios.length}</span>
              </div>

              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">درس‌گفتار و ویدیو</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{videos.length}</span>
              </div>

              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">اینفوگرافیک‌ها</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{infographics.length}</span>
              </div>

              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">اعضای تحریریه</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{teamMembers.length}</span>
              </div>

              <div className="p-4 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] space-y-1">
                <span className="text-xs text-[var(--text-secondary)] block">پیام‌های دریافتی ارتباط با ما</span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{contactMessages.length}</span>
              </div>

              <div className="p-4 rounded-2xl border border-[#1B889A]/40 bg-[#1B889A]/10 space-y-1">
                <span className="text-xs text-[#1B889A] font-bold block flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> پسوردهای همکاران (Co-Hosts)
                </span>
                <span className="text-xl font-bold text-[#1B889A] font-mono">{coHosts.length} مورد</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. CO-HOSTS & PASSWORDS MANAGEMENT TAB (STRICTLY SUPER ADMIN 190716 ONLY) */}
      {activeTab === 'cohosts' && userPerms.can_manage_cohosts && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl modern-card">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A] shadow-sm">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
                    مدیریت پسوردها و تعیین سطح صلاحیّت همکاران (Co-Hosts)
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    تنها شما (با پسورد کل ۱۹۰۷۱۶) به این بخش دسترسی دارید. پسوردهای اختصاصی با سطوح صلاحیت مختلف برای همکاران بگذارید.
                  </p>
                </div>
              </div>

              <button
                onClick={openAddCoHost}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold shadow-md transition-all shrink-0 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>افزودن پسورد و همکار جدید</span>
              </button>
            </div>

            {/* CO-HOSTS LIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coHosts.map((ch) => (
                <div
                  key={ch.id}
                  className={`p-5 rounded-2xl border space-y-4 modern-card shadow-md ${
                    ch.is_super_admin || ch.password_code === '190716'
                      ? 'bg-[#1B889A]/10 border-[#1B889A]'
                      : 'bg-[var(--bg-color)] border-[var(--card-border)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--card-border)] pb-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">
                          {ch.name_fa}
                        </h3>
                        {ch.is_super_admin && (
                          <span className="px-2 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-bold">
                            سردبیر ارشد 👑
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#1B889A] font-bold">{ch.role_fa}</p>
                      <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                        پسورد اختصاصی ورود: <strong className="text-[var(--text-primary)] font-bold px-2 py-0.5 bg-[var(--card-bg)] rounded border border-[var(--card-border)]">{ch.password_code}</strong>
                      </div>
                    </div>

                    {!ch.is_super_admin && ch.password_code !== '190716' && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditCoHost(ch)}
                          className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] transition-colors"
                          title="ویرایش سطح صلاحیت و پسورد"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCoHost(ch.id)}
                          className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-stone-400 hover:text-red-400 transition-colors"
                          title="حذف این پسورد و لغو دسترسی"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PERMISSIONS BADGES GRID */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] block">سطح صلاحیت‌ها و مجوزهای دسترسی:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ch.permissions.can_manage_articles && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> مدیریت مقالات
                        </span>
                      )}
                      {ch.permissions.can_manage_magazines && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> مدیریت مجلات
                        </span>
                      )}
                      {ch.permissions.can_manage_videos && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> مدیریت ویدیوها
                        </span>
                      )}
                      {ch.permissions.can_manage_audios && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> مدیریت پادکست‌ها
                        </span>
                      )}
                      {ch.permissions.can_manage_team && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> مدیریت اعضای تحریریه
                        </span>
                      )}
                      {ch.permissions.can_manage_messages && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> مشاهده پیام‌ها
                        </span>
                      )}
                      {ch.permissions.can_manage_cohosts && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#1B889A]/20 text-[#1B889A] border border-[#1B889A]/40 text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> مدیریت کل و پسوردها
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 2. EDITABLE ABOUT US SECTION TAB */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl modern-card">
            
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 flex items-center justify-center text-[#1B889A]">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-persian">
                    ویرایش متن معرفی بخش «درباره ما» و بنر اصلی
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">تغییر و به‌روزرسانی متن رسمی رسالت و چشم‌انداز مجله</p>
                </div>
              </div>
            </div>

            {aboutSavedNotify && (
              <div className="p-4 rounded-2xl bg-[#1B889A]/10 border border-[#1B889A]/30 text-[#1B889A] text-xs flex items-center gap-3 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-[#1B889A] shrink-0" />
                <span>متن بخش «درباره ما» با موفقیت ذخیره و در تمامی صفحات وب‌سایت اعمال گردید.</span>
              </div>
            )}

            <form onSubmit={handleSaveAboutUs} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-2 font-serif-persian">
                  متن رسمی معرفی و رسالت مجله:
                </label>
                <textarea
                  value={aboutInputText}
                  onChange={(e) => setAboutInputText(e.target.value)}
                  rows={5}
                  className="w-full p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed focus:outline-none focus:border-[#1B889A] font-serif-persian"
                  placeholder="متن معرفی مجله را بنویسید..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#1B889A] hover:bg-[#156d7b] text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره و به‌روزرسانی متن درباره ما</span>
                </button>
              </div>
            </form>

            {/* Live Preview */}
            <div className="space-y-2 pt-4 border-t border-[var(--card-border)]">
              <span className="text-xs font-bold text-[var(--text-secondary)] block">پیش‌نمایش زنده در وب‌سایت:</span>
              <div className="p-5 bg-[var(--bg-color)] rounded-2xl border border-[var(--card-border)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-serif-persian">
                {aboutInputText}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ARTICLES TABLE & CREATION */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((art) => (
              <div key={art.id} className="p-5 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#1B889A] rounded-2xl flex items-center justify-between gap-4 modern-card shadow-md">
                <div className="min-w-0 space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] font-bold block w-fit">{art.category_fa}</span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{art.title_fa}</h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate">نویسنده: {art.author_name_fa} • {art.read_time_fa}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => updateArticle(art.id, { featured: !art.featured })}
                    className={`p-2 rounded-xl border transition-all ${
                      art.featured 
                        ? 'bg-[#1B889A] text-white border-[#1B889A]' 
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A]'
                    }`}
                    title={art.featured ? 'پین شده در صفحه اول (کلیک برای تکی‌کردن)' : 'پین‌کردن در صفحه اول'}
                  >
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={() => openEditArticle(art)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A] transition-colors" title="ویرایش با Word Editor"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteArticle(art.id)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-red-400 hover:border-red-400 transition-colors" title="حذف مقاله"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM MEMBERS TABLE */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((tm) => (
              <div key={tm.id} className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-4 modern-card shadow-md group">
                <div className="flex items-center gap-3">
                  
                  {/* BLACK AND WHITE AVATAR */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#1B889A] shrink-0 bg-stone-900 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tm.avatar_url} alt="" className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian">{tm.name_fa}</h3>
                    <span className="text-xs text-[#1B889A] font-semibold block">{tm.role_fa}</span>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">{tm.bio_fa}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditTeam(tm)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A] transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteTeamMember(tm.id)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-red-400 hover:border-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {contactMessages.map((msg) => {
              const isExpanded = expandedMessageIds.includes(msg.id);
              const msgText = msg.message || msg.message_text || '';
              const isLongMessage = msgText.length > 250 || msgText.includes('\n');
              const isCopied = copiedMsgId === msg.id;

              return (
                <div key={msg.id} className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-4 modern-card shadow-lg">
                  
                  {/* TOP HEADER: SENDER INFO & ACTION BUTTONS AT THE TOP */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[var(--text-primary)] font-serif-persian">
                          {msg.sender_name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full teal-badge text-[10px] font-bold">
                          {msg.status === 'unread' ? 'جدید' : 'بررسی‌شده'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] dir-ltr text-right">
                        <span className="font-mono text-[#1B889A]">{msg.email || msg.sender_email}</span>
                        {msg.sender_phone && (
                          <span className="font-mono text-amber-400 font-bold">{msg.sender_phone}</span>
                        )}
                        <span className="text-stone-400 dir-rtl">تاریخ: {msg.created_at || msg.sent_at}</span>
                      </div>
                    </div>

                    {/* TOP ACTION BUTTONS BAR */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyMessage(msg)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                          isCopied
                            ? 'bg-[#1B889A] text-white border-[#1B889A]'
                            : 'bg-[var(--bg-color)] border-[var(--card-border)] text-[var(--text-primary)] hover:border-[#1B889A]'
                        }`}
                        title="کپی متن کامل پیام"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-[#1B889A]" />}
                        <span>{isCopied ? 'کپی شد' : 'کپی پیام'}</span>
                      </button>

                      <button
                        onClick={() => markContactRead(msg.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-[#1B889A] text-[var(--text-primary)] text-xs font-bold transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#1B889A]" />
                        <span>علامت خوانده‌شده</span>
                      </button>

                      <button
                        onClick={() => deleteContactMessage(msg.id)}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all active:scale-95"
                        title="حذف پیام"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* SUBJECT & FULL MESSAGE BODY */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#1B889A] font-serif-persian">
                      موضوع: {msg.subject}
                    </h4>

                    <div className="p-4 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-serif-persian whitespace-pre-line dir-auto">
                      {isLongMessage && !isExpanded ? (
                        <>
                          {msgText.slice(0, 250)}...
                          <button
                            onClick={() => toggleExpandMessage(msg.id)}
                            className="text-[#1B889A] font-bold block mt-2 hover:underline flex items-center gap-1"
                          >
                            <span>مشاهده متن کامل پیام</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {msgText}
                          {isLongMessage && isExpanded && (
                            <button
                              onClick={() => toggleExpandMessage(msg.id)}
                              className="text-[#1B889A] font-bold block mt-2 hover:underline flex items-center gap-1"
                            >
                              <span>بستن و خلاصه‌سازی</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* ATTACHED FILE DOWNLOAD SECTION */}
                  {msg.file_url && (
                    <div className="p-4 bg-[var(--bg-color)] border border-[#1B889A]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)] min-w-0">
                        <Paperclip className="w-5 h-5 text-[#1B889A] shrink-0" />
                        <div>
                          <span className="text-[11px] text-[var(--text-secondary)] block">فایل پیوست‌شده همراه پیام:</span>
                          <span className="font-bold text-[var(--text-primary)] truncate block">{msg.file_name || 'فایل ضمیمه'}</span>
                        </div>
                      </div>

                      <a
                        href={msg.file_url}
                        download={msg.file_name || 'فایل_پیوست'}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold transition-all shadow-md shrink-0 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>دانلود فایل پیوست</span>
                      </a>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAGAZINES TABLE */}
      {activeTab === 'magazines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {magazineIssues.map((iss) => (
              <div key={iss.id} className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-4 modern-card shadow-md">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{iss.title_fa}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">تعداد دانلود: {iss.download_count}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => updateMagazineIssue(iss.id, { featured: !iss.featured })}
                    className={`p-2 rounded-xl border transition-all ${
                      iss.featured 
                        ? 'bg-[#1B889A] text-white border-[#1B889A]' 
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A]'
                    }`}
                    title={iss.featured ? 'پین شده در صفحه اول' : 'پین‌کردن مجله در صفحه اول'}
                  >
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={() => openEditMagazine(iss)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A] transition-colors" title="ویرایش شماره مجله"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteMagazineIssue(iss.id)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-red-400 transition-colors shrink-0" title="حذف مجله"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEOS TABLE */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((vid) => (
              <div key={vid.id} className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-4 modern-card shadow-md">
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded-full teal-badge text-[10px] font-bold block w-fit mb-1">{vid.category_fa}</span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{vid.title_fa}</h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate">سخنران: {vid.speaker_fa}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => updateVideo(vid.id, { featured: !vid.featured })}
                    className={`p-2 rounded-xl border transition-all ${
                      vid.featured 
                        ? 'bg-[#1B889A] text-white border-[#1B889A]' 
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A]'
                    }`}
                    title={vid.featured ? 'پین شده در صفحه اول' : 'پین‌کردن ویدیو در صفحه اول'}
                  >
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={() => openEditVideo(vid)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A] transition-colors" title="ویرایش ویدیو"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteVideo(vid.id)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-red-400 transition-colors shrink-0" title="حذف ویدیو"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIOS / PODCASTS TABLE */}
      {activeTab === 'audios' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {audios.map((aud) => (
              <div key={aud.id} className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-between gap-4 modern-card shadow-md">
                <div className="min-w-0 space-y-1">
                  <span className="px-2 py-0.5 rounded-full teal-badge text-[10px] font-bold block w-fit">{aud.category_fa}</span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif-persian truncate">{aud.title_fa}</h3>
                  <p className="text-xs text-[var(--text-secondary)] truncate">گوینده/سخنران: {aud.speaker_fa} • {aud.duration_fa}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => updateAudio(aud.id, { featured: !aud.featured })}
                    className={`p-2 rounded-xl border transition-all ${
                      aud.featured 
                        ? 'bg-[#1B889A] text-white border-[#1B889A]' 
                        : 'bg-[var(--bg-color)] border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A]'
                    }`}
                    title={aud.featured ? 'پین شده در صفحه اول' : 'پین‌کردن پادکست در صفحه اول'}
                  >
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={() => openEditAudio(aud)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-[#1B889A] hover:border-[#1B889A] transition-colors" title="ویرایش پادکست"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteAudio(aud.id)} className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--card-border)] text-stone-400 hover:text-red-400 transition-colors shrink-0" title="حذف پادکست"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLE EDITOR MODAL WITH WORD RICH TOOLBAR & TEXT TO SPEECH */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 max-w-3xl w-full space-y-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1B889A]" />
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                  {editingArticle ? 'ویرایش مقاله با ویرایشگر پیشرفته Word' : 'نگارش مقاله جدید با ویرایشگر Word'}
                </h3>
              </div>
              <button onClick={() => setShowArticleModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">عنوان مقاله:</label>
                  <input type="text" value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="عنوان اصلی مقاله..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">دسته‌بندی مقاله:</label>
                  <select value={artCategory} onChange={(e) => setArtCategory(e.target.value as any)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian">
                    <option value="تحلیل‌ها">تحلیل‌ها</option>
                    <option value="سرمقاله‌ها">سرمقاله‌ها</option>
                    <option value="نقد مکاتب">نقد مکاتب</option>
                    <option value="شناخت مهدویت">شناخت مهدویت</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">نام نویسنده:</label>
                  <input type="text" value={artAuthor} onChange={(e) => setArtAuthor(e.target.value)} placeholder="نام نویسنده..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">لقب / سمت / تخصص نویسنده:</label>
                  <input type="text" value={artAuthorTitle} onChange={(e) => setArtAuthorTitle(e.target.value)} placeholder="مثال: دکتر / سردبیر / پژوهشگر ارشد" className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1 flex items-center justify-between">
                    <span>زمان مطالعه (محاسبه خودکار):</span>
                    <span className="text-[10px] text-[#1B889A] font-bold">هوشمند ⚡</span>
                  </label>
                  <input type="text" value={artReadTime} onChange={(e) => setArtReadTime(e.target.value)} placeholder="محاسبه هوشمند بر اساس تعداد کلمات..." className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono font-bold text-[#1B889A]" />
                </div>
              </div>

              {/* COVER IMAGE UPLOAD & MANUAL POSITION CONTROL BOX */}
              <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-serif-persian">
                    <ImageIcon className="w-4 h-4 text-[#1B889A]" />
                    <span>تصویر کاور اصلی مقاله:</span>
                  </label>
                  {artImage && (
                    <span className="text-[11px] text-[#1B889A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تصویر کاور تنظیم شده</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>انتخاب و آپلود عکس کاور از کامپیوتر</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-[var(--text-secondary)] font-bold">یا</span>

                  <input
                    type="text"
                    value={artImage || ''}
                    onChange={(e) => {
                      setArtImage(e.target.value);
                      setArtImageFileName('');
                    }}
                    placeholder="لینک مستقیم تصویر کاور (https://...)..."
                    className="w-full p-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">چکیده / خلاصه مقاله:</label>
                <textarea value={artExcerpt} onChange={(e) => setArtExcerpt(e.target.value)} placeholder="خلاصه کوتاه برای نمایش در کارت..." rows={2} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>

              {/* 3 DEDICATED TAGS / KEYWORDS INPUTS (MAX 3) */}
              <div className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
                <label className="text-xs font-bold text-[var(--text-primary)] block font-serif-persian flex items-center justify-between">
                  <span>🏷️ کلمات کلیدی و تگ‌ها (حداکثر ۳ تگ برای این مقاله):</span>
                  <span className="text-[10px] text-[#1B889A] font-bold">قابل کلیک جهت سرچ ⚡</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={artTag1}
                    onChange={(e) => setArtTag1(e.target.value)}
                    placeholder="تگ ۱ (اصلی)"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={artTag2}
                    onChange={(e) => setArtTag2(e.target.value)}
                    placeholder="تگ ۲"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={artTag3}
                    onChange={(e) => setArtTag3(e.target.value)}
                    placeholder="تگ ۳"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                </div>
              </div>



              {/* WORD-LIKE RICH TEXT TOOLBAR */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-primary)] block font-serif-persian">
                  متن اصلی مقاله (همراه با ابزارهای ویرایشی Word):
                </label>

                {/* WORD TOOLBAR BUTTONS */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-t-xl">
                  <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="بولد / برجسته (**متن**)">
                    <Bold className="w-4 h-4" />
                  </button>

                  <button type="button" onClick={() => insertFormatting('*', '*')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="مورب / ایتالیک (*متن*)">
                    <Italic className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-[var(--card-border)] mx-1" />

                  <button type="button" onClick={() => insertFormatting('# ')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="تیتر اصلی (# عنوان)">
                    <Heading1 className="w-4 h-4" />
                  </button>

                  <button type="button" onClick={() => insertFormatting('## ')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="زیرعنوان (## عنوان)">
                    <Heading2 className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-[var(--card-border)] mx-1" />

                  <button type="button" onClick={() => insertFormatting('- ')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="لیست نقطه‌ای (- مورد)">
                    <List className="w-4 h-4" />
                  </button>

                  <button type="button" onClick={() => insertFormatting('> ')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="نقل قول / آیه (> متن)">
                    <Quote className="w-4 h-4" />
                  </button>

                  <button type="button" onClick={() => insertFormatting('```\n', '\n```')} className="p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--text-primary)]" title="بلوک کد یا متن ویژه">
                    <Code className="w-4 h-4" />
                  </button>

                  <div className="mr-auto text-[11px] text-[var(--text-secondary)] font-mono">
                    تعداد کلمات: {artContent.trim() ? artContent.trim().split(/\s+/).length : 0}
                  </div>
                </div>

                <textarea
                  ref={contentTextAreaRef}
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  placeholder="متن کامل مقاله را بنویسید یا ویرایش کنید..."
                  rows={8}
                  required
                  className="w-full p-4 bg-[var(--bg-color)] border border-t-0 border-[var(--card-border)] rounded-b-xl text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed focus:outline-none focus:border-[#1B889A] font-serif-persian"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowArticleModal(false)} className="px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">انصراف</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md">
                  {editingArticle ? 'بروزرسانی مقاله' : 'انتشار مقاله در سایت'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                {editingTeam ? 'ویرایش مشخصات فرد/عضو' : 'افزودن عضو جدید هیئت تحریریه'}
              </h3>
              <button onClick={() => setShowTeamModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTeam} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">نام و تخلص:</label>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="مثال: میر الهام الدین سادات" required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">سمت / مسئولیت:</label>
                <input type="text" value={teamRole} onChange={(e) => setTeamRole(e.target.value)} placeholder="مثال: سردبیر مجله" required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">بیوگرافی خلاصه:</label>
                <textarea value={teamBio} onChange={(e) => setTeamBio(e.target.value)} placeholder="توضیحات بیوگرافی..." rows={3} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">لینک تصویر آواتار:</label>
                <input type="url" value={teamAvatar} onChange={(e) => setTeamAvatar(e.target.value)} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#1B889A] text-white text-xs font-bold">
                {editingTeam ? 'بروزرسانی مشخصات' : 'افزودن به اعضا'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MAGAZINE ISSUE MODAL */}
      {showMagazineModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#1B889A]" />
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                  افزودن شماره جدید مجله
                </h3>
              </div>
              <button onClick={() => setShowMagazineModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveMagazine} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">شماره مجله (عدد):</label>
                  <input type="number" min={1} value={issNumber} onChange={(e) => setIssNumber(Number(e.target.value))} required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">فصل / تاریخ انتشار:</label>
                  <input type="text" value={issDate} onChange={(e) => setIssDate(e.target.value)} placeholder="مثال: تابستان ۱۴۰۴" required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">عنوان اصلی این شماره:</label>
                <input type="text" value={issTitle} onChange={(e) => setIssTitle(e.target.value)} placeholder="عنوان شماره نخست مجله..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">توضیحات و معرفی شماره مجله:</label>
                <textarea value={issDesc} onChange={(e) => setIssDesc(e.target.value)} placeholder="توضیحات مختصر..." rows={3} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              {/* 1. UPLOAD MAGAZINE COVER IMAGE */}
              <div className="p-3.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-serif-persian">
                    <ImageIcon className="w-4 h-4 text-[#1B889A]" />
                    <span>آپلود مستقیم عکس کاور روی جلد مجله:</span>
                  </label>
                  {issCover && (
                    <span className="text-[11px] text-[#1B889A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تصویر کاور آماده است</span>
                    </span>
                  )}
                </div>

                <label className="w-full px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95">
                  <Upload className="w-4 h-4" />
                  <span>{issCoverFileName ? `کاور: ${issCoverFileName}` : 'انتخاب عکس کاور مجله از دستگاه'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMagazineCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 2. UPLOAD ACTUAL MAGAZINE PDF FILE */}
              <div className="p-3.5 bg-[var(--bg-color)] border border-[#1B889A]/40 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 font-serif-persian">
                    <FileText className="w-4 h-4 text-[#1B889A]" />
                    <span>آپلود مستقیم فایل PDF خود مجله جهت دانلود:</span>
                  </label>
                  {issPdfUrl && (
                    <span className="text-[11px] text-[#1B889A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>فایل PDF آماده است</span>
                    </span>
                  )}
                </div>

                <label className="w-full px-4 py-2.5 rounded-xl bg-[#1B889A] hover:bg-[#156d7b] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95">
                  <Download className="w-4 h-4" />
                  <span>{issPdfFileName ? `فایل: ${issPdfFileName}` : 'انتخاب و آپلود مستقیم فایل PDF مجله از دستگاه'}</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleMagazinePdfUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 3 DEDICATED TAGS / KEYWORDS INPUTS (MAX 3) */}
              <div className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
                <label className="text-xs font-bold text-[var(--text-primary)] block font-serif-persian flex items-center justify-between">
                  <span>🏷️ کلمات کلیدی و تگ‌ها (حداکثر ۳ تگ برای این مجله):</span>
                  <span className="text-[10px] text-[#1B889A] font-bold">قابل کلیک جهت سرچ ⚡</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={issTag1}
                    onChange={(e) => setIssTag1(e.target.value)}
                    placeholder="تگ ۱ (اصلی)"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={issTag2}
                    onChange={(e) => setIssTag2(e.target.value)}
                    placeholder="تگ ۲"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={issTag3}
                    onChange={(e) => setIssTag3(e.target.value)}
                    placeholder="تگ ۳"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowMagazineModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">انصراف</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md">
                  انتشار شماره مجله
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#1B889A]" />
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                  افزودن ویدیوی جدید
                </h3>
              </div>
              <button onClick={() => setShowVideoModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveVideo} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">عنوان ویدیو / درس‌گفتار:</label>
                <input type="text" value={vidTitle} onChange={(e) => setVidTitle(e.target.value)} placeholder="عنوان ویدیو..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">سخنران / ارائه دهنده:</label>
                  <input type="text" value={vidSpeaker} onChange={(e) => setVidSpeaker(e.target.value)} placeholder="نام سخنران..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">مدت زمان (مثلاً: ۳۰ دقیقه):</label>
                  <input type="text" value={vidDuration} onChange={(e) => setVidDuration(e.target.value)} placeholder="۳۰ دقیقه" className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">لینک مستقیم ویدیو یا یوتیوب:</label>
                <input type="text" value={vidUrl} onChange={(e) => setVidUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono" />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">تصویر بندانگشتی (کاور ویدیو):</label>
                <input type="text" value={vidThumbnail} onChange={(e) => setVidThumbnail(e.target.value)} placeholder="https://..." className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono" />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">توضیحات ویدیو:</label>
                <textarea value={vidDesc} onChange={(e) => setVidDesc(e.target.value)} placeholder="خلاصه توضیحات..." rows={2} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              {/* 3 DEDICATED TAGS / KEYWORDS INPUTS (MAX 3) */}
              <div className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
                <label className="text-xs font-bold text-[var(--text-primary)] block font-serif-persian flex items-center justify-between">
                  <span>🏷️ کلمات کلیدی و تگ‌ها (حداکثر ۳ تگ برای این ویدیو):</span>
                  <span className="text-[10px] text-[#1B889A] font-bold">قابل کلیک جهت سرچ ⚡</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={vidTag1}
                    onChange={(e) => setVidTag1(e.target.value)}
                    placeholder="تگ ۱ (اصلی)"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={vidTag2}
                    onChange={(e) => setVidTag2(e.target.value)}
                    placeholder="تگ ۲"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={vidTag3}
                    onChange={(e) => setVidTag3(e.target.value)}
                    placeholder="تگ ۳"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowVideoModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">انصراف</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md">
                  انتشار ویدیو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIO PODCAST MODAL */}
      {showAudioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#1B889A]" />
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                  افزودن پادکست صوتی جدید
                </h3>
              </div>
              <button onClick={() => setShowAudioModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveAudio} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">عنوان پادکست / فایل صوتی:</label>
                <input type="text" value={audTitle} onChange={(e) => setAudTitle(e.target.value)} placeholder="عنوان پادکست صوتی..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">گوینده / سخنران:</label>
                  <input type="text" value={audSpeaker} onChange={(e) => setAudSpeaker(e.target.value)} placeholder="نام گوینده یا سخنران..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">مدت زمان (مثلاً: ۲۰ دقیقه):</label>
                  <input type="text" value={audDuration} onChange={(e) => setAudDuration(e.target.value)} placeholder="۲۰ دقیقه" className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">دسته‌بندی پادکست:</label>
                <input type="text" value={audCategory} onChange={(e) => setAudCategory(e.target.value)} placeholder="پادکست‌ها / فایل‌های صوتی" required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">لینک مستقیم فایل صوتی (MP3):</label>
                <input type="text" value={audUrl} onChange={(e) => setAudUrl(e.target.value)} placeholder="https://..." required className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono" />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">لینک عکس کاور پادکست:</label>
                <input type="text" value={audCover} onChange={(e) => setAudCover(e.target.value)} placeholder="https://..." className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono" />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">توضیحات خلاصه پادکست:</label>
                <textarea value={audDesc} onChange={(e) => setAudDesc(e.target.value)} placeholder="خلاصه توضیحات..." rows={2} className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian" />
              </div>

              {/* 3 DEDICATED TAGS / KEYWORDS INPUTS (MAX 3) */}
              <div className="p-3 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-2">
                <label className="text-xs font-bold text-[var(--text-primary)] block font-serif-persian flex items-center justify-between">
                  <span>🏷️ کلمات کلیدی و تگ‌ها (حداکثر ۳ تگ برای این پادکست):</span>
                  <span className="text-[10px] text-[#1B889A] font-bold">قابل کلیک جهت سرچ ⚡</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={audTag1}
                    onChange={(e) => setAudTag1(e.target.value)}
                    placeholder="تگ ۱ (اصلی)"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={audTag2}
                    onChange={(e) => setAudTag2(e.target.value)}
                    placeholder="تگ ۲"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                  <input
                    type="text"
                    value={audTag3}
                    onChange={(e) => setAudTag3(e.target.value)}
                    placeholder="تگ ۳"
                    className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAudioModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">انصراف</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md">
                  انتشار پادکست
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CO-HOST & PERMISSIONS MODAL */}
      {showCoHostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#1B889A]" />
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-persian">
                  {editingCoHost ? 'ویرایش همکار و سطح صلاحیّت' : 'افزودن پسورد و همکار جدید'}
                </h3>
              </div>
              <button onClick={() => setShowCoHostModal(false)} className="text-stone-400 hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveCoHost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">نام و تخلص همکار (نام نمایش در ادمین):</label>
                <input
                  type="text"
                  value={coHostName}
                  onChange={(e) => setCoHostName(e.target.value)}
                  placeholder="مثلاً: استاد محمد رسولی"
                  required
                  className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">پسورد / پین اختصاصی ورود:</label>
                  <input
                    type="text"
                    value={coHostPassword}
                    onChange={(e) => setCoHostPassword(e.target.value)}
                    placeholder="مثلاً: 889900"
                    required
                    className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-mono font-bold text-[#1B889A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">سمت / مسئولیت همکار:</label>
                  <input
                    type="text"
                    value={coHostRole}
                    onChange={(e) => setCoHostRole(e.target.value)}
                    placeholder="مثلاً: مدیر بخش مقالات"
                    required
                    className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-xs font-serif-persian"
                  />
                </div>
              </div>

              {/* PERMISSIONS CHECKBOXES LIST */}
              <div className="p-4 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-2xl space-y-3">
                <label className="text-xs font-bold text-[var(--text-primary)] block font-serif-persian">
                  تعیین سطح صلاحیت‌ها و دسترسی‌های این پسورد:
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-bold">
                    <input type="checkbox" checked={permArticles} onChange={(e) => setPermArticles(e.target.checked)} className="w-4 h-4 accent-[#1B889A] rounded" />
                    <span>مدیریت و انتشار مقالات ✍️</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-bold">
                    <input type="checkbox" checked={permMagazines} onChange={(e) => setPermMagazines(e.target.checked)} className="w-4 h-4 accent-[#1B889A] rounded" />
                    <span>مدیریت و انتشار شماره‌های مجله 📑</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-bold">
                    <input type="checkbox" checked={permVideos} onChange={(e) => setPermVideos(e.target.checked)} className="w-4 h-4 accent-[#1B889A] rounded" />
                    <span>مدیریت و انتشار ویدیوها 🎥</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-bold">
                    <input type="checkbox" checked={permAudios} onChange={(e) => setPermAudios(e.target.checked)} className="w-4 h-4 accent-[#1B889A] rounded" />
                    <span>مدیریت و انتشار پادکست‌های صوتی 🎧</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-bold">
                    <input type="checkbox" checked={permTeam} onChange={(e) => setPermTeam(e.target.checked)} className="w-4 h-4 accent-[#1B889A] rounded" />
                    <span>مدیریت اعضای هیئت تحریریه 👥</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-bold">
                    <input type="checkbox" checked={permMessages} onChange={(e) => setPermMessages(e.target.checked)} className="w-4 h-4 accent-[#1B889A] rounded" />
                    <span>مشاهده و خواندن پیام‌های ارتباط با ما 📩</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCoHostModal(false)} className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">انصراف</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#1B889A] text-white text-xs font-bold shadow-md">
                  {editingCoHost ? 'ذخیره تغییرات صلاحیت' : 'ثبت پسورد و همکار جدید'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
