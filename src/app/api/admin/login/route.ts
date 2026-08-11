import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (passcode === '190716') {
      return NextResponse.json({
        success: true,
        message: 'ورود موفقیت‌آمیز مدیر',
        token: `admin-token-${Date.now()}`,
        role: 'SUPER_ADMIN',
      });
    }

    return NextResponse.json({
      success: false,
      message: 'رمز عبور مدیریت اشتباه می‌باشد',
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'خطا در احراز هویت',
    }, { status: 500 });
  }
}
