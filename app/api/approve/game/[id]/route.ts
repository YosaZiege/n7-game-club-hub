import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

   const { id } = await params;
  const session : any = await getServerSession(authOptions as any);

  if (!session?.user || session.user.role !== "president") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await _req.json().catch(() => ({}));
  const approved = Boolean(body?.approved);

  const game = await prisma.game.update({
    where: { id: id },
    data: { approved },
    select: { id: true, approved: true },
  });

  return NextResponse.json(game);
}

