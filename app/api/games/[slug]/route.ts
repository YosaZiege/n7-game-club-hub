import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }>  }
) {
    const { slug } = await params;
  const game = await prisma.game.findUnique({
    where: { slug:  slug},
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      zipUrl: true,
      imageUrl: true,
      creatorImage: true,
         entryFile: true,
      creator: { select: { username: true } },
      tags: { select: { tag: { select: { name: true } } } },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game);
}

