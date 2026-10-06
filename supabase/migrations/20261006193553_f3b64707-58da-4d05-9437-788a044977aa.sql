ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ar text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ingredients text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS prep_time text NOT NULL DEFAULT '';
ALTER TABLE public.products ALTER COLUMN category SET DEFAULT '';
ALTER TABLE public.products ALTER COLUMN size SET DEFAULT '';

ALTER TABLE public.brand_settings
  ADD COLUMN IF NOT EXISTS hero_title text NOT NULL DEFAULT 'أكل بيتي بطعم الحنين',
  ADD COLUMN IF NOT EXISTS hero_subtitle text NOT NULL DEFAULT 'طبخ كل يوم بإيدينا، بنفس الحب اللي في بيتك',
  ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS working_hours text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS instagram_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS min_order numeric NOT NULL DEFAULT 0;

CREATE TABLE public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL DEFAULT '',
  fee numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_zones TO anon, authenticated;
GRANT ALL ON public.delivery_zones TO service_role;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view zones" ON public.delivery_zones FOR SELECT USING (true);
CREATE POLICY "Allow zone inserts" ON public.delivery_zones FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow zone updates" ON public.delivery_zones FOR UPDATE USING (true);
CREATE POLICY "Allow zone deletes" ON public.delivery_zones FOR DELETE USING (true);