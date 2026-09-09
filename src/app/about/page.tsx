import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { initialTeamMembers } from '@/data/initialData';
import { AboutPageClient } from './AboutPageClient';

interface PageProps {
  searchParams: Promise<{
    member?: string;
    id?: string;
    author?: string;
  }>;
}

async function getTeamMember(query?: string) {
  if (!query) return null;
  const clean = query.trim();
  try {
    // 1. Check by ID first (clean short URL)
    const { data: byId } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', clean)
      .single();
    if (byId) return byId;

    // 2. Check by name_fa
    const { data: byName } = await supabase
      .from('team_members')
      .select('*')
      .ilike('name_fa', `%${clean}%`)
      .limit(1);
    if (byName && byName.length > 0) return byName[0];
  } catch (e) {
    // ignore
  }

  // Fallback
  return (
    initialTeamMembers.find(
      (m) => m.id === clean || m.name_fa.includes(clean) || clean.includes(m.name_fa)
    ) || null
  );
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const memberQuery = params.member || params.id || params.author;
  const member = await getTeamMember(memberQuery);

  if (member) {
    const title = `${member.name_fa} (${member.role_fa}) | مجله ایدئولوژی مهدویت`;
    const cleanBio = member.bio_fa
      ? member.bio_fa.replace(/[\r\n]+/g, ' ').slice(0, 160).trim() + '...'
      : `پروفایل و آثار علمی، تحلیلی ${member.name_fa} (${member.role_fa}) در مجله ایدئولوژی مهدویت.`;
    const avatarUrl = member.avatar_url && member.avatar_url.trim() !== ''
      ? member.avatar_url.trim()
      : 'https://www.ideologymahdaviyat.org/official_logo.jpg';
    const pageUrl = `https://www.ideologymahdaviyat.org/about?member=${encodeURIComponent(member.id)}`;

    return {
      title,
      description: cleanBio,
      openGraph: {
        title,
        description: cleanBio,
        url: pageUrl,
        siteName: 'ایدئولوژی مهدویت',
        images: [
          {
            url: avatarUrl,
            secureUrl: avatarUrl,
            width: 800,
            height: 800,
            alt: member.name_fa,
          },
        ],
        locale: 'fa_AF',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: cleanBio,
        images: [avatarUrl],
      },
    };
  }

  const defaultTitle = 'درباره ما و اعضای هیئت تحریریه | مجله ایدئولوژی مهدویت';
  const defaultDesc = 'معرفی رسالت، اهداف فکری، چشم‌انداز و اعضای هیئت تحریریه و نویسندگان مجله مستقل ایدئولوژی مهدویت.';
  const defaultLogo = 'https://www.ideologymahdaviyat.org/official_logo.jpg';

  return {
    title: 'درباره ما و اعضای هیئت تحریریه',
    description: defaultDesc,
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: 'https://www.ideologymahdaviyat.org/about',
      siteName: 'ایدئولوژی مهدویت',
      images: [
        {
          url: defaultLogo,
          secureUrl: defaultLogo,
          width: 800,
          height: 800,
          alt: 'درباره مجله ایدئولوژی مهدویت',
        },
      ],
      locale: 'fa_AF',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDesc,
      images: [defaultLogo],
    },
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
