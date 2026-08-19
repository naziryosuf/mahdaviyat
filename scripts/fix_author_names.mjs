import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAuthorNames() {
  console.log('✏️ Restoring author names for all live magazine issues in Supabase...');

  const updates = [
    { issue_number: 1, author_name_fa: 'نذیر یوسف', author_title_fa: 'سردبیر ارشد / نویسنده' },
    { issue_number: 2, author_name_fa: 'نذیر یوسف', author_title_fa: 'سردبیر ارشد / نویسنده' },
    { issue_number: 3, author_name_fa: 'نذیر یوسف', author_title_fa: 'سردبیر ارشد / نویسنده' },
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from('magazine_issues')
      .update({
        author_name_fa: item.author_name_fa,
        author_title_fa: item.author_title_fa
      })
      .eq('issue_number', item.issue_number)
      .select();

    if (error) {
      console.error(`❌ Error updating Issue #${item.issue_number}:`, error);
    } else {
      console.log(`✅ Issue #${item.issue_number} updated successfully: Author = ${item.author_name_fa} (${item.author_title_fa})`);
    }
  }
}

fixAuthorNames();
