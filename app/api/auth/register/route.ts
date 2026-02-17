import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   const { email, username, password } = await req.json();

   const hashedPassword = await argon2.hash(password);

   const user = await prisma.user.create({
      data: { email, username, hashedPassword },
   });

   return NextResponse.json({ id: user.id });
}

