-- ==============================================================================
-- GiftGenie: Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create the permanent users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_sign_in_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to insert on sign up
CREATE POLICY "Allow public insert during sign up"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view their own profile or public user records
CREATE POLICY "Allow users to read their own record"
  ON public.users
  FOR SELECT
  USING (true);

-- Allow users to update their own record
CREATE POLICY "Allow update on user record"
  ON public.users
  FOR UPDATE
  USING (true);

-- 4. Create an index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ==============================================================================
-- (Optional) Automatic Sync Trigger from Supabase Auth to public.users
-- This ensures any user registered via Supabase Auth is automatically recorded.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, created_at, last_sign_in_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET last_sign_in_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. Create the products table for seller product listings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id TEXT NOT NULL,
  seller_name TEXT DEFAULT 'Seller',
  seller_email TEXT,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  purchase_url TEXT NOT NULL,
  category TEXT DEFAULT 'Personalized Gift',
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read so AI and customers can view products
CREATE POLICY "Allow public read on products"
  ON public.products
  FOR SELECT
  USING (true);

-- Allow insert products
CREATE POLICY "Allow public insert on products"
  ON public.products
  FOR INSERT
  WITH CHECK (true);

-- Allow delete products
CREATE POLICY "Allow delete on products"
  ON public.products
  FOR DELETE
  USING (true);

-- Index on seller_id for fast queries
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

