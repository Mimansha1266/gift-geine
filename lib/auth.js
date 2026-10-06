import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { isSupabaseConfigured, getServiceSupabase, supabase } from "./supabase";
import connectDB from "./mongodb";
import User from "@/models/User";

const LOCAL_DB_DIR = path.join(process.cwd(), ".data");
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, "users.json");

function getLocalUsers() {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    let users = [];
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      users = JSON.parse(data || "[]");
    }
    if (!users.some((u) => u.email === "admin@giftgenie.com")) {
      const defaultAdmin = {
        id: "usr_admin_001",
        name: "GiftGenie Owner",
        email: "admin@giftgenie.com",
        password: bcrypt.hashSync("admin12345", 10),
        role: "admin",
        createdAt: new Date().toISOString(),
        lastSignInAt: new Date().toISOString(),
      };
      users.unshift(defaultAdmin);
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(users, null, 2), "utf-8");
    }
    return users;
  } catch (err) {
    console.error("Local database read error:", err);
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Local database save error:", err);
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationInput({ name, email, password }) {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address.";
  }
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  return null;
}

export function validateLoginInput({ email, password }) {
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address.";
  }
  if (!password) {
    return "Password is required.";
  }
  return null;
}

/**
 * Register a user and save record to database (Supabase or MongoDB)
 */
export async function registerUser({ name, email, password, role = "user" }) {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();

  // 1. Prioritize Supabase if configured
  if (isSupabaseConfigured) {
    const adminClient = getServiceSupabase();
    const client = adminClient || supabase;

    // Use Supabase Auth
    let authUser = null;
    let authError = null;

    if (adminClient?.auth?.admin) {
      const { data, error } = await adminClient.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: { name: cleanName, role },
      });
      authUser = data?.user;
      authError = error;
    } else {
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { name: cleanName, role },
        },
      });
      authUser = data?.user;
      authError = error;
    }

    if (authError) {
      throw new Error(authError.message || "Failed to create account in Supabase.");
    }

    if (!authUser?.id) {
      throw new Error("Unable to create user ID in Supabase Auth.");
    }

    const userId = authUser.id;

    // Store in public.users table for permanent record
    try {
      const { error: dbError } = await client.from("users").upsert(
        {
          id: userId,
          name: cleanName,
          email: cleanEmail,
          role,
          created_at: timestamp,
          last_sign_in_at: timestamp,
        },
        { onConflict: "id" }
      );

      if (dbError) {
        console.warn("Supabase users table insert warning:", dbError.message);
      }
    } catch (insertErr) {
      console.warn("Supabase users table record warning:", insertErr.message);
    }

    return {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      role,
      createdAt: timestamp,
      lastSignInAt: timestamp,
      provider: "supabase",
    };
  }

  // 2. Fallback to MongoDB if MONGODB_URI is configured
  if (process.env.MONGODB_URI) {
    await connectDB();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role,
      lastLoginAt: new Date(),
    });

    return {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt.toISOString(),
      lastSignInAt: newUser.lastLoginAt.toISOString(),
      provider: "mongodb",
    };
  }

  // 3. Local Development Fallback Database (when neither Supabase nor MongoDB is set up yet)
  const localDb = getLocalUsers();
  const existingUser = localDb.find((u) => u.email === cleanEmail);
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    password: hashedPassword,
    role,
    createdAt: timestamp,
    lastSignInAt: timestamp,
  };

  localDb.push(newUser);
  saveLocalUsers(localDb);

  console.log(
    `[GiftGenie Auth] User registered in local dev database: ${cleanEmail}. (To use cloud storage, set Supabase or MongoDB in .env.local)`
  );

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
    lastSignInAt: newUser.lastSignInAt,
    provider: "local-dev",
  };
}

/**
 * Log in a user and update their timestamp in the database
 */
export async function loginUser({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();

  // 0. Master Owner / Admin Credential Bypass
  const adminKey = process.env.ADMIN_API_KEY || "admin12345";
  if (
    cleanEmail === "admin@giftgenie.com" &&
    (password === "admin12345" || password === adminKey)
  ) {
    return {
      id: "usr_admin_001",
      name: "GiftGenie Owner",
      email: "admin@giftgenie.com",
      role: "admin",
      lastSignInAt: timestamp,
      provider: "admin-master",
    };
  }

  // 1. Supabase Auth & DB
  if (isSupabaseConfigured) {
    const adminClient = getServiceSupabase();
    const client = adminClient || supabase;

    const { data: authData, error: authError } =
      await client.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (authError || !authData?.user) {
      throw new Error(authError?.message || "Invalid email or password.");
    }

    const userId = authData.user.id;
    let userName = authData.user.user_metadata?.name || "";
    let userRole = authData.user.user_metadata?.role || "user";

    // Update permanent record in Supabase users table
    try {
      const { data: existingUser } = await client
        .from("users")
        .select("name, role")
        .eq("id", userId)
        .maybeSingle();

      if (existingUser?.name) {
        userName = existingUser.name;
      }
      if (existingUser?.role) {
        userRole = existingUser.role;
      }

      await client.from("users").upsert(
        {
          id: userId,
          name: userName || "User",
          email: cleanEmail,
          role: userRole,
          last_sign_in_at: timestamp,
        },
        { onConflict: "id" }
      );
    } catch (dbErr) {
      console.warn("Supabase users update timestamp error:", dbErr.message);
    }

    return {
      id: userId,
      name: userName || "User",
      email: cleanEmail,
      role: userRole,
      lastSignInAt: timestamp,
      provider: "supabase",
    };
  }

  // 2. MongoDB Auth & DB
  if (process.env.MONGODB_URI) {
    await connectDB();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    user.lastLoginAt = new Date();
    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      lastSignInAt: user.lastLoginAt.toISOString(),
      provider: "mongodb",
    };
  }

  // 3. Local Development Fallback Database
  const localDb = getLocalUsers();
  const user = localDb.find((u) => u.email === cleanEmail);
  if (!user) {
    throw new Error(
      "No account found with this email. Please click 'Create Account' to sign up first!"
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password. Please try again.");
  }

  user.lastSignInAt = timestamp;
  saveLocalUsers(localDb);

  console.log(`[GiftGenie Auth] User logged in via local dev database: ${cleanEmail}`);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastSignInAt: user.lastSignInAt,
    provider: "local-dev",
  };
}
