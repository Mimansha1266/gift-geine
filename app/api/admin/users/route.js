import { NextResponse } from "next/server";
import { getAllUsers, deleteUser } from "@/lib/products";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin get users error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load users." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    await deleteUser(id);
    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user." },
      { status: 500 }
    );
  }
}
