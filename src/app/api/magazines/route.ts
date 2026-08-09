import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return NextResponse.json({
    success: true,
    count: db.magazineIssues.length,
    data: db.magazineIssues,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDB();

    const newIssue = {
      id: `issue-${Date.now()}`,
      issue_number: body.issue_number || db.magazineIssues.length + 1,
      title_fa: body.title_fa || 'شماره جدید مجله',
      description_fa: body.description_fa || '',
      publish_date: body.publish_date || new Date().toLocaleDateString('fa-IR'),
      cover_image: body.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      pdf_url: body.pdf_url || '/downloads/mahdism_issue_1.pdf',
      page_count: body.page_count || 45,
      download_count: 0,
      table_of_contents_fa: body.table_of_contents_fa || [],
    };

    db.magazineIssues.unshift(newIssue);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'شماره جدید مجله ثبت شد',
      data: newIssue,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ثبت شماره مجله' }, { status: 500 });
  }
}
