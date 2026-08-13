import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initialArticles } from '@/data/initialData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  try {
    const { data: supaArticles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    let results = supaArticles && supaArticles.length > 0 ? supaArticles : initialArticles;

    if (category && category !== 'همه') {
      results = results.filter((art: any) => art.category_fa === category);
    }

    if (q) {
      results = results.filter((art: any) => 
        art.title_fa?.toLowerCase().includes(q) ||
        art.excerpt_fa?.toLowerCase().includes(q) ||
        art.content_fa?.toLowerCase().includes(q) ||
        art.author_name_fa?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      count: initialArticles.length,
      data: initialArticles,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newArticle = {
      id: body.id || `art-${Date.now()}`,
      title_fa: body.title_fa || 'مقاله جدید',
      excerpt_fa: body.excerpt_fa || '',
      content_fa: body.content_fa || '',
      author_name_fa: body.author_name_fa || 'نویسنده داوطلب',
      author_avatar: body.author_avatar || '',
      category_fa: body.category_fa || 'مقالات',
      read_time_fa: body.read_time_fa || '۵ دقیقه',
      published_at: body.published_at || new Date().toLocaleDateString('fa-IR'),
      views: body.views || 1,
      status: body.status || 'published',
    };

    const { data, error } = await supabase.from('articles').upsert(newArticle).select().single();

    return NextResponse.json({
      success: true,
      message: 'مقاله با موفقیت در دیتابیس آنلاین ثبت شد',
      data: data || newArticle,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت مقاله در دیتابیس',
    }, { status: 500 });
  }
}
