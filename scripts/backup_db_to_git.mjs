import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function backupLiveDatabase() {
  console.log('📦 Fetching live database tables from Supabase Cloud...');
  
  try {
    const [
      { data: articles },
      { data: magazineIssues },
      { data: videos },
      { data: audios },
      { data: teamMembers },
      { data: coHosts },
      { data: siteSettings },
      { data: auditLogs },
      { data: contactMessages }
    ] = await Promise.all([
      supabase.from('articles').select('*'),
      supabase.from('magazine_issues').select('*'),
      supabase.from('video_items').select('*'),
      supabase.from('audio_items').select('*'),
      supabase.from('team_members').select('*'),
      supabase.from('co_hosts').select('*'),
      supabase.from('site_settings').select('*'),
      supabase.from('audit_logs').select('*'),
      supabase.from('contact_messages').select('*')
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      articles: articles || [],
      magazineIssues: magazineIssues || [],
      videos: videos || [],
      audios: audios || [],
      teamMembers: teamMembers || [],
      coHosts: coHosts || [],
      siteSettings: siteSettings || [],
      auditLogs: auditLogs || [],
      contactMessages: contactMessages || []
    };

    const targetDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const backupFilePath = path.join(targetDir, 'db_backup.json');
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf-8');
    
    console.log(`✅ Backup successfully saved to ${backupFilePath}`);
    console.log('💡 Now run: git add . && git commit -m "chore: database backup" && git push');
  } catch (e) {
    console.error('❌ Backup error:', e);
  }
}

backupLiveDatabase();
