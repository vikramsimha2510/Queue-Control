# VenueTrix 🎯

A premium venue-commerce platform for seat-level ordering with real-time communication and smart dispatch. Built with Next.js 16, Supabase, and modern UI components.

## Features ✨

- **Customer Portal**: Browse menu items, add to cart, and place orders directly to your seat
- **Vendor Console**: Manage dishes, inventory, and process orders in real-time
- **Real-time Updates**: Live order notifications using Supabase real-time subscriptions
- **Inventory Management**: Automatic stock tracking and updates
- **Modern UI**: Clean, professional interface inspired by modern POS systems
- **Order Workflow**: Complete lifecycle from pending → preparing → ready → delivered

## Tech Stack 🛠️

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Real-time)
- **UI**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React

## Quick Start 🚀

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

Follow the detailed setup guide in [SETUP.md](./SETUP.md) to:
- Create a Supabase project
- Run the database schema
- Configure environment variables

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Application Structure 📁

```
src/
├── app/
│   ├── customer/          # Customer ordering interface
│   ├── vendor/            # Vendor management console
│   ├── runner/            # Runner dispatch (coming soon)
│   └── page.tsx           # Landing page
├── components/
│   └── ui/                # Reusable UI components
└── lib/
    └── supabase/          # Supabase client and types
```

## Usage Guide 📖

### For Vendors

1. Navigate to `/vendor`
2. Add dishes with name, price, category, and inventory count
3. Monitor incoming orders in real-time
4. Update order status through the workflow
5. Edit or delete dishes as needed

### For Customers

1. Navigate to `/customer`
2. Browse available dishes (filtered by stock availability)
3. Add items to cart with quantity controls
4. Review order summary with discounts
5. Place order (inventory updates automatically)

## Database Schema 🗄️

The application uses four main tables:
- **vendors**: Store vendor information
- **dishes**: Menu items with inventory tracking
- **orders**: Customer orders with status workflow
- **order_items**: Individual items in each order

See [SETUP.md](./SETUP.md) for detailed schema information.

## Key Features Explained 🔑

### Real-time Order Updates
Vendors receive instant notifications when new orders are placed using Supabase's real-time subscriptions.

### Inventory Management
- Vendors set initial stock counts when adding dishes
- Stock automatically decrements when orders are placed
- Customers only see dishes with available inventory
- Prevents overselling through database constraints

### Order Workflow
1. **Pending**: New order placed by customer
2. **Preparing**: Vendor accepts and starts preparation
3. **Ready**: Order is ready for pickup/delivery
4. **Delivered**: Order completed
5. **Cancelled**: Order cancelled (only from pending/preparing)

## Customization 🎨

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:
- Primary: `#3D2FB5` (Purple)
- Secondary: `#0ECFB1` (Teal)
- Accent: Orange (`#FF6B35` in components)

### Categories
Modify dish categories in the vendor console. Categories are dynamically generated from existing dishes.

## Troubleshooting 🔧

See [SETUP.md](./SETUP.md) for common issues and solutions.

## Next Steps 🚀

- [ ] Add user authentication (Supabase Auth)
- [ ] Implement image upload for dishes
- [ ] Add payment processing integration
- [ ] Create runner dashboard for delivery
- [ ] Add order history and analytics
- [ ] Implement push notifications
- [ ] Add multi-vendor support
- [ ] Create admin dashboard

## Learn More 📚

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## License 📄

MIT
