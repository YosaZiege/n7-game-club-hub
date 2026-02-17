import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { signToken } from "@/lib/paseto";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.hashedPassword)
    return new Response("Invalid credentials", { status: 401 });

  const valid = await argon2.verify(user.hashedPassword, password);
  if (!valid)
    return new Response("Invalid credentials", { status: 401 });

  const token = await signToken({
    sub: user.id,
    role: user.role,
  });

  const res = new Response("OK");
  res.headers.append(
    "Set-Cookie",
    `access_token=${token}; HttpOnly; Path=/; Secure`
  );

  return res;
}

