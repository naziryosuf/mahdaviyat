import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: messages } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      count: messages?.length || 0,
      data: messages || [],
    });
  } catch {
    return NextResponse.json({
      success: true,
      count: 0,
      data: [],
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.sender_name || (!body.sender_email && !body.email) || (!body.message_text && !body.message)) {
      return NextResponse.json({
        success: false,
        message: 'لطفاً تمامی فیلدهای ضروری (نام، ایمیل و متن پیام) را تکمیل نمایید',
      }, { status: 400 });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender_name: body.sender_name,
      sender_email: body.sender_email || body.email || '',
      sender_phone: body.sender_phone || '',
      subject: body.subject || 'پیام عمومی یا مقاله',
      message_text: body.message_text || body.message || '',
      sent_at: new Date().toLocaleString('fa-IR'),
      status: 'unread',
    };

    await supabase.from('contact_messages').upsert(newMessage);

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
