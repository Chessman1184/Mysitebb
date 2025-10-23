import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_amount: number;
  notes: string;
  status: string;
  stripe_payment_intent_id?: string;
  created_at: string;
}

export interface CustomOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  description: string;
  status: string;
  estimated_price?: number;
  created_at: string;
}
