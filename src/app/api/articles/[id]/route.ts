import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initialArticles } from '@/data/initialData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
    const result = article || initialArticles.find((a) => a.id === id);

    if (!result) {
      return NextResponse.json({ success: false, message: 'مقاله پیدا نشد' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch {
    const fallback = initialArticles.find((a) => a.id === id);
    if (!fallback) {
      return NextResponse.json({ success: false, message: 'مقاله پیدا نشد' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: fallback });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedData = {
      id,
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data } = await supabase
      .from('articles')
      .upsert(updatedData)
      .select()
      .single();

    return NextResponse.json({
      success: true,
      message: 'مقاله به‌روزرسانی شد',
      data: data || updatedData,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ویرایش مقاله' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await supabase.from('articles').delete().eq('id', id);

    return NextResponse.json({
      success: true,
      message: 'مقاله با موفقیت حذف گردید',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'خطا در حذف مقاله' }, { status: 500 });
  }
}
