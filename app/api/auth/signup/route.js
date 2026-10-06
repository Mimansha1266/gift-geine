import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerUser, validateRegistrationInput } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "user" } = body;

    const validationError = validateRegistrationInput({ name, email, password });
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, password, role });

    // Set secure session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "giftgenie_user_session",
      value: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to complete sign-up.",
      },
      { status: 400 }
    );
  }
}
