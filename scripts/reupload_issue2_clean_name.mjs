import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function reuploadIssue2CleanName() {
  console.log('⚡ RE-UPLOADING ISSUE #2 PDF WITH CLEAN ASCII ENGLISH FILENAME...');

  const localFilePath = 'C:\\Users\\0731g\\Downloads\\Telegram Desktop\\ایدئولوژی_مهدویت،_شماره_دوم،_خزان_1404_خورشیدی.pdf';

  if (!fs.existsSync(localFilePath)) {
    console.error('❌ Local file not found:', localFilePath);
    return;
  }

  const fileBuffer = fs.readFileSync(localFilePath);
  // CLEAN ASCII FILENAME: mahdaviyat_issue_2.pdf
  const cleanFileName = `pdfs/mahdaviyat_issue_2_${Date.now()}.pdf`;

  console.log('⬆️ Uploading to Supabase Storage as:', cleanFileName);
  const { data: uploadRes, error: uploadErr } = await supabase.storage
    .from('magazines')
    .upload(cleanFileName, fileBuffer, {
      contentType: 'application/pdf',
      cacheControl: '3600',
      upsert: true
    });

  if (uploadErr) {
    console.error('❌ Upload error:', uploadErr);
    return;
  }

  const { data: publicUrlObj } = supabase.storage
    .from('magazines')
    .getPublicUrl(cleanFileName);

  const cleanPublicUrl = publicUrlObj.publicUrl;
  console.log('🌐 Permanent Clean Public HTTPS URL:', cleanPublicUrl);

  // Update Issue #2 in live database
  const { data: mags } = await supabase.from('magazine_issues').select('*');
  const issue2 = mags?.find(m => m.issue_number === 2);

  if (issue2) {
    const { error: updateErr } = await supabase
      .from('magazine_issues')
      .update({ pdf_url: cleanPublicUrl })
      .eq('id', issue2.id);

    if (updateErr) {
      console.error('❌ DB update error:', updateErr);
    } else {
      console.log('🎉 Successfully updated Issue #2 in DB with clean English URL!');
    }
  } else {
    console.error('❌ Issue #2 not found in DB.');
  }
}

reuploadIssue2CleanName();
