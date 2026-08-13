import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { initialMagazineIssues } from '@/data/initialData';

export async function GET() {
  try {
    const { data: supaMagazines } = await supabase
      .from('magazine_issues')
      .select('*')
      .order('issue_number', { ascending: true });

    const results = supaMagazines && supaMagazines.length > 0 ? supaMagazines : initialMagazineIssues;

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch {
    return NextResponse.json({
      success: true,
      count: initialMagazineIssues.length,
      data: initialMagazineIssues,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newIssue = {
      id: body.id || `mag-${Date.now()}`,
      issue_number: body.issue_number || 1,
      title_fa: body.title_fa || 'شماره جدید مجله',
      description_fa: body.description_fa || '',
      publish_date_fa: body.publish_date_fa || new Date().toLocaleDateString('fa-IR'),
      cover_image: body.cover_image || '',
      pdf_url: body.pdf_url || '',
      download_count: body.download_count || 0,
      featured: body.featured || false,
    };

    const { data } = await supabase.from('magazine_issues').upsert(newIssue).select().single();

    return NextResponse.json({
      success: true,
      message: 'شماره جدید مجله در دیتابیس ثبت شد',
      data: data || newIssue,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ثبت شماره مجله' }, { status: 500 });
  }
}
