import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  stall_number?: string;
  is_active: boolean;
  created_at: string;
}

export interface Dish {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  base_price: number;
  image_url?: string;
  category: string;
  is_veg: boolean;
  available_count: number;
  is_active: boolean;
  created_at: string;
}

export interface DishVariant {
  id: string;
  dish_id: string;
  name: string;
  price: number;
  is_available: boolean;
  created_at: string;
}

export interface DishAddon {
  id: string;
  dish_id: string;
  name: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  vendor_id: string;
  seat_number: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderItemAddon {
  id: string;
  order_item_id: string;
  addon_id: string;
  quantity: number;
  price: number;
  created_at: string;
}
