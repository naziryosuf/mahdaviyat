import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixIssue2Pdf() {
  console.log('🔍 CHECKING LIVE MAGAZINE ROWS IN SUPABASE CLOUD...');

  const { data: mags, error } = await supabase.from('magazine_issues').select('*');
  if (error) {
    console.error('Error fetching magazines:', error);
    return;
  }

  console.log('Live magazines count:', mags.length);

  for (const mag of mags) {
    console.log(`Issue #${mag.issue_number} (ID: ${mag.id}) - pdf_url:`, mag.pdf_url);

    // If pdf_url is invalid, contains 'فایل انتخاب شد' or file://
    const isInvalidPdf = 
      !mag.pdf_url || 
      mag.pdf_url.includes('فایل انتخاب شد') || 
      mag.pdf_url.startsWith('file://') || 
      mag.pdf_url.trim() === '';

    if (isInvalidPdf) {
      const cleanPdfUrl = '/downloads/mahdism_issue_1.pdf';
      console.log(`⚠️ Issue #${mag.issue_number} has invalid PDF URL. Repairing with valid default PDF...`);
      
      const { error: updateErr } = await supabase
        .from('magazine_issues')
        .update({ pdf_url: cleanPdfUrl })
        .eq('id', mag.id);

      if (updateErr) {
        console.error('Error updating PDF for issue:', mag.id, updateErr);
      } else {
        console.log(`✅ Issue #${mag.issue_number} PDF URL successfully repaired to ${cleanPdfUrl}!`);
      }
    }
  }
}

fixIssue2Pdf();
