import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { initialAudios } from '@/data/initialData';
import { AudioPageClient } from './AudioPageClient';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

async function getAudioItem(audioId?: string) {
  try {
    if (audioId) {
      const { data: item } = await supabase
        .from('audio_items')
        .select('*')
        .eq('id', audioId)
        .single();

      if (item) return item;
    }

    // Default to latest audio item
    const { data: latest } = await supabase
      .from('audio_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latest) return latest;
  } catch (e) {
    // ignore
  }

  if (audioId) {
    const found = initialAudios.find(a => a.id === audioId);
    if (found) return found;
  }
  return initialAudios[0] || null;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id: audioId } = await searchParams;
  const audio = await getAudioItem(audioId);

  if (!audio) {
    return {
      title: 'آرشیو محتوای صوتی و پادکست‌ها',
      description: 'شنیدن پادکست‌ها، سخنرانی‌ها و مقالات صوتی مجله ایدئولوژی مهدویت به صورت آنلاین و با کیفیت بالا.',
    };
  }

  const title = audio.title_fa || 'محتوای صوتی و پادکست مهدویت';
  const description = audio.description_fa || `سخنران: ${audio.speaker_fa} • مدت زمان: ${audio.duration_fa}`;
  const imageUrl = audio.cover_image && audio.cover_image.trim() !== ''
    ? audio.cover_image
    : 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop&q=80';
  const pageUrl = audioId
    ? `https://www.ideologymahdaviyat.org/audio?id=${encodeURIComponent(audioId)}`
    : 'https://www.ideologymahdaviyat.org/audio';

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
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function AudioPage() {
  return <AudioPageClient />;
}
