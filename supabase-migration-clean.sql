-- Clean Migration Script - Handles Existing Tables
-- This will update your existing schema without errors

-- Step 1: Add new columns to existing tables (if they don't exist)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS stall_number TEXT;

-- Step 2: Rename price to base_price in dishes table (if not already renamed)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dishes' AND column_name = 'price'
  ) THEN
    ALTER TABLE dishes RENAME COLUMN price TO base_price;
  END IF;
END $$;

-- Step 3: Add is_veg column to dishes table
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS is_veg BOOLEAN DEFAULT true;

-- Step 4: Create new tables for variants and add-ons
CREATE TABLE IF NOT EXISTS dish_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dish_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Add variant_id to order_items (if not exists)
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES dish_variants(id) ON DELETE SET NULL;

-- Step 6: Create order_item_addons table
CREATE TABLE IF NOT EXISTS order_item_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES dish_addons(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create indexes (if not exist)
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_dish_variants_dish_id ON dish_variants(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_addons_dish_id ON dish_addons(dish_id);
CREATE INDEX IF NOT EXISTS idx_order_item_addons_order_item_id ON order_item_addons(order_item_id);

-- Step 8: Enable RLS on new tables
ALTER TABLE dish_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;

-- Step 9: Create policies for new tables (drop if exists first)
DROP POLICY IF EXISTS "Allow all operations on dish_variants" ON dish_variants;
DROP POLICY IF EXISTS "Allow all operations on dish_addons" ON dish_addons;
DROP POLICY IF EXISTS "Allow all operations on order_item_addons" ON order_item_addons;

CREATE POLICY "Allow all operations on dish_variants" ON dish_variants FOR ALL USING (true);
CREATE POLICY "Allow all operations on dish_addons" ON dish_addons FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_item_addons" ON order_item_addons FOR ALL USING (true);

-- Step 10: Update existing vendors with stall numbers
WITH numbered_vendors AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM vendors
  WHERE stall_number IS NULL
)
UPDATE vendors
SET stall_number = 'Stall ' || numbered_vendors.rn
FROM numbered_vendors
WHERE vendors.id = numbered_vendors.id;

-- Step 11: Add more sample vendors (if you want multiple stalls)
INSERT INTO vendors (name, description, stall_number, is_active) 
SELECT * FROM (VALUES
  ('Punjabi Dhaba', 'Authentic North Indian cuisine', 'Stall 1', true),
  ('South Spice', 'Traditional South Indian delicacies', 'Stall 2', true),
  ('Street Food Corner', 'Popular Indian street food', 'Stall 3', true),
  ('Biryani House', 'Aromatic biryanis and kebabs', 'Stall 4', true),
  ('Chai & Snacks', 'Tea and quick bites', 'Stall 5', true)
) AS v(name, description, stall_number, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM vendors WHERE vendors.name = v.name
);

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'New tables created: dish_variants, dish_addons, order_item_addons';
  RAISE NOTICE 'Vendors table updated with stall_number';
  RAISE NOTICE 'Dishes table updated with is_veg and base_price';
END $$;
