
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'fresh',
  size TEXT NOT NULL DEFAULT '100ml',
  status TEXT NOT NULL DEFAULT 'available',
  badge TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  top_notes TEXT[] NOT NULL DEFAULT '{}',
  middle_notes TEXT[] NOT NULL DEFAULT '{}',
  base_notes TEXT[] NOT NULL DEFAULT '{}',
  views INTEGER NOT NULL DEFAULT 0,
  order_clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brand_settings table (single row)
CREATE TABLE public.brand_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name TEXT NOT NULL DEFAULT 'MAISON ÉLÉGANCE',
  logo_url TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT 'Where Luxury Meets Essence',
  primary_color TEXT NOT NULL DEFAULT '#C9A227',
  secondary_color TEXT NOT NULL DEFAULT '#E5C158',
  whatsapp_number TEXT NOT NULL DEFAULT '966500000000',
  whatsapp_template TEXT NOT NULL DEFAULT 'السلام عليكم
اريد طلب المنتج التالي:

اسم المنتج: {product_name}
السعر: {price}
كود المنتج: {product_id}',
  about_text TEXT NOT NULL DEFAULT 'We are a luxury perfume house dedicated to crafting exceptional fragrances.',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_stats table
CREATE TABLE public.daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Products: everyone can read available products
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Brand settings: everyone can read
CREATE POLICY "Anyone can view settings" ON public.brand_settings FOR SELECT USING (true);

-- Daily stats: everyone can read
CREATE POLICY "Anyone can view stats" ON public.daily_stats FOR SELECT USING (true);

-- For now, allow all operations (admin auth will be handled via edge functions later)
CREATE POLICY "Allow all inserts on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow all updates on settings" ON public.brand_settings FOR UPDATE USING (true);
CREATE POLICY "Allow all inserts on settings" ON public.brand_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all inserts on stats" ON public.daily_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on stats" ON public.daily_stats FOR UPDATE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.brand_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Anyone can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Insert default settings row
INSERT INTO public.brand_settings (id) VALUES (1);

-- Insert default products
INSERT INTO public.products (name, description, price, category, size, status, badge, top_notes, middle_notes, base_notes, views, order_clicks) VALUES
('Midnight Oud', 'A captivating blend of rare oud wood and smoky amber that evokes the mystery of Arabian nights.', 320, 'woody', '100ml', 'available', 'best_seller', ARRAY['Saffron', 'Bergamot', 'Pink Pepper'], ARRAY['Oud Wood', 'Rose Absolute', 'Jasmine'], ARRAY['Amber', 'Musk', 'Sandalwood'], 245, 38),
('Velvet Rose', 'An enchanting floral symphony that captures the essence of a moonlit rose garden.', 280, 'sweet', '50ml', 'available', 'new', ARRAY['Raspberry', 'Lychee', 'Pink Pepper'], ARRAY['Bulgarian Rose', 'Peony', 'Iris'], ARRAY['Vanilla', 'White Musk', 'Cashmeran'], 189, 27),
('Citrus Royale', 'A refreshing burst of Mediterranean citrus blended with aromatic herbs and precious woods.', 250, 'fresh', '75ml', 'available', NULL, ARRAY['Sicilian Lemon', 'Bergamot', 'Grapefruit'], ARRAY['Lavender', 'Rosemary', 'Neroli'], ARRAY['Vetiver', 'Cedar', 'White Musk'], 156, 19),
('Amber Noir', 'A bold and seductive composition built around precious amber and dark vanilla.', 350, 'sweet', '100ml', 'available', 'limited', ARRAY['Cinnamon', 'Cardamom', 'Orange Blossom'], ARRAY['Amber', 'Benzoin', 'Tonka Bean'], ARRAY['Dark Vanilla', 'Patchouli', 'Leather'], 312, 45),
('Ocean Breeze', 'A crisp and invigorating marine fragrance that captures the essence of a pristine coastline.', 220, 'fresh', '50ml', 'available', NULL, ARRAY['Sea Salt', 'Cucumber', 'Mint'], ARRAY['Lotus', 'Water Lily', 'Green Tea'], ARRAY['Driftwood', 'Ambergris', 'Musk'], 98, 12),
('Royal Sandalwood', 'A majestic blend of Indian sandalwood and exotic spices, crafted for the modern connoisseur.', 400, 'woody', '100ml', 'available', 'best_seller', ARRAY['Elemi', 'Cumin', 'Nutmeg'], ARRAY['Sandalwood', 'Cedarwood', 'Guaiac Wood'], ARRAY['Leather', 'Vetiver', 'Amber'], 278, 41);

-- Insert default daily stats
INSERT INTO public.daily_stats (date, clicks) VALUES
('2025-03-01', 12), ('2025-03-02', 18), ('2025-03-03', 15), ('2025-03-04', 22), ('2025-03-05', 28), ('2025-03-06', 20), ('2025-03-07', 25);
