# VenueTrix Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (30 seconds)
```bash
npm install
```

### Step 2: Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes to provision)
3. Go to **Settings** → **API** and copy:
   - Project URL
   - anon/public key

### Step 3: Configure Environment (30 seconds)

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and paste your Supabase credentials
```

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Set Up Database (1 minute)

1. In Supabase dashboard, go to **SQL Editor**
2. Copy contents of `supabase-schema.sql`
3. Paste and click **Run**
4. (Optional) Run `scripts/seed-sample-data.sql` for test data

### Step 5: Verify Setup (30 seconds)

```bash
npm run verify
```

Should see all ✅ checkmarks!

### Step 6: Start Development Server (10 seconds)

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 🎯 Test the Application

### Test Vendor Flow (2 minutes)

1. Go to [http://localhost:3000/vendor](http://localhost:3000/vendor)
2. Click **"Add Dish"**
3. Fill in:
   - Name: "Test Burger"
   - Price: 10.00
   - Category: "Burger"
   - Available Count: 5
4. Click **"Add"**
5. Dish appears in inventory ✅

### Test Customer Flow (2 minutes)

1. Go to [http://localhost:3000/customer](http://localhost:3000/customer)
2. You should see the dish you just added
3. Click on the dish to add to cart
4. Adjust quantity if needed
5. Click **"KOT & Print"** to place order
6. Order appears in vendor dashboard ✅

### Test Order Workflow (1 minute)

1. Go back to vendor dashboard
2. See the new order with "Pending" status
3. Click **"Accept"** → Status changes to "Preparing"
4. Click **"Ready"** → Status changes to "Ready"
5. Click **"Delivered"** → Order complete ✅

## 📋 Quick Reference

### URLs
- **Landing**: http://localhost:3000
- **Customer**: http://localhost:3000/customer
- **Vendor**: http://localhost:3000/vendor
- **Runner**: http://localhost:3000/runner (coming soon)

### Order Status Flow
```
Pending → Preparing → Ready → Delivered
```

### Key Features
- ✅ Real-time order updates
- ✅ Automatic inventory management
- ✅ Category filtering
- ✅ Search functionality
- ✅ Cart management

## 🆘 Troubleshooting

### "No dishes available"
→ Add dishes in vendor dashboard first

### "Orders not appearing"
→ Check Supabase credentials in `.env.local`

### "Can't place order"
→ Ensure dish has `available_count > 0`

### Environment variables not working
→ Restart dev server after changing `.env.local`

## 📚 Need More Help?

- **Detailed Setup**: See [SETUP.md](./SETUP.md)
- **Workflow Guide**: See [WORKFLOW.md](./WORKFLOW.md)
- **All Changes**: See [CHANGES.md](./CHANGES.md)
- **Project Info**: See [README.md](./README.md)

## 🎉 You're Ready!

Your VenueTrix platform is now running with:
- ✅ Supabase backend
- ✅ Real-time updates
- ✅ Modern UI
- ✅ Complete order workflow

Start adding dishes and taking orders! 🚀
