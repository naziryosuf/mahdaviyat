import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updatePageCount() {
  console.log('Updating Issue #2 with page count "۶۴ صفحه (قطع A4)"...');

  const { data, error } = await supabase
    .from('magazine_issues')
    .update({
      submitted_device: 'PAGECOUNT:۶۴ صفحه (قطع A4)'
    })
    .eq('issue_number', 2)
    .select();

  if (error) {
    console.error('Error updating Issue #2:', error);
  } else {
    console.log('✅ Issue #2 page count metadata successfully updated in Supabase!');
  }
}

updatePageCount();
