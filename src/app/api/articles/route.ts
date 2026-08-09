import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  const db = readDB();
  let results = db.articles;

  if (category && category !== 'همه') {
    results = results.filter((art) => art.category_fa === category);
  }

  if (q) {
    results = results.filter((art) => 
      art.title_fa.toLowerCase().includes(q) ||
      art.excerpt_fa.toLowerCase().includes(q) ||
      art.content_fa.toLowerCase().includes(q) ||
      art.author_name_fa.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDB();

    const newArticle = {
      id: `art-${Date.now()}`,
      title_fa: body.title_fa || 'مقاله جدید',
      excerpt_fa: body.excerpt_fa || '',
      content_fa: body.content_fa || '',
      author_name_fa: body.author_name_fa || 'نویسنده داوطلب',
      author_avatar: body.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      category_fa: body.category_fa || 'مقالات',
      read_time_fa: body.read_time_fa || '۵ دقیقه',
      published_at: new Date().toLocaleDateString('fa-IR'),
      views: 1,
      bookmarked: false,
    };

    db.articles.unshift(newArticle);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'مقاله با موفقیت ذخیره گردید',
      data: newArticle,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت مقاله',
    }, { status: 500 });
  }
}
