import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { initialMagazineIssues } from '@/data/initialData';
import { MagazineCatalogClient } from './MagazineCatalogClient';

interface PageProps {
  searchParams: Promise<{ issue?: string; read?: string }>;
}

async function getMagazineIssue(issueQuery?: string) {
  try {
    if (issueQuery) {
      // Try by id first
      const { data: issueById } = await supabase
        .from('magazine_issues')
        .select('*')
        .eq('id', issueQuery)
        .single();

      if (issueById) return issueById;

      // Try by issue_number if numeric
      const num = parseInt(issueQuery, 10);
      if (!isNaN(num)) {
        const { data: issueByNum } = await supabase
          .from('magazine_issues')
          .select('*')
          .eq('issue_number', num)
          .single();

        if (issueByNum) return issueByNum;
      }
    }

    // Default to latest published issue
    const { data: latest } = await supabase
      .from('magazine_issues')
      .select('*')
      .order('issue_number', { ascending: false })
      .limit(1)
      .single();

    if (latest) return latest;
  } catch (e) {
    // ignore
  }

  if (issueQuery) {
    const found = initialMagazineIssues.find(i => i.id === issueQuery || String(i.issue_number) === issueQuery);
    if (found) return found;
  }
  return initialMagazineIssues[0] || null;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { issue: issueQuery } = await searchParams;
  const issue = await getMagazineIssue(issueQuery);

  if (!issue) {
    return {
      title: 'آرشیو مجله دیجیتالی',
      description: 'مطالعه آنلاین و دانلود رایگان شماره‌های رسمی مجله علمی، تحلیلی و شناختی ایدئولوژی مهدویت با کیفیت بالا.',
    };
  }

  const title = issue.title_fa || 'مجله دیجیتالی ایدئولوژی مهدویت';
  const description = issue.description_fa || 'مطالعه آنلاین و دانلود نسخه رسمی مجله ایدئولوژی مهدویت.';
  const imageUrl = issue.cover_image && issue.cover_image.trim() !== ''
    ? issue.cover_image
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80';
  const pageUrl = issueQuery 
    ? `https://www.ideologymahdaviyat.org/magazine?issue=${encodeURIComponent(issueQuery)}`
    : 'https://www.ideologymahdaviyat.org/magazine';

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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function MagazinePage() {
  return <MagazineCatalogClient />;
}
