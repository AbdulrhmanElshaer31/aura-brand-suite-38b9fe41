
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  name_ar text NOT NULL DEFAULT '',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow all inserts on categories" ON public.categories FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all updates on categories" ON public.categories FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on categories" ON public.categories FOR DELETE TO public USING (true);

INSERT INTO public.categories (name, name_ar, is_default) VALUES
  ('fresh', 'منعش', true),
  ('sweet', 'حلو', true),
  ('woody', 'خشبي', true);
