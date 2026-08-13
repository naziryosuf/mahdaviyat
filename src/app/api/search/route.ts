import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initialArticles, initialMagazineIssues, initialAudios, initialVideos } from '@/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  if (!query) {
    return NextResponse.json({
      success: true,
      query: '',
      totalResults: 0,
      articles: [],
      audios: [],
      videos: [],
      magazines: [],
    });
  }

  try {
    const [
      { data: supaArticles },
      { data: supaAudios },
      { data: supaVideos },
      { data: supaMagazines }
    ] = await Promise.all([
      supabase.from('articles').select('*'),
      supabase.from('audio_items').select('*'),
      supabase.from('video_items').select('*'),
      supabase.from('magazine_issues').select('*')
    ]);

    const articles = supaArticles && supaArticles.length > 0 ? supaArticles : initialArticles;
    const audios = supaAudios && supaAudios.length > 0 ? supaAudios : initialAudios;
    const videos = supaVideos && supaVideos.length > 0 ? supaVideos : initialVideos;
    const magazines = supaMagazines && supaMagazines.length > 0 ? supaMagazines : initialMagazineIssues;

    const matchedArticles = articles.filter((art: any) =>
      art.title_fa?.toLowerCase().includes(query) ||
      art.excerpt_fa?.toLowerCase().includes(query) ||
      art.content_fa?.toLowerCase().includes(query) ||
      art.author_name_fa?.toLowerCase().includes(query)
    );

    const matchedAudios = audios.filter((aud: any) =>
      aud.title_fa?.toLowerCase().includes(query) ||
      aud.speaker_fa?.toLowerCase().includes(query) ||
      aud.description_fa?.toLowerCase().includes(query)
    );

    const matchedVideos = videos.filter((vid: any) =>
      vid.title_fa?.toLowerCase().includes(query) ||
      vid.speaker_fa?.toLowerCase().includes(query) ||
      vid.description_fa?.toLowerCase().includes(query)
    );

    const matchedMagazines = magazines.filter((issue: any) =>
      issue.title_fa?.toLowerCase().includes(query) ||
      issue.description_fa?.toLowerCase().includes(query)
    );

    const total = matchedArticles.length + matchedAudios.length + matchedVideos.length + matchedMagazines.length;

    return NextResponse.json({
      success: true,
      query,
      totalResults: total,
      articles: matchedArticles,
      audios: matchedAudios,
      videos: matchedVideos,
      magazines: matchedMagazines,
    });
  } catch {
    return NextResponse.json({
      success: true,
      query,
      totalResults: 0,
      articles: [],
      audios: [],
      videos: [],
      magazines: [],
    });
  }
}
