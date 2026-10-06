import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("giftgenie_user_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ success: true, user: null });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: true, user: null });
  }
}
