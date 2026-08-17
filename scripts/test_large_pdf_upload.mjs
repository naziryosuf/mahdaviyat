import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLargePdfUploadAndUpsert() {
  console.log('====================================================');
  console.log('🧪 TESTING LARGE PDF UPLOAD & SINGLE-ROW UPSERT');
  console.log('====================================================\n');

  // Generate 10.5 MB dummy binary PDF buffer
  const sizeInMB = 10.5;
  const bufferSize = Math.floor(sizeInMB * 1024 * 1024);
  console.log(`📦 Generating dummy PDF buffer of ${sizeInMB} MB (${bufferSize} bytes)...`);
  
  const dummyBuffer = Buffer.alloc(bufferSize, 0x20); // space padding
  // Write minimal PDF header
  dummyBuffer.write('%PDF-1.4\n%âãÏÓ\n', 0);
  dummyBuffer.write('\n%%EOF\n', bufferSize - 10);

  const cleanFileName = `issue_test_10mb_${Date.now()}.pdf`;
  const filePath = `pdfs/${cleanFileName}`;

  console.log(`🚀 Uploading ${cleanFileName} directly to Supabase Storage 'magazines' bucket...`);
  const startTime = Date.now();

  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('magazines')
    .upload(filePath, dummyBuffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'application/pdf'
    });

  const uploadDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (uploadErr) {
    console.error(`❌ Upload failed in ${uploadDuration}s:`, uploadErr);
    return;
  }

  console.log(`✅ Upload successful in ${uploadDuration} seconds! File path: ${uploadData.path}`);

  // Get Public HTTPS URL
  const { data: publicUrlData } = supabase.storage
    .from('magazines')
    .getPublicUrl(filePath);

  const pdfPublicUrl = publicUrlData.publicUrl;
  console.log(`🌐 Public URL: ${pdfPublicUrl}`);

  // Isolated Single-Row Upsert Test
  console.log('\n📝 Testing isolated single-row upsert into "magazine_issues" table...');
  const testIssue = {
    id: `mag-test-${Date.now()}`,
    issue_number: 999,
    title_fa: 'تست آپلود فایل ۱۰ مگابایتی PDF',
    description_fa: 'تست شبیه‌سازی آپلود مستقیم و ثبت در دیتابیس',
    publish_date_fa: 'مرداد ۱۴۰۴',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    cover_position: 'center',
    pdf_url: pdfPublicUrl,
    download_count: 1,
    featured: false,
    status: 'published',
    tags: ['#تست', '#آپلود_سریع']
  };

  const { data: upsertData, error: upsertErr } = await supabase
    .from('magazine_issues')
    .upsert([testIssue])
    .select();

  if (upsertErr) {
    console.error('❌ Isolated upsert error:', upsertErr);
    return;
  }

  console.log('✅ Isolated single-row upsert SUCCESSFUL! Inserted record ID:', upsertData[0]?.id);

  // Cleanup test record from DB and Storage
  console.log('\n🧹 Cleaning up test record...');
  await supabase.from('magazine_issues').delete().eq('id', testIssue.id);
  await supabase.storage.from('magazines').remove([filePath]);
  console.log('✅ Cleanup completed cleanly.');

  console.log('\n====================================================');
  console.log('🎉 DIRECT UPLOAD & SINGLE-ROW UPSERT TEST PASSED 100%!');
  console.log('====================================================');
}

testLargePdfUploadAndUpsert();
