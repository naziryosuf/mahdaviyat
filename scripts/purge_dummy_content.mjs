import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function purgeDummyContent() {
  console.log('🧹 PURGING DUMMY ARTICLES, VIDEOS, PODCASTS, TEAM MEMBERS FROM SUPABASE CLOUD...');

  // 1. Delete all dummy articles
  const { error: artErr } = await supabase.from('articles').delete().neq('id', 'keep_none_delete_all');
  if (artErr) console.error('Error purging articles:', artErr);
  else console.log('✅ Purged all dummy articles from Supabase DB.');

  // 2. Delete all dummy videos
  const { error: vidErr } = await supabase.from('video_items').delete().neq('id', 'keep_none_delete_all');
  if (vidErr) console.error('Error purging videos:', vidErr);
  else console.log('✅ Purged all dummy videos from Supabase DB.');

  // 3. Delete all dummy audios / podcasts
  const { error: audErr } = await supabase.from('audio_items').delete().neq('id', 'keep_none_delete_all');
  if (audErr) console.error('Error purging audios:', audErr);
  else console.log('✅ Purged all dummy audios from Supabase DB.');

  // 4. Delete all dummy team members
  const { error: teamErr } = await supabase.from('team_members').delete().neq('id', 'keep_none_delete_all');
  if (teamErr) console.error('Error purging team members:', teamErr);
  else console.log('✅ Purged all dummy team members from Supabase DB.');

  // 5. Audit live magazine issues
  const { data: mags } = await supabase.from('magazine_issues').select('*').order('issue_number', { ascending: true });
  console.log('📖 Live magazine count in DB:', mags?.length);
  mags?.forEach(m => console.log(`  - Issue #${m.issue_number}: ${m.title_fa} (PDF: ${m.pdf_url})`));
}

purgeDummyContent();
