import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

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

  const db = readDB();

  const matchedArticles = db.articles.filter((art) =>
    art.title_fa.toLowerCase().includes(query) ||
    art.excerpt_fa.toLowerCase().includes(query) ||
    art.content_fa.toLowerCase().includes(query) ||
    art.author_name_fa.toLowerCase().includes(query)
  );

  const matchedAudios = db.audios.filter((aud) =>
    aud.title_fa.toLowerCase().includes(query) ||
    aud.speaker_fa.toLowerCase().includes(query) ||
    aud.description_fa.toLowerCase().includes(query)
  );

  const matchedVideos = db.videos.filter((vid) =>
    vid.title_fa.toLowerCase().includes(query) ||
    vid.speaker_fa.toLowerCase().includes(query) ||
    vid.description_fa.toLowerCase().includes(query)
  );

  const matchedMagazines = db.magazineIssues.filter((issue) =>
    issue.title_fa.toLowerCase().includes(query) ||
    issue.description_fa.toLowerCase().includes(query) ||
    (issue.table_of_contents_fa && issue.table_of_contents_fa.some((toc: string) => toc.toLowerCase().includes(query)))
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
}
