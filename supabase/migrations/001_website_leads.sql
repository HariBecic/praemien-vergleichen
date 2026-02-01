-- ─── Leads Table for praemien-vergleichen.ch ────────────────────────────────
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.website_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Contact
  first_name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plz TEXT DEFAULT '',
  canton TEXT DEFAULT '',
  birth_year TEXT DEFAULT '',

  -- Insurance details
  age_group TEXT DEFAULT '',
  franchise INTEGER DEFAULT 0,
  model TEXT DEFAULT '',
  current_insurer TEXT,
  extras TEXT[] DEFAULT '{}',

  -- Calculator results
  cheapest_insurer TEXT,
  cheapest_premium NUMERIC(10,2),

  -- Tracking
  source TEXT NOT NULL DEFAULT 'praemien-vergleichen.ch',
  newsletter BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'assigned', 'contacted', 'converted', 'closed')),

  -- LeadsHub integration
  leadshub_id UUID,
  assigned_to UUID,
  assigned_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wl_status ON public.website_leads (status);
CREATE INDEX IF NOT EXISTS idx_wl_created ON public.website_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wl_canton ON public.website_leads (canton);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER website_leads_updated_at
  BEFORE UPDATE ON public.website_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.website_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous users can insert (website form)
CREATE POLICY "anon_insert" ON public.website_leads
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users (LeadsHub) can read and update
CREATE POLICY "auth_read" ON public.website_leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_update" ON public.website_leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
