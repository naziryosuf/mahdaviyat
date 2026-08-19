import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkArticles() {
  const { data: articles, error } = await supabase.from('articles').select('*');
  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }
  console.log(`Found ${articles.length} articles in Supabase:`);
  for (const art of articles) {
    console.log(`📌 ID: ${art.id}`);
    console.log(`   Title: ${art.title_fa}`);
    console.log(`   Image URL: ${art.image_url}`);
  }
}

checkArticles();
