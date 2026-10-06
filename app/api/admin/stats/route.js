import { NextResponse } from "next/server";
import { getPlatformStats } from "@/lib/products";

export async function GET() {
  try {
    const stats = await getPlatformStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load stats." },
      { status: 500 }
    );
  }
}
