-- Sample Indian Food Data with Variants and Add-ons
-- Run this AFTER running supabase-schema-v2.sql

-- First, get vendor IDs (you'll need to replace these with actual UUIDs after vendors are created)
-- Or use this query to get them: SELECT id, name FROM vendors;

-- For this example, I'll use placeholder variables
-- Replace these with your actual vendor IDs from the vendors table

DO $$
DECLARE
  punjabi_dhaba_id UUID;
  south_spice_id UUID;
  street_food_id UUID;
  biryani_house_id UUID;
  chai_snacks_id UUID;
  
  -- Dish IDs
  paneer_tikka_id UUID;
  butter_chicken_id UUID;
  dal_makhani_id UUID;
  masala_dosa_id UUID;
  idli_sambar_id UUID;
  pav_bhaji_id UUID;
  vada_pav_id UUID;
  chicken_biryani_id UUID;
  mutton_biryani_id UUID;
  masala_chai_id UUID;
  
BEGIN
  -- Get vendor IDs
  SELECT id INTO punjabi_dhaba_id FROM vendors WHERE name = 'Punjabi Dhaba' LIMIT 1;
  SELECT id INTO south_spice_id FROM vendors WHERE name = 'South Spice' LIMIT 1;
  SELECT id INTO street_food_id FROM vendors WHERE name = 'Street Food Corner' LIMIT 1;
  SELECT id INTO biryani_house_id FROM vendors WHERE name = 'Biryani House' LIMIT 1;
  SELECT id INTO chai_snacks_id FROM vendors WHERE name = 'Chai & Snacks' LIMIT 1;

  -- ============================================
  -- PUNJABI DHABA (Stall 1)
  -- ============================================
  
  -- 1. Paneer Tikka
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), punjabi_dhaba_id, 'Paneer Tikka', 'Grilled cottage cheese marinated in spices', 180, 'Starters', true, 25, true)
  RETURNING id INTO paneer_tikka_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (paneer_tikka_id, 'Half', 180),
    (paneer_tikka_id, 'Full', 320);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (paneer_tikka_id, 'Extra Mint Chutney', 20),
    (paneer_tikka_id, 'Extra Onions', 15);

  -- 2. Butter Chicken
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), punjabi_dhaba_id, 'Butter Chicken', 'Creamy tomato-based chicken curry', 280, 'Main Course', false, 20, true)
  RETURNING id INTO butter_chicken_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (butter_chicken_id, 'Half', 280),
    (butter_chicken_id, 'Full', 480);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (butter_chicken_id, 'Extra Gravy', 40),
    (butter_chicken_id, 'Butter Naan (2 pcs)', 60);

  -- 3. Dal Makhani
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), punjabi_dhaba_id, 'Dal Makhani', 'Creamy black lentils cooked overnight', 180, 'Main Course', true, 30, true)
  RETURNING id INTO dal_makhani_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (dal_makhani_id, 'Half', 180),
    (dal_makhani_id, 'Full', 320);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (dal_makhani_id, 'Jeera Rice', 80),
    (dal_makhani_id, 'Plain Naan (2 pcs)', 50);

  -- 4. Tandoori Roti
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (punjabi_dhaba_id, 'Tandoori Roti', 'Whole wheat bread from tandoor', 15, 'Breads', true, 50, true);

  -- 5. Laccha Paratha
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (punjabi_dhaba_id, 'Laccha Paratha', 'Layered whole wheat flatbread', 40, 'Breads', true, 40, true);

  -- ============================================
  -- SOUTH SPICE (Stall 2)
  -- ============================================
  
  -- 1. Masala Dosa
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), south_spice_id, 'Masala Dosa', 'Crispy rice crepe with potato filling', 80, 'Main Course', true, 30, true)
  RETURNING id INTO masala_dosa_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (masala_dosa_id, 'Plain Dosa', 60),
    (masala_dosa_id, 'Masala Dosa', 80),
    (masala_dosa_id, 'Cheese Masala Dosa', 120);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (masala_dosa_id, 'Extra Sambar', 20),
    (masala_dosa_id, 'Extra Chutney', 15),
    (masala_dosa_id, 'Ghee Roast', 30);

  -- 2. Idli Sambar
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), south_spice_id, 'Idli Sambar', 'Steamed rice cakes with lentil soup', 60, 'Breakfast', true, 40, true)
  RETURNING id INTO idli_sambar_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (idli_sambar_id, '2 Idlis', 60),
    (idli_sambar_id, '4 Idlis', 100);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (idli_sambar_id, 'Medu Vada (1 pc)', 30),
    (idli_sambar_id, 'Extra Sambar', 20);

  -- 3. Uttapam
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (south_spice_id, 'Onion Uttapam', 'Thick rice pancake with onions', 90, 'Main Course', true, 25, true);

  -- 4. Filter Coffee
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (south_spice_id, 'Filter Coffee', 'Traditional South Indian coffee', 40, 'Beverages', true, 50, true);

  -- 5. Veg Thali
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (south_spice_id, 'South Indian Thali', 'Complete meal with rice, sambar, rasam, curries', 180, 'Thali', true, 20, true);

  -- ============================================
  -- STREET FOOD CORNER (Stall 3)
  -- ============================================
  
  -- 1. Pav Bhaji
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), street_food_id, 'Pav Bhaji', 'Spicy mashed vegetables with buttered bread', 100, 'Street Food', true, 30, true)
  RETURNING id INTO pav_bhaji_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (pav_bhaji_id, 'Regular', 100),
    (pav_bhaji_id, 'Cheese Pav Bhaji', 140),
    (pav_bhaji_id, 'Jain Pav Bhaji', 110);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (pav_bhaji_id, 'Extra Pav (2 pcs)', 20),
    (pav_bhaji_id, 'Extra Butter', 15),
    (pav_bhaji_id, 'Extra Cheese', 30);

  -- 2. Vada Pav
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), street_food_id, 'Vada Pav', 'Spiced potato fritter in bread bun', 30, 'Street Food', true, 50, true)
  RETURNING id INTO vada_pav_id;
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (vada_pav_id, 'Extra Chutney', 10),
    (vada_pav_id, 'Fried Green Chili', 5);

  -- 3. Pani Puri
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (street_food_id, 'Pani Puri', 'Crispy shells with spicy water', 40, 'Street Food', true, 40, true);

  -- 4. Bhel Puri
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (street_food_id, 'Bhel Puri', 'Puffed rice with chutneys and vegetables', 50, 'Street Food', true, 35, true);

  -- 5. Samosa
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (street_food_id, 'Samosa', 'Crispy pastry with spiced potato filling', 20, 'Snacks', true, 60, true);

  -- ============================================
  -- BIRYANI HOUSE (Stall 4)
  -- ============================================
  
  -- 1. Chicken Biryani
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), biryani_house_id, 'Chicken Biryani', 'Aromatic basmati rice with tender chicken', 220, 'Biryani', false, 25, true)
  RETURNING id INTO chicken_biryani_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (chicken_biryani_id, 'Half', 220),
    (chicken_biryani_id, 'Full', 380);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (chicken_biryani_id, 'Raita', 40),
    (chicken_biryani_id, 'Extra Gravy', 50),
    (chicken_biryani_id, 'Boiled Egg', 25);

  -- 2. Mutton Biryani
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), biryani_house_id, 'Mutton Biryani', 'Rich biryani with succulent mutton pieces', 320, 'Biryani', false, 15, true)
  RETURNING id INTO mutton_biryani_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (mutton_biryani_id, 'Half', 320),
    (mutton_biryani_id, 'Full', 550);
  
  INSERT INTO dish_addons (dish_id, name, price) VALUES
    (mutton_biryani_id, 'Raita', 40),
    (mutton_biryani_id, 'Shorba', 60);

  -- 3. Veg Biryani
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (biryani_house_id, 'Veg Biryani', 'Fragrant rice with mixed vegetables', 160, 'Biryani', true, 30, true);

  -- 4. Chicken Kebab
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (biryani_house_id, 'Chicken Seekh Kebab', 'Minced chicken kebabs', 180, 'Starters', false, 20, true);

  -- 5. Paneer Biryani
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (biryani_house_id, 'Paneer Biryani', 'Biryani with cottage cheese cubes', 180, 'Biryani', true, 25, true);

  -- ============================================
  -- CHAI & SNACKS (Stall 5)
  -- ============================================
  
  -- 1. Masala Chai
  INSERT INTO dishes (id, vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (gen_random_uuid(), chai_snacks_id, 'Masala Chai', 'Spiced Indian tea', 20, 'Beverages', true, 100, true)
  RETURNING id INTO masala_chai_id;
  
  INSERT INTO dish_variants (dish_id, name, price) VALUES
    (masala_chai_id, 'Cutting Chai', 15),
    (masala_chai_id, 'Regular', 20),
    (masala_chai_id, 'Kulhad Chai', 30);

  -- 2. Bun Maska
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (chai_snacks_id, 'Bun Maska', 'Soft bun with butter', 40, 'Snacks', true, 50, true);

  -- 3. Pakora
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (chai_snacks_id, 'Mix Pakora', 'Assorted vegetable fritters', 60, 'Snacks', true, 40, true);

  -- 4. Bread Omelette
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (chai_snacks_id, 'Bread Omelette', 'Egg omelette with bread', 50, 'Snacks', false, 35, true);

  -- 5. Cold Coffee
  INSERT INTO dishes (vendor_id, name, description, base_price, category, is_veg, available_count, is_active)
  VALUES (chai_snacks_id, 'Cold Coffee', 'Chilled coffee with ice cream', 80, 'Beverages', true, 30, true);

END $$;
