import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMagazines() {
  const { data, error } = await supabase.from('magazine_issues').select('*');
  if (error) {
    console.error('Error fetching magazine_issues:', error);
    return;
  }
  console.log('--- LIVE MAGAZINE ISSUES ROWS ---');
  data.forEach((row, i) => {
    console.log(`\nRow ${i+1}: ID=${row.id}, Issue #${row.issue_number}`);
    console.log('Title:', row.title_fa);
    console.log('Author Name:', row.author_name_fa);
    console.log('Author Title:', row.author_title_fa);
    console.log('Page Count:', row.page_count_fa);
    console.log('Cover Position:', row.cover_position);
    console.log('PDF URL:', row.pdf_url);
  });
}

checkMagazines();
