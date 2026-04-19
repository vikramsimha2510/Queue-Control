# VenueTrix Setup Guide

## Supabase Backend Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: VenueTrix (or your preferred name)
   - Database Password: (create a strong password)
   - Region: Choose closest to your location
4. Wait for the project to be created (takes ~2 minutes)

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- `vendors` table - Store vendor information
- `dishes` table - Store menu items with inventory counts
- `orders` table - Store customer orders
- `order_items` table - Store individual items in each order
- Sample data for testing

### 3. Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

3. Create a `.env.local` file in your project root:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Add Sample Dishes (Optional)

After creating vendors, you can add sample dishes through the Vendor Console or via SQL:

```sql
-- Get your vendor ID first
SELECT id, name FROM vendors;

-- Then insert dishes (replace 'your-vendor-id' with actual UUID)
INSERT INTO dishes (vendor_id, name, description, price, category, available_count, is_active) VALUES
  ('your-vendor-id', 'Shrimp Basil Salad', 'Fresh salad with shrimp and basil', 10.00, 'Salad', 20, true),
  ('your-vendor-id', 'Onion Rings', 'Crispy golden onion rings', 6.00, 'Sides', 30, true),
  ('your-vendor-id', 'Grilled Bacon', 'Premium grilled bacon strips', 8.00, 'Sides', 25, true),
  ('your-vendor-id', 'Fresh Tomatoes', 'Organic fresh tomatoes', 5.00, 'Salad', 40, true),
  ('your-vendor-id', 'Chicken Burger', 'Juicy chicken burger with toppings', 12.00, 'Burger', 15, true),
  ('your-vendor-id', 'Beef Onion Rings', 'Beef burger with onion rings', 14.00, 'Burger', 12, true),
  ('your-vendor-id', 'Beef Burger', 'Classic beef burger', 13.00, 'Burger', 18, true),
  ('your-vendor-id', 'Grime Burger', 'Special grime burger', 15.00, 'Burger', 10, true),
  ('your-vendor-id', 'Fresh Beef Salad', 'Salad with fresh beef', 11.00, 'Salad', 15, true),
  ('your-vendor-id', 'Vegetable Pizza', 'Pizza loaded with vegetables', 16.00, 'Pizza', 8, true),
  ('your-vendor-id', 'Bun & Chips', 'Bun served with crispy chips', 7.00, 'Sides', 25, true);
```

### 5. Run the Application

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Application Flow

### For Vendors:
1. Navigate to `/vendor`
2. Add dishes with inventory counts
3. Monitor incoming orders in real-time
4. Update order status (pending → preparing → ready → delivered)

### For Customers:
1. Navigate to `/customer`
2. Browse available dishes (only shows items with stock > 0)
3. Add items to cart
4. Place order
5. Inventory automatically decrements

## Key Features

✅ **Real-time Updates**: Orders appear instantly for vendors using Supabase real-time subscriptions
✅ **Inventory Management**: Stock counts automatically update when orders are placed
✅ **Order Workflow**: Complete order lifecycle from pending to delivered
✅ **Modern UI**: Clean, professional interface inspired by modern POS systems
✅ **Responsive Design**: Works on desktop and mobile devices

## Database Schema Overview

```
vendors
├── id (UUID, primary key)
├── name (text)
├── description (text)
├── logo_url (text, optional)
├── is_active (boolean)
└── created_at (timestamp)

dishes
├── id (UUID, primary key)
├── vendor_id (UUID, foreign key → vendors)
├── name (text)
├── description (text, optional)
├── price (decimal)
├── image_url (text, optional)
├── category (text)
├── available_count (integer)
├── is_active (boolean)
└── created_at (timestamp)

orders
├── id (UUID, primary key)
├── customer_id (text)
├── vendor_id (UUID, foreign key → vendors)
├── seat_number (text)
├── status (enum: pending, preparing, ready, delivered, cancelled)
├── total_amount (decimal)
├── created_at (timestamp)
└── updated_at (timestamp)

order_items
├── id (UUID, primary key)
├── order_id (UUID, foreign key → orders)
├── dish_id (UUID, foreign key → dishes)
├── quantity (integer)
├── price (decimal)
└── created_at (timestamp)
```

## Troubleshooting

### Orders not appearing in real-time?
- Check that your Supabase project has real-time enabled (it's on by default)
- Verify your environment variables are correct
- Check browser console for any errors

### Dishes not showing for customers?
- Ensure dishes have `available_count > 0`
- Verify `is_active = true` for both vendor and dishes
- Check that vendor_id matches between vendors and dishes tables

### Can't place orders?
- Verify all tables are created correctly
- Check that RLS policies are set up (the schema includes permissive policies for demo)
- Look for errors in browser console

## Next Steps

- Add authentication (Supabase Auth)
- Implement image upload for dishes
- Add payment processing
- Create runner dashboard for order delivery
- Add order history and analytics
- Implement real-time notifications
