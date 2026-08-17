import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadRealIssue2Pdf() {
  console.log('🚀 UPLOADING REAL ISSUE #2 PDF FILE TO SUPABASE STORAGE...');

  const localFilePath = 'C:\\Users\\0731g\\Downloads\\Telegram Desktop\\ایدئولوژی_مهدویت،_شماره_دوم،_خزان_1404_خورشیدی.pdf';

  if (!fs.existsSync(localFilePath)) {
    console.error('❌ Local PDF file not found at:', localFilePath);
    return;
  }

  const fileStats = fs.statSync(localFilePath);
  console.log(`📁 File size: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB`);

  const fileBuffer = fs.readFileSync(localFilePath);
  const fileName = `pdfs/issue2_${Date.now()}_mahdaviyat.pdf`;

  console.log('⬆️ Uploading to Supabase Storage bucket "magazines"...');
  const { data: uploadRes, error: uploadErr } = await supabase.storage
    .from('magazines')
    .upload(fileName, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadErr) {
    console.error('❌ Storage upload failed:', uploadErr);
    return;
  }

  console.log('✅ Storage upload success:', uploadRes);

  const { data: publicUrlObj } = supabase.storage
    .from('magazines')
    .getPublicUrl(fileName);

  const publicUrl = publicUrlObj.publicUrl;
  console.log('🌐 Permanent Public HTTPS URL:', publicUrl);

  // Update Issue #2 in live database
  const { data: mags } = await supabase.from('magazine_issues').select('*').order('issue_number', { ascending: false });
  console.log('Live magazine issues count:', mags?.length);

  let targetIssueId = mags?.[0]?.id; // Most recent issue or issue #2
  const issue2Row = mags?.find(m => m.issue_number === 2);
  if (issue2Row) {
    targetIssueId = issue2Row.id;
  }

  if (targetIssueId) {
    const { error: updateErr } = await supabase
      .from('magazine_issues')
      .update({ pdf_url: publicUrl })
      .eq('id', targetIssueId);

    if (updateErr) {
      console.error('❌ DB update error:', updateErr);
    } else {
      console.log(`🎉 Successfully updated Issue #2 (ID: ${targetIssueId}) with real PDF HTTPS URL!`);
    }
  } else {
    console.error('❌ Could not find Issue #2 in database.');
  }
}

uploadRealIssue2Pdf();
