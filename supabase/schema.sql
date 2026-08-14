-- ===================================================
-- DATABASE MIGRATION SCHEMA FOR IDEOLOGY OF MAHDISM
-- SUPABASE PROJECT: https://abimnaqtmcgoslealmoh.supabase.co
-- ===================================================

-- 1. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title_fa TEXT NOT NULL,
  slug TEXT,
  excerpt_fa TEXT,
  content_fa TEXT,
  category_fa TEXT,
  author_name_fa TEXT,
  author_title_fa TEXT,
  author_avatar TEXT,
  read_time_fa TEXT,
  published_at TEXT,
  image_url TEXT,
  image_position TEXT,
  audio_url TEXT,
  audio_speaker_fa TEXT,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  submitted_by_name TEXT,
  submitted_at TEXT,
  submitted_device TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MAGAZINE ISSUES TABLE
CREATE TABLE IF NOT EXISTS public.magazine_issues (
  id TEXT PRIMARY KEY,
  issue_number INT NOT NULL,
  title_fa TEXT NOT NULL,
  description_fa TEXT,
  publish_date_fa TEXT,
  cover_image TEXT,
  cover_position TEXT DEFAULT 'center',
  pdf_url TEXT,
  download_count INT DEFAULT 0,
  author_name_fa TEXT,
  author_title_fa TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  submitted_by_name TEXT,
  submitted_at TEXT,
  submitted_device TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  pages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VIDEO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.video_items (
  id TEXT PRIMARY KEY,
  title_fa TEXT NOT NULL,
  description_fa TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_fa TEXT,
  category_fa TEXT,
  speaker_fa TEXT,
  published_at TEXT,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  submitted_by_name TEXT,
  submitted_at TEXT,
  submitted_device TEXT,
  download_url TEXT,
  transcript_fa TEXT,
  timestamps JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.audio_items (
  id TEXT PRIMARY KEY,
  title_fa TEXT NOT NULL,
  speaker_fa TEXT,
  audio_url TEXT,
  duration_fa TEXT,
  description_fa TEXT,
  published_at TEXT,
  category_fa TEXT,
  cover_image TEXT,
  plays INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  submitted_by_name TEXT,
  submitted_at TEXT,
  submitted_device TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INFOGRAPHIC ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.infographic_items (
  id TEXT PRIMARY KEY,
  title_fa TEXT NOT NULL,
  description_fa TEXT,
  image_url TEXT,
  category_fa TEXT,
  published_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name_fa TEXT NOT NULL,
  role_fa TEXT,
  bio_fa TEXT,
  avatar_url TEXT,
  specialization_fa TEXT,
  status TEXT DEFAULT 'published',
  submitted_by_name TEXT,
  submitted_at TEXT,
  submitted_device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  email TEXT,
  sender_email TEXT,
  sender_phone TEXT,
  subject TEXT,
  message TEXT,
  message_text TEXT,
  file_url TEXT,
  created_at TEXT,
  sent_at TEXT,
  status TEXT DEFAULT 'unread'
);

-- 8. CO-HOSTS ACCESS CONTROL TABLE
CREATE TABLE IF NOT EXISTS public.co_hosts (
  id TEXT PRIMARY KEY,
  name_fa TEXT NOT NULL,
  password_code TEXT NOT NULL,
  role_fa TEXT,
  created_at TEXT,
  is_super_admin BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '{}'::jsonb
);

-- 9. SITE SETTINGS TABLE (Global designer link, mission, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  user_role TEXT,
  action_type TEXT,
  target_title TEXT,
  item_type TEXT,
  timestamp TEXT,
  time_only TEXT,
  device_info TEXT,
  status_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE ROW LEVEL SECURITY (RLS) FOR UNRESTRICTED ACCESS BY CLIENT
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazine_issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.infographic_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_hosts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- OPTIONAL: PERMISSIVE PUBLIC RLS POLICIES IN CASE RLS IS ENABLED IN DASHBOARD
DROP POLICY IF EXISTS "Public Full Access Articles" ON public.articles;
CREATE POLICY "Public Full Access Articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Magazines" ON public.magazine_issues;
CREATE POLICY "Public Full Access Magazines" ON public.magazine_issues FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Videos" ON public.video_items;
CREATE POLICY "Public Full Access Videos" ON public.video_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Audios" ON public.audio_items;
CREATE POLICY "Public Full Access Audios" ON public.audio_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Infographics" ON public.infographic_items;
CREATE POLICY "Public Full Access Infographics" ON public.infographic_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Team" ON public.team_members;
CREATE POLICY "Public Full Access Team" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Messages" ON public.contact_messages;
CREATE POLICY "Public Full Access Messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access CoHosts" ON public.co_hosts;
CREATE POLICY "Public Full Access CoHosts" ON public.co_hosts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access SiteSettings" ON public.site_settings;
CREATE POLICY "Public Full Access SiteSettings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access AuditLogs" ON public.audit_logs;
CREATE POLICY "Public Full Access AuditLogs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
