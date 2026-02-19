import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  if (!email || !username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const hashedPassword = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, username, hashedPassword },
      select: {id: true, email:true, username:true},
  });

  return NextResponse.json(user);
}
