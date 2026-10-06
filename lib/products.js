import fs from "fs";
import path from "path";
import { isSupabaseConfigured, getServiceSupabase, supabase } from "./supabase";
import connectDB from "./mongodb";
import Product from "@/models/Product";
import User from "@/models/User";

const LOCAL_DB_DIR = path.join(process.cwd(), ".data");
const LOCAL_PRODUCTS_FILE = path.join(LOCAL_DB_DIR, "products.json");
const LOCAL_USERS_FILE = path.join(LOCAL_DB_DIR, "users.json");

function getLocalData(filePath) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error(`Local read error (${filePath}):`, err);
    return [];
  }
}

function saveLocalData(filePath, data) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Local save error (${filePath}):`, err);
  }
}

/**
 * Create a new product listing from a seller
 */
export async function createProduct({
  sellerId,
  sellerName,
  sellerEmail,
  title,
  description,
  price,
  purchaseUrl,
  category = "Personalized Gift",
  tags = [],
}) {
  const timestamp = new Date().toISOString();
  const cleanTags = Array.isArray(tags)
    ? tags.map((t) => String(t).trim()).filter(Boolean)
    : String(tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  // 1. Supabase
  if (isSupabaseConfigured) {
    const client = getServiceSupabase() || supabase;
    const { data, error } = await client
      .from("products")
      .insert({
        seller_id: sellerId,
        seller_name: sellerName || "Seller",
        seller_email: sellerEmail || "",
        title: title.trim(),
        description: description?.trim() || "",
        price: price.trim(),
        purchase_url: purchaseUrl.trim(),
        category: category.trim(),
        tags: cleanTags.join(", "),
        created_at: timestamp,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to save product in Supabase.");
    }

    return {
      id: data.id,
      sellerId: data.seller_id,
      sellerName: data.seller_name,
      sellerEmail: data.seller_email,
      title: data.title,
      description: data.description,
      price: data.price,
      purchaseUrl: data.purchase_url,
      category: data.category,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      createdAt: data.created_at,
    };
  }

  // 2. MongoDB
  if (process.env.MONGODB_URI) {
    await connectDB();
    const newProduct = await Product.create({
      sellerId,
      sellerName: sellerName || "Seller",
      sellerEmail: sellerEmail || "",
      title: title.trim(),
      description: description?.trim() || "",
      price: price.trim(),
      purchaseUrl: purchaseUrl.trim(),
      category: category.trim(),
      tags: cleanTags,
    });

    return {
      id: newProduct._id.toString(),
      sellerId: newProduct.sellerId,
      sellerName: newProduct.sellerName,
      sellerEmail: newProduct.sellerEmail,
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      purchaseUrl: newProduct.purchaseUrl,
      category: newProduct.category,
      tags: newProduct.tags,
      createdAt: newProduct.createdAt.toISOString(),
    };
  }

  // 3. Local Development Fallback
  const products = getLocalData(LOCAL_PRODUCTS_FILE);
  const newProduct = {
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sellerId,
    sellerName: sellerName || "Seller",
    sellerEmail: sellerEmail || "",
    title: title.trim(),
    description: description?.trim() || "",
    price: price.trim(),
    purchaseUrl: purchaseUrl.trim(),
    category: category.trim(),
    tags: cleanTags,
    createdAt: timestamp,
  };

  products.unshift(newProduct);
  saveLocalData(LOCAL_PRODUCTS_FILE, products);
  return newProduct;
}

/**
 * Get products (all or filtered by sellerId)
 */
export async function getProducts({ sellerId } = {}) {
  // 1. Supabase
  if (isSupabaseConfigured) {
    const client = getServiceSupabase() || supabase;
    let query = client.from("products").select("*").order("created_at", { ascending: false });
    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Supabase get products error:", error.message);
      return [];
    }
    return (data || []).map((p) => ({
      id: p.id,
      sellerId: p.seller_id,
      sellerName: p.seller_name,
      sellerEmail: p.seller_email,
      title: p.title,
      description: p.description,
      price: p.price,
      purchaseUrl: p.purchase_url,
      category: p.category,
      tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
      createdAt: p.created_at,
    }));
  }

  // 2. MongoDB
  if (process.env.MONGODB_URI) {
    await connectDB();
    const filter = sellerId ? { sellerId } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return products.map((p) => ({
      id: p._id.toString(),
      sellerId: p.sellerId,
      sellerName: p.sellerName,
      sellerEmail: p.sellerEmail,
      title: p.title,
      description: p.description,
      price: p.price,
      purchaseUrl: p.purchaseUrl,
      category: p.category,
      tags: p.tags,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  // 3. Local Development Fallback
  const products = getLocalData(LOCAL_PRODUCTS_FILE);
  if (sellerId) {
    return products.filter((p) => p.sellerId === sellerId);
  }
  return products;
}

/**
 * Delete a product listing by ID
 */
export async function deleteProduct(id, sellerId = null) {
  // 1. Supabase
  if (isSupabaseConfigured) {
    const client = getServiceSupabase() || supabase;
    let query = client.from("products").delete().eq("id", id);
    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }
    const { error } = await query;
    if (error) throw new Error(error.message);
    return true;
  }

  // 2. MongoDB
  if (process.env.MONGODB_URI) {
    await connectDB();
    const filter = sellerId ? { _id: id, sellerId } : { _id: id };
    await Product.deleteOne(filter);
    return true;
  }

  // 3. Local Development Fallback
  let products = getLocalData(LOCAL_PRODUCTS_FILE);
  products = products.filter((p) => {
    if (p.id !== id) return true;
    if (sellerId && p.sellerId !== sellerId) return true;
    return false;
  });
  saveLocalData(LOCAL_PRODUCTS_FILE, products);
  return true;
}

/**
 * Get Platform metrics for Admin dashboard
 */
export async function getPlatformStats() {
  const users = await getAllUsers();
  const products = await getProducts();

  const totalUsers = users.length;
  const totalSellers = users.filter((u) => u.role === "seller").length;
  const totalProducts = products.length;

  return {
    totalUsers,
    totalSellers,
    totalProducts,
  };
}

/**
 * Get all users for Admin dashboard
 */
export async function getAllUsers() {
  // 1. Supabase
  if (isSupabaseConfigured) {
    const client = getServiceSupabase() || supabase;
    const { data, error } = await client
      .from("users")
      .select("id, name, email, role, created_at, last_sign_in_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase getAllUsers error:", error.message);
      return [];
    }
    return (data || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || "user",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
    }));
  }

  // 2. MongoDB
  if (process.env.MONGODB_URI) {
    await connectDB();
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "user",
      createdAt: u.createdAt.toISOString(),
      lastSignInAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    }));
  }

  // 3. Local Development Fallback
  const users = getLocalData(LOCAL_USERS_FILE);
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || "user",
    createdAt: u.createdAt,
    lastSignInAt: u.lastSignInAt,
  }));
}

/**
 * Delete a user by ID (Admin)
 */
export async function deleteUser(id) {
  // 1. Supabase
  if (isSupabaseConfigured) {
    const client = getServiceSupabase() || supabase;
    const { error } = await client.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }

  // 2. MongoDB
  if (process.env.MONGODB_URI) {
    await connectDB();
    await User.deleteOne({ _id: id });
    return true;
  }

  // 3. Local Development Fallback
  let users = getLocalData(LOCAL_USERS_FILE);
  users = users.filter((u) => u.id !== id);
  saveLocalData(LOCAL_USERS_FILE, users);
  return true;
}
