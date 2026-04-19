# Migration Guide - Upgrading to Multi-Vendor with Variants & Add-ons

## What's New?

✨ **Multiple Vendors/Stalls** - Support for multiple food stalls  
✨ **Variants** - Different sizes (Half/Full, Small/Medium/Large)  
✨ **Add-ons** - Extra items customers can add  
✨ **Veg/Non-Veg** - Clear indicators for dietary preferences  
✨ **Indian Pricing** - Prices in ₹ (INR)  
✨ **Better UI** - Cleaner design with categories and images  

## Migration Steps

### Option 1: Fresh Start (Recommended if you haven't added data yet)

1. **Go to Supabase SQL Editor**:  
   https://supabase.com/dashboard/project/zspnfwnsbdimpjjbyqkb/sql/new

2. **Run the new schema**:
   - Copy contents of `supabase-schema-v2.sql`
   - Paste into SQL Editor
   - Click "Run"

3. **Add sample Indian food data**:
   - Copy contents of `scripts/seed-indian-food-data.sql`
   - Paste into SQL Editor
   - Click "Run"

4. **Restart dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

### Option 2: Keep Existing Data (If you have important data)

If you've already added dishes and want to keep them:

1. **Backup your data first**:
   - Go to Supabase Dashboard → Database → Backups
   - Create a manual backup

2. **Add new columns to existing tables**:
   ```sql
   -- Add new columns to vendors table
   ALTER TABLE vendors ADD COLUMN IF NOT EXISTS stall_number TEXT;
   
   -- Rename price to base_price in dishes table
   ALTER TABLE dishes RENAME COLUMN price TO base_price;
   
   -- Add new columns to dishes table
   ALTER TABLE dishes ADD COLUMN IF NOT EXISTS is_veg BOOLEAN DEFAULT true;
   
   -- Create new tables
   -- (Copy the CREATE TABLE statements from supabase-schema-v2.sql for:
   --  dish_variants, dish_addons, order_item_addons)
   ```

3. **Update existing data**:
   ```sql
   -- Set stall numbers for existing vendors
   UPDATE vendors SET stall_number = 'Stall 1' WHERE stall_number IS NULL;
   
   -- Set all existing dishes as veg (update manually if needed)
   UPDATE dishes SET is_veg = true WHERE is_veg IS NULL;
   ```

## What Changed in the Database?

### New Tables:
- `dish_variants` - Store size options (Half/Full, etc.)
- `dish_addons` - Store add-on items (Extra Cheese, etc.)
- `order_item_addons` - Track which add-ons were ordered

### Modified Tables:
- `vendors` - Added `stall_number` field
- `dishes` - Renamed `price` → `base_price`, added `is_veg` field
- `order_items` - Added `variant_id` field

## Sample Data Included

The seed script includes **5 vendors** with **25+ dishes**:

1. **Punjabi Dhaba** (Stall 1)
   - Paneer Tikka, Butter Chicken, Dal Makhani, Breads

2. **South Spice** (Stall 2)
   - Masala Dosa, Idli Sambar, Uttapam, Filter Coffee

3. **Street Food Corner** (Stall 3)
   - Pav Bhaji, Vada Pav, Pani Puri, Samosa

4. **Biryani House** (Stall 4)
   - Chicken Biryani, Mutton Biryani, Kebabs

5. **Chai & Snacks** (Stall 5)
   - Masala Chai, Bun Maska, Pakora, Cold Coffee

## Verification

After migration, verify:

```sql
-- Check vendors
SELECT COUNT(*) FROM vendors;
-- Should return 5

-- Check dishes
SELECT COUNT(*) FROM dishes;
-- Should return 25+

-- Check variants
SELECT COUNT(*) FROM dish_variants;
-- Should return 15+

-- Check add-ons
SELECT COUNT(*) FROM dish_addons;
-- Should return 20+
```

## Next Steps

After migration:
1. Restart your dev server
2. Visit http://localhost:3000/customer
3. You should see multiple vendors/stalls
4. Each dish shows veg/non-veg indicator
5. Variants and add-ons are available

## Rollback (If Needed)

If something goes wrong:

1. Go to Supabase Dashboard → Database → Backups
2. Restore your backup
3. Or drop the new tables:
   ```sql
   DROP TABLE IF EXISTS order_item_addons CASCADE;
   DROP TABLE IF EXISTS dish_addons CASCADE;
   DROP TABLE IF EXISTS dish_variants CASCADE;
   ```
