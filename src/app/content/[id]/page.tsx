import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { initialArticles } from '@/data/initialData';
import { ArticleDetailClient } from './ArticleDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  try {
    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (article) return article;

    // Try slug if not found by id
    const { data: articleBySlug } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', id)
      .single();

    if (articleBySlug) return articleBySlug;
  } catch (e) {
    // ignore
  }

  return initialArticles.find((a) => a.id === id || a.slug === id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'مقاله پیدا نشد',
      description: 'مقاله مورد نظر در مجله ایدئولوژی مهدویت یافت نشد.',
    };
  }

  const title = article.title_fa || 'مقاله تحلیلی';
  const description = article.excerpt_fa || article.content_fa?.slice(0, 160) || 'مجله مستقل فکری-شناختی ایدئولوژی مهدویت';
  const imageUrl = article.image_url && article.image_url.trim() !== '' 
    ? article.image_url 
    : 'https://www.ideologymahdaviyat.org/kaaba_unity_logo.jpg';
  const pageUrl = `https://www.ideologymahdaviyat.org/content/${id}`;
  const author = article.author_name_fa || 'تحریریه مجله مهدویت';

  return {
    title: title,
    description: description,
    authors: [{ name: author }],
    openGraph: {
      title: title,
      description: description,
      url: pageUrl,
      siteName: 'مجله مستقل فکری-شناختی ایدئولوژی مهدویت',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fa_AF',
      type: 'article',
      publishedTime: article.created_at || article.published_at,
      authors: [author],
      tags: article.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  return <ArticleDetailClient id={id} initialArticle={article} />;
}
