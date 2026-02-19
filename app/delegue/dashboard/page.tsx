import { prisma } from "@/lib/prisma";
import DelegueTable from "./table";

export default async function Page() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      approved: true,
      createdAt: true,
      creator: { select: { username: true } },
    },
  });

  return (
    <div className="p-8 w-full mx-auto ml-2">
      <h1 className="text-3xl font-bold mb-2 text-center">Délégué Dashboard</h1>
      <p className="text-muted-foreground mb-6">
      </p>

      <DelegueTable initialGames={games} />
    </div>
  );
}

