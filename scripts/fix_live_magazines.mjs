import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixLiveMagazines() {
  console.log('🔧 Updating live Supabase Cloud magazine_issues rows...');
  
  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const defaultPdf = '/downloads/mahdism_issue_1.pdf';

  // 1. Fetch current magazine issues
  const { data: mags, error } = await supabase.from('magazine_issues').select('*');
  if (error) {
    console.error('Error fetching magazines:', error);
    return;
  }

  console.log(`Found ${mags.length} magazine issues in database.`);

  for (const mag of mags) {
    const isCoverInvalid = !mag.cover_image || mag.cover_image.trim() === '' || mag.cover_image.length > 500000;
    const isPdfInvalid = !mag.pdf_url || mag.pdf_url.trim() === '';

    const cleanCover = isCoverInvalid ? defaultCover : mag.cover_image;
    const cleanPdf = isPdfInvalid ? defaultPdf : mag.pdf_url;
    const cleanTags = ['#شماره_نخست', '#ایدئولوژی_مهدویت'];

    const { error: updateErr } = await supabase
      .from('magazine_issues')
      .update({
        cover_image: cleanCover,
        pdf_url: cleanPdf,
        tags: cleanTags,
      })
      .eq('id', mag.id);

    if (updateErr) {
      console.error(`Error updating issue ${mag.id}:`, updateErr);
    } else {
      console.log(`✅ Issue ${mag.id} updated with clean cover & pdf & tags!`);
    }
  }

  // If table is empty, insert default issue 1
  if (mags.length === 0) {
    const defaultIssue = {
      id: 'issue-1',
      issue_number: 1,
      title_fa: 'شماره نخست: عقلانیت، معرفت و بیداری معنوی',
      description_fa: 'نخستین شماره رسمی مجله ایدئولوژی مهدویت متمرکز بر تبیین جهان‌بینی توحیدی و نقد ماتریالیسم.',
      publish_date_fa: 'مرداد ۱۴۰۴',
      cover_image: defaultCover,
      cover_position: 'center',
      pdf_url: defaultPdf,
      download_count: 1240,
      author_name_fa: 'M. Nazir Yosufi',
      author_title_fa: 'سردبیر ارشد',
      pages: [],
      featured: true,
      status: 'published',
      tags: ['#شماره_نخست', '#ایدئولوژی_مهدویت']
    };
    await supabase.from('magazine_issues').upsert(defaultIssue);
    console.log('✅ Default issue-1 inserted!');
  }
}

fixLiveMagazines();
