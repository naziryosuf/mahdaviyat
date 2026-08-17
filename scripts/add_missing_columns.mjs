import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndSanitizeDb() {
  console.log('🧹 SANITIZING LIVE SUPABASE DATABASE ROWS...');

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const defaultPdf = '/downloads/mahdism_issue_1.pdf';

  // Fetch all live rows
  const { data: mags, error } = await supabase.from('magazine_issues').select('*');
  if (error) {
    console.error('Error fetching magazines:', error);
    return;
  }

  for (const mag of mags) {
    const isCoverFileUri = !mag.cover_image || mag.cover_image.startsWith('file://') || mag.cover_image.trim() === '';
    const isPdfFileUri = !mag.pdf_url || mag.pdf_url.startsWith('file://') || mag.pdf_url.trim() === '';

    const newCover = isCoverFileUri ? defaultCover : mag.cover_image;
    const newPdf = isPdfFileUri ? defaultPdf : mag.pdf_url;

    const { error: updateErr } = await supabase
      .from('magazine_issues')
      .update({
        cover_image: newCover,
        pdf_url: newPdf,
        tags: ['#شماره_نخست', '#ایدئولوژی_مهدویت']
      })
      .eq('id', mag.id);

    if (updateErr) {
      console.error('Error sanitizing row:', mag.id, updateErr);
    } else {
      console.log(`✅ Sanitized row ${mag.id} - replaced file:// URI with valid HTTPS URL!`);
    }
  }
}

checkAndSanitizeDb();
