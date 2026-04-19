# VenueTrix Setup Checklist

Use this checklist to ensure your VenueTrix platform is properly set up and ready to use.

## 📋 Pre-Setup Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Internet connection for Supabase

## 🚀 Setup Checklist

### 1. Project Setup
- [ ] Clone/download the project
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Verify all dependencies installed successfully

### 2. Supabase Account
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Verify email address
- [ ] Log in to Supabase dashboard

### 3. Supabase Project
- [ ] Click "New Project"
- [ ] Enter project name (e.g., "VenueTrix")
- [ ] Create strong database password
- [ ] Select region (closest to you)
- [ ] Wait for project to be created (~2 minutes)
- [ ] Project shows "Active" status

### 4. Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `supabase-schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Verify "Success" message
- [ ] Check tables created (vendors, dishes, orders, order_items)

### 5. Sample Data (Optional)
- [ ] Open `scripts/seed-sample-data.sql`
- [ ] Copy contents
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify sample dishes created

### 6. Environment Configuration
- [ ] Go to Supabase Settings → API
- [ ] Copy "Project URL"
- [ ] Copy "anon/public key"
- [ ] Run `cp .env.local.example .env.local`
- [ ] Open `.env.local` in editor
- [ ] Paste Project URL
- [ ] Paste anon key
- [ ] Save file

### 7. Verification
- [ ] Run `npm run verify`
- [ ] All checks show ✅
- [ ] No error messages

### 8. Start Development
- [ ] Run `npm run dev`
- [ ] Server starts successfully
- [ ] No error messages in terminal
- [ ] Open http://localhost:3000
- [ ] Landing page loads

## ✅ Testing Checklist

### Vendor Dashboard Test
- [ ] Navigate to http://localhost:3000/vendor
- [ ] Page loads without errors
- [ ] Click "Add Dish" button
- [ ] Form appears
- [ ] Fill in all fields:
  - [ ] Name: "Test Burger"
  - [ ] Price: 10.00
  - [ ] Category: "Burger"
  - [ ] Available Count: 5
- [ ] Click "Add"
- [ ] Dish appears in inventory list
- [ ] No error messages

### Customer Portal Test
- [ ] Navigate to http://localhost:3000/customer
- [ ] Page loads without errors
- [ ] Test dish appears in grid
- [ ] Click on dish
- [ ] Dish added to cart
- [ ] Cart shows correct item
- [ ] Adjust quantity with +/- buttons
- [ ] Quantity updates correctly
- [ ] Price calculates correctly
- [ ] Click "KOT & Print"
- [ ] Order confirmation appears
- [ ] No error messages

### Order Workflow Test
- [ ] Go back to vendor dashboard
- [ ] New order appears in orders list
- [ ] Order shows "Pending" status
- [ ] Click "Accept" button
- [ ] Status changes to "Preparing"
- [ ] Click "Ready" button
- [ ] Status changes to "Ready"
- [ ] Click "Delivered" button
- [ ] Status changes to "Delivered"
- [ ] No error messages

### Inventory Test
- [ ] Check dish stock count
- [ ] Note original count
- [ ] Place order from customer portal
- [ ] Return to vendor dashboard
- [ ] Check dish stock count
- [ ] Stock decreased by order quantity
- [ ] Calculation is correct

### Real-time Test
- [ ] Open vendor dashboard in one browser tab
- [ ] Open customer portal in another tab
- [ ] Place order from customer tab
- [ ] Switch to vendor tab
- [ ] Order appears without refresh
- [ ] Real-time update working

## 🔍 Troubleshooting Checklist

If something doesn't work, check:

### Environment Issues
- [ ] `.env.local` file exists
- [ ] Supabase URL is correct
- [ ] Supabase anon key is correct
- [ ] No extra spaces in environment variables
- [ ] Restarted dev server after changing .env.local

### Database Issues
- [ ] Supabase project is active
- [ ] Database schema was run successfully
- [ ] Tables exist in Supabase dashboard
- [ ] Sample data was inserted (if using)
- [ ] RLS policies are enabled

### Connection Issues
- [ ] Internet connection is working
- [ ] Supabase project is accessible
- [ ] No firewall blocking Supabase
- [ ] Browser console shows no errors

### Code Issues
- [ ] All dependencies installed
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Dev server is running
- [ ] Correct URL in browser

## 📊 Feature Checklist

Verify all features are working:

### Customer Features
- [ ] Browse dishes
- [ ] Search dishes
- [ ] Filter by category
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Adjust quantities
- [ ] View order summary
- [ ] See discounts
- [ ] Place order
- [ ] See stock availability

### Vendor Features
- [ ] View orders
- [ ] Add dishes
- [ ] Edit dishes
- [ ] Delete dishes
- [ ] Update order status
- [ ] Cancel orders
- [ ] View inventory
- [ ] Real-time updates

### System Features
- [ ] Automatic inventory updates
- [ ] Real-time order notifications
- [ ] Order status workflow
- [ ] Stock validation
- [ ] Price calculations
- [ ] Discount calculations

## 🎨 UI Checklist

Verify UI is working correctly:

### Customer Portal
- [ ] Header displays correctly
- [ ] Search bar works
- [ ] Category tabs work
- [ ] Dishes display in grid
- [ ] Images load (if provided)
- [ ] Cart sidebar is sticky
- [ ] Buttons are clickable
- [ ] Colors match design
- [ ] Responsive on mobile

### Vendor Console
- [ ] Header displays correctly
- [ ] Orders list displays
- [ ] Status badges show colors
- [ ] Action buttons work
- [ ] Inventory panel displays
- [ ] Add dish form works
- [ ] Edit dish form works
- [ ] Delete confirmation works
- [ ] Responsive on mobile

## 🚀 Deployment Checklist

When ready to deploy:

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Sample data removed (if needed)

### Vercel Deployment
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy project
- [ ] Verify deployment successful
- [ ] Test production URL

### Post-Deployment
- [ ] Production site loads
- [ ] All features work
- [ ] Database connection works
- [ ] Real-time updates work
- [ ] No errors in logs

## 📚 Documentation Checklist

Ensure you've reviewed:

- [ ] README.md - Project overview
- [ ] QUICK-START.md - Quick setup guide
- [ ] SETUP.md - Detailed setup instructions
- [ ] WORKFLOW.md - Usage workflows
- [ ] ARCHITECTURE.md - Technical details
- [ ] CHANGES.md - What was changed
- [ ] PROJECT-SUMMARY.md - Complete summary

## ✨ Customization Checklist

Optional customizations:

- [ ] Update vendor name
- [ ] Change color scheme
- [ ] Add logo images
- [ ] Customize categories
- [ ] Add more sample dishes
- [ ] Adjust pricing
- [ ] Modify discount rates
- [ ] Update seat numbers

## 🎯 Production Readiness Checklist

Before going live:

### Security
- [ ] Environment variables secured
- [ ] RLS policies reviewed
- [ ] API keys not exposed
- [ ] HTTPS enabled
- [ ] CORS configured

### Performance
- [ ] Database indexes verified
- [ ] Queries optimized
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN setup (if needed)

### Monitoring
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Logging enabled
- [ ] Alerts configured
- [ ] Backup strategy

### User Experience
- [ ] Loading states added
- [ ] Error messages clear
- [ ] Success confirmations
- [ ] Help documentation
- [ ] Support contact info

## 🎉 Launch Checklist

Final steps before launch:

- [ ] All features tested
- [ ] All bugs fixed
- [ ] Documentation complete
- [ ] Team trained
- [ ] Support ready
- [ ] Backup plan ready
- [ ] Rollback plan ready
- [ ] Monitoring active
- [ ] Announcement ready
- [ ] Launch! 🚀

## 📝 Notes

Use this space for your own notes:

```
Date Started: _______________
Date Completed: _______________

Issues Encountered:
-
-
-

Customizations Made:
-
-
-

Next Steps:
-
-
-
```

---

**Tip**: Print this checklist and check off items as you complete them!
