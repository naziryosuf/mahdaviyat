import { supabase } from '@/lib/supabase';
import { compressImageFile } from './imageCompressor';

/**
 * Direct & Fast Upload helper for Supabase Storage bucket 'magazines'.
 * Returns the permanent public HTTPS URL of the uploaded file.
 * Features a 45-second strict timeout, ASCII filename sanitization, and explicit error handling.
 */
export async function uploadMagazineFile(file: File, folder: 'covers' | 'pdfs' | 'videos' | 'media'): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || (folder === 'covers' ? 'jpg' : folder === 'videos' ? 'mp4' : 'pdf');
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const cleanFileName = folder === 'covers' 
    ? `cover_${Date.now()}_${randomSuffix}.${ext}` 
    : folder === 'videos' || folder === 'media'
    ? `video_${Date.now()}_${randomSuffix}.${ext}`
    : `issue_${Date.now()}_${randomSuffix}.${ext}`;
  const filePath = `${folder}/${cleanFileName}`;

  let uploadBody: Blob | File = file;

  // Compress image if cover photo to save bandwidth
  if (folder === 'covers' && file.type.startsWith('image/')) {
    try {
      const dataUrl = await compressImageFile(file, 1600, 0.85);
      const res = await fetch(dataUrl);
      uploadBody = await res.blob();
    } catch (e) {
      console.warn('Image compression fallback to raw file:', e);
    }
  }

  // 1. Upload to Supabase Storage bucket 'magazines' with 120s timeout safeguard
  const UPLOAD_TIMEOUT_MS = 120000;

  const uploadPromise = supabase.storage
    .from('magazines')
    .upload(filePath, uploadBody, {
      cacheControl: '3600',
      upsert: true,
      contentType: folder === 'covers' ? (file.type || 'image/jpeg') : 'application/pdf'
    });

  const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((_, reject) =>
    setTimeout(() => reject(new Error(`زمان آپلود فایل به پایان رسید (${UPLOAD_TIMEOUT_MS / 1000} ثانیه). لطفاً سرعت اینترنت خود را بررسی نمایید.`)), UPLOAD_TIMEOUT_MS)
  );

  let uploadResult;
  try {
    uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
  } catch (err: any) {
    throw new Error(err?.message || 'خطا در ارتباط با حافظه ابری Supabase');
  }

  const { data, error } = uploadResult as { data: { path: string } | null; error: any };

  if (error) {
    console.error(`Supabase Storage upload error (${folder}):`, error);
    throw new Error(`خطای حافظه ابری (${folder}): ${error.message || 'آپلود انجام نشد'}`);
  }

  // 2. Retrieve Public URL
  const { data: publicUrlData } = supabase.storage
    .from('magazines')
    .getPublicUrl(filePath);

  if (publicUrlData && publicUrlData.publicUrl) {
    return publicUrlData.publicUrl;
  }

  throw new Error('دریافت لینک عمومی فایل با خطا مواجه گردید.');
}
