import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMagazinePipeline() {
  console.log('🧪 AUDITING MAGGZINE UPSERT PIPELINE AGAINST SUPABASE CLOUD...');

  // 1. Inspect table columns in live database
  const { data: sampleRow, error: selectErr } = await supabase
    .from('magazine_issues')
    .select('*')
    .limit(1);

  if (selectErr) {
    console.error('❌ SELECT Error:', selectErr);
    return;
  }

  console.log('Sample row from DB:', sampleRow);

  // 2. Try upserting full object sent by frontend
  const testIssue = {
    id: `mag-test-${Date.now()}`,
    issue_number: 99,
    title_fa: 'تست سیستم شماره ۹۹',
    description_fa: 'توضیحات شماره تست',
    publish_date_fa: 'مرداد ۱۴۰۴',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    cover_position: 'center',
    pdf_url: '/downloads/mahdism_issue_1.pdf',
    author_name_fa: 'M. Nazir Yosufi',
    author_title_fa: 'سردبیر ارشد',
    download_count: 0,
    status: 'published',
    submitted_by_name: 'M. Nazir Yosufi',
    submitted_at: '۱۴۰۴/۰۵/۲۲',
    submitted_device: 'Test Device',
    tags: ['#تست', '#مهدویت'],
    pages: [],
    featured: true
  };

  console.log('\nTesting full frontend payload upsert...');
  const { data: upsertData, error: upsertErr } = await supabase
    .from('magazine_issues')
    .upsert(testIssue)
    .select();

  if (upsertErr) {
    console.error('❌ UPSERT FAILED WITH ERROR:', upsertErr.message, 'Code:', upsertErr.code, 'Details:', upsertErr.details);
  } else {
    console.log('✅ UPSERT PASSED CLEANLY! Row inserted:', upsertData);

    // Clean up test row
    await supabase.from('magazine_issues').delete().eq('id', testIssue.id);
  }
}

testMagazinePipeline();
