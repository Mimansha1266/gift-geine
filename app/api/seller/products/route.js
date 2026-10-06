import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createProduct, getProducts, deleteProduct } from "@/lib/products";

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("giftgenie_user_session");
  if (!sessionCookie?.value) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  try {
    const user = await getSessionUser();
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId") || user?.id || null;

    const products = await getProducts(sellerId ? { sellerId } : {});
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Get seller products error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    const {
      title,
      description,
      price,
      purchaseUrl,
      category = "Personalized Gift",
      tags = [],
    } = body;

    if (!title?.trim() || !price?.trim() || !purchaseUrl?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, Price, and Purchase URL are required.",
        },
        { status: 400 }
      );
    }

    const sellerId = user?.id || body.sellerId || "seller_demo";
    const sellerName = user?.name || body.sellerName || "GiftGenie Seller";
    const sellerEmail = user?.email || body.sellerEmail || "";

    const product = await createProduct({
      sellerId,
      sellerName,
      sellerEmail,
      title,
      description,
      price,
      purchaseUrl,
      category,
      tags,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product listed successfully!",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    // Only allow owner seller or admin
    const sellerId = user?.role === "admin" ? null : user?.id;
    await deleteProduct(id, sellerId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
