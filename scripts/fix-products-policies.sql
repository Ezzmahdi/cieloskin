-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Disable RLS temporarily to fix the policies
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new policies that allow public access for admin operations
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete products" ON products
  FOR DELETE USING (true);
