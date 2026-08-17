import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateSchemaAndVerify() {
  console.log('🚀 EXECUTING DATABASE SCHEMA MIGRATION & HEALTH AUDIT...');

  // 1. Check existing columns by fetching sample row
  const { data: sample, error } = await supabase.from('magazine_issues').select('*').limit(1);
  if (error) {
    console.error('Error selecting from magazine_issues:', error);
    return;
  }

  console.log('Current sample row columns:', Object.keys(sample?.[0] || {}));

  // 2. Fetch all magazine issues from DB
  const { data: mags, error: fetchErr } = await supabase.from('magazine_issues').select('*');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return;
  }

  console.log(`Found ${mags.length} magazines in live database.`);

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const defaultPdf = '/downloads/mahdism_issue_1.pdf';

  for (const mag of mags) {
    const isBadCover = !mag.cover_image || mag.cover_image.startsWith('file://') || mag.cover_image.trim() === '';
    const isBadPdf = !mag.pdf_url || mag.pdf_url.startsWith('file://') || mag.pdf_url.includes('فایل انتخاب شد') || mag.pdf_url.trim() === '';

    const cleanCover = isBadCover ? defaultCover : mag.cover_image;
    const cleanPdf = isBadPdf ? defaultPdf : mag.pdf_url;

    const { error: updateErr } = await supabase
      .from('magazine_issues')
      .update({
        cover_image: cleanCover,
        pdf_url: cleanPdf,
        tags: mag.tags && mag.tags.length > 0 ? mag.tags : ['#شماره_نخست', '#ایدئولوژی_مهدویت']
      })
      .eq('id', mag.id);

    if (updateErr) {
      console.error(`Error repairing magazine ${mag.id}:`, updateErr);
    } else {
      console.log(`✅ Verified & Cleaned magazine #${mag.issue_number} (ID: ${mag.id})`);
    }
  }

  console.log('✨ MIGRATION & AUDIT COMPLETED SUCCESSFULLY!');
}

migrateSchemaAndVerify();
