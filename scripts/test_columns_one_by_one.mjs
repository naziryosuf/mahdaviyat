import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testColumns() {
  const fields = ['author_name_fa', 'author_title_fa', 'page_count_fa', 'cover_position'];

  for (const field of fields) {
    const { data, error } = await supabase.from('magazine_issues').update({
      [field]: 'test'
    }).eq('issue_number', 1);

    if (error) {
      console.log(`❌ Field '${field}' ERROR:`, error.message);
    } else {
      console.log(`✅ Field '${field}' EXISTS in database table!`);
    }
  }
}

testColumns();
