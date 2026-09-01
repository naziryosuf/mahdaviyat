import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { initialVideos } from '@/data/initialData';
import { VideoPageClient } from './VideoPageClient';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

async function getVideoItem(videoId?: string) {
  try {
    if (videoId) {
      const { data: item } = await supabase
        .from('video_items')
        .select('*')
        .eq('id', videoId)
        .single();

      if (item) return item;
    }

    // Default to latest video item
    const { data: latest } = await supabase
      .from('video_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latest) return latest;
  } catch (e) {
    // ignore
  }

  if (videoId) {
    const found = initialVideos.find(v => v.id === videoId);
    if (found) return found;
  }
  return initialVideos[0] || null;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id: videoId } = await searchParams;
  const video = await getVideoItem(videoId);

  if (!video) {
    return {
      title: 'آرشیو ویدیوها و رسانه تصویری',
      description: 'مشاهده ویدیوهای تحلیلی، سخنرانی‌ها و کلیپ‌های شناختی مجله ایدئولوژی مهدویت.',
    };
  }

  const title = video.title_fa || 'رسانه تصویری ایدئولوژی مهدویت';
  const description = video.description_fa || `سخنران: ${video.speaker_fa} • مدت زمان: ${video.duration_fa}`;
  const imageUrl = video.thumbnail_url && video.thumbnail_url.trim() !== ''
    ? video.thumbnail_url
    : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80';
  const pageUrl = videoId
    ? `https://www.ideologymahdaviyat.org/video?id=${encodeURIComponent(videoId)}`
    : 'https://www.ideologymahdaviyat.org/video';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: pageUrl,
      siteName: 'ایدئولوژی مهدویت',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fa_AF',
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function VideoPage() {
  return <VideoPageClient />;
}
