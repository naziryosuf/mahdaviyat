import { NextResponse } from 'next/server';
import { readDB, writeDB, ContactMessage } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return NextResponse.json({
    success: true,
    count: db.messages.length,
    data: db.messages,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.sender_name || !body.sender_email || !body.message_text) {
      return NextResponse.json({
        success: false,
        message: 'لطفاً تمامی فیلدهای ضروری (نام، ایمیل و متن پیام) را تکمیل نمایید',
      }, { status: 400 });
    }

    const db = readDB();
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      sender_name: body.sender_name,
      sender_email: body.sender_email,
      sender_phone: body.sender_phone || '',
      subject: body.subject || 'پیام عمومی یا مقاله',
      message_text: body.message_text,
      sent_at: new Date().toLocaleString('fa-IR'),
      status: 'unread',
    };

    db.messages.unshift(newMessage);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'پیام شما با موفقیت در سامانه مجله ایدئولوژی مهدویت به ثبت رسید',
      data: newMessage,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت پیام در سرور',
    }, { status: 500 });
  }
}
