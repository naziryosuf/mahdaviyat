import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runDeepDiagnostic() {
  console.log('====================================================');
  console.log('🔍 IN-DEPTH DIAGNOSTIC REPORT FOR MAGAZINE & SAVE SYSTEM');
  console.log('====================================================\n');

  // 1. Query magazine_issues table
  console.log('1️⃣ QUERYING SUPABASE DATABASE TABLE "magazine_issues":');
  const { data: mags, error: magErr } = await supabase
    .from('magazine_issues')
    .select('*')
    .order('issue_number', { ascending: true });

  if (magErr) {
    console.error('❌ Database query error:', magErr);
    return;
  }

  console.log(`Found ${mags.length} records in live database:\n`);

  for (const m of mags) {
    console.log(`----------------------------------------------------`);
    console.log(`📌 ID: ${m.id}`);
    console.log(`📌 Issue Number: #${m.issue_number}`);
    console.log(`📌 Title: ${m.title_fa}`);
    console.log(`📌 Cover Image URL: ${m.cover_image}`);
    console.log(`📌 PDF URL: ${m.pdf_url}`);
    console.log(`📌 Author: ${m.author_name_fa || 'N/A'}`);
    console.log(`📌 Page Count: ${m.page_count_fa || 'N/A'}`);

    // Test PDF URL accessibility via HTTP HEAD request
    if (m.pdf_url && m.pdf_url.startsWith('http')) {
      try {
        const res = await fetch(m.pdf_url, { method: 'HEAD' });
        console.log(`🌐 HTTP HEAD Status for PDF URL: ${res.status} ${res.statusText}`);
        console.log(`🌐 Content-Type Header: ${res.headers.get('content-type')}`);
        console.log(`🌐 Content-Disposition Header: ${res.headers.get('content-disposition')}`);
      } catch (err) {
        console.error(`❌ HTTP fetch error for PDF URL:`, err.message);
      }
    } else {
      console.log(`ℹ️ PDF URL is relative path: ${m.pdf_url}`);
    }
  }

  // 2. Query Storage Bucket 'magazines'
  console.log('\n2️⃣ QUERYING SUPABASE STORAGE BUCKET "magazines":');
  const { data: pdfFiles, error: bucketErr } = await supabase.storage
    .from('magazines')
    .list('pdfs');

  if (bucketErr) {
    console.error('❌ Storage bucket list error:', bucketErr);
  } else {
    console.log(`Found ${pdfFiles?.length || 0} files in 'pdfs/' folder:`);
    pdfFiles?.forEach(f => console.log(`  - ${f.name} (${(f.metadata?.size / 1024).toFixed(1)} KB)`));
  }

  console.log('\n====================================================');
  console.log('✅ DIAGNOSTIC SCRIPT EXECUTION COMPLETED');
  console.log('====================================================');
}

runDeepDiagnostic();
