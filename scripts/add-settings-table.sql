-- Create settings table for admin configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default WhatsApp number
INSERT INTO settings (key, value) VALUES 
('whatsapp_number', '+1234567890'),
('business_name', 'CieloSkin'),
('business_email', 'hello@cieloskin.com')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

-- Allow public write access to settings (for admin)
CREATE POLICY "Public can update settings" ON settings
  FOR UPDATE USING (true);

CREATE POLICY "Public can insert settings" ON settings
  FOR INSERT WITH CHECK (true);
