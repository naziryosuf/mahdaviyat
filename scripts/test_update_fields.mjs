import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  const { data, error } = await supabase.from('magazine_issues').update({
    author_name_fa: 'نذیر یوسف',
    author_title_fa: 'سردبیر ارشد / پژوهشگر',
    page_count_fa: '۳۸ صفحه (قطع A4)'
  }).eq('issue_number', 2).select();

  console.log('Update result for issue #2:', { data, error });
}

testUpdate();
