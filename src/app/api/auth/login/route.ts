import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return NextResponse.redirect(
        new URL("/login?error=Email dan password harus diisi", req.url)
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=Email atau password salah", req.url)
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.redirect(
        new URL("/login?error=Email atau password salah", req.url)
      );
    }

    await createSession(Number(user.id), user.role);

    return NextResponse.redirect(new URL("/home", req.url));
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(
      new URL("/login?error=Terjadi kesalahan server", req.url)
    );
  }
}
