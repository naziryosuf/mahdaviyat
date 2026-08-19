import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abimnaqtmcgoslealmoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_R841oHp8JM_GVCddiKBSpQ_8KjLrnRo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addColumn() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE magazine_issues ADD COLUMN IF NOT EXISTS page_count_fa TEXT;'
  });
  console.log('RPC result:', { data, error });
}

addColumn();
