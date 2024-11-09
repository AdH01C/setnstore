import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { serialize } from "cookie";

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: "No accessToken found in session" },
      { status: 400 }
    );
  }

  // Serialize the accessToken as a cookie
  const cookie = serialize("sessionToken", session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
