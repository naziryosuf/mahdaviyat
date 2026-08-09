import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDB();
  const article = db.articles.find((a) => a.id === id);

  if (!article) {
    return NextResponse.json({ success: false, message: 'مقاله پیدا نشد' }, { status: 404 });
  }

  // Increment views count in backend DB
  article.views = (article.views || 0) + 1;
  writeDB(db);

  return NextResponse.json({ success: true, data: article });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDB();
    const index = db.articles.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'مقاله یافت نشد' }, { status: 404 });
    }

    db.articles[index] = {
      ...db.articles[index],
      ...body,
      updated_at: new Date().toLocaleDateString('fa-IR'),
    };

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'مقاله بهروزرسانی شد',
      data: db.articles[index],
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ویرایش' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDB();
  const initialCount = db.articles.length;
  db.articles = db.articles.filter((a) => a.id !== id);

  if (db.articles.length === initialCount) {
    return NextResponse.json({ success: false, message: 'مقاله پیدا نشد' }, { status: 404 });
  }

  writeDB(db);

  return NextResponse.json({
    success: true,
    message: 'مقاله با موفقیت حذف گردید',
  });
}
