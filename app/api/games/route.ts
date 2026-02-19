import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const games = await prisma.game.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      createdAt: true,
      entryFile: true,
      creator: { select: { username: true } },
      tags: { select: { tag: { select: { name: true } } } },
    },
  });

  return NextResponse.json(games);
}

