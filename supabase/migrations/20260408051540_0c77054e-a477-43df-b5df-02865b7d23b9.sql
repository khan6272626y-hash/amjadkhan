
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_key TEXT NOT NULL,
  category TEXT NOT NULL,
  tag TEXT,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_best BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  features TEXT[],
  sizes NUMERIC[],
  colors TEXT[],
  rating NUMERIC(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);
