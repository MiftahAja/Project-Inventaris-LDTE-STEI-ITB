import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password) {
      return NextResponse.redirect(
        new URL("/register?error=Semua field harus diisi", req.url)
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.redirect(
        new URL("/register?error=Password tidak cocok", req.url)
      );
    }

    if (password.length < 6) {
      return NextResponse.redirect(
        new URL("/register?error=Password harus minimal 6 karakter", req.url)
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.redirect(
        new URL("/register?error=Email sudah terdaftar", req.url)
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role petugas
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "petugas",
      },
    });

    // Create session
    await createSession(Number(user.id), user.role);

    return NextResponse.redirect(new URL("/home", req.url));
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.redirect(
      new URL("/register?error=Terjadi kesalahan server", req.url)
    );
  }
}
