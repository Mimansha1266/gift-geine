import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_API_KEY .env.local file me missing hai.",
        },
        { status: 500 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin password required hai.",
        },
        { status: 400 }
      );
    }

    if (password !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin password.",
        },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: "giftgenie_admin",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin login successful.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to login.",
      },
      { status: 500 }
    );
  }
}