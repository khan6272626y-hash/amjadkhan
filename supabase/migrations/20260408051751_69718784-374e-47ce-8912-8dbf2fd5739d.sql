
CREATE POLICY "Allow public insert for products"
  ON public.products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
