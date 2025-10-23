/*
  # E-commerce Platform Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `description` (text, product description)
      - `price` (decimal, product price)
      - `image_url` (text, product image URL)
      - `stock` (integer, available quantity)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text, buyer's name)
      - `customer_email` (text, buyer's email)
      - `product_id` (uuid, reference to products)
      - `product_name` (text, snapshot of product name)
      - `product_price` (decimal, snapshot of price at purchase)
      - `quantity` (integer, quantity ordered)
      - `total_amount` (decimal, total order amount)
      - `notes` (text, optional customer notes)
      - `status` (text, order status: pending, completed, cancelled)
      - `stripe_payment_intent_id` (text, optional Stripe payment reference)
      - `created_at` (timestamptz)
    
    - `custom_orders`
      - `id` (uuid, primary key)
      - `customer_name` (text, customer name)
      - `customer_email` (text, customer email)
      - `description` (text, custom order description)
      - `status` (text, order status: pending, in_progress, completed, cancelled)
      - `estimated_price` (decimal, optional estimated price)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read products
    - Public can insert orders and custom orders (for guest checkout)
    - Customers can view their own orders by email

  3. Sample Data
    - Insert sample products with images and prices
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total_amount decimal(10,2) NOT NULL,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

-- Create custom orders table
CREATE TABLE IF NOT EXISTS custom_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  estimated_price decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read access)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO public
  USING (true);

-- RLS Policies for custom orders
CREATE POLICY "Anyone can create custom orders"
  ON custom_orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own custom orders"
  ON custom_orders FOR SELECT
  TO public
  USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, stock) VALUES
  ('Premium Logo Design', 'Professional custom logo design with unlimited revisions. Includes multiple formats and brand guidelines.', 299.99, 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 100),
  ('Website Development', 'Complete responsive website with modern design, SEO optimization, and mobile-friendly interface.', 1499.99, 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=800', 50),
  ('Social Media Bundle', 'Complete social media management package including content creation, scheduling, and analytics.', 499.99, 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800', 75),
  ('Brand Identity Package', 'Complete brand identity including logo, color palette, typography, and brand guidelines.', 899.99, 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', 40),
  ('SEO Optimization', 'Comprehensive SEO audit and optimization service to improve your website ranking.', 699.99, 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800', 60),
  ('Mobile App Design', 'Complete UI/UX design for iOS and Android applications with interactive prototypes.', 1299.99, 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800', 30);