import GamePlayer from "@/components/GamePlayer";
import Link from "next/link";
import { notFound } from "next/navigation";

type Game = {
  title: string;
  slug: string;
  zipUrl: string;
  imageUrl?: string | null;
  entryFile: string;
  description?: string | null;
  creator: { username?: string | null };
};

async function getGame(slug: string): Promise<Game | null> {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/games/${slug}`)

  if (!res.ok) return null;
  return res.json();
}

export default async function GamePage({
  params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    if (!slug) {
    return notFound();
  }
  const game = await getGame(slug);
   console.log(game)
   if (!game) return notFound();

  // For now: assume you extracted ZIP to /public/games/[slug]/index.html
    const gameUrl = `/games/${game.slug}/${game.entryFile}`;
   
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <div className="p-4 bg-zinc-800 flex items-center justify-between">
        <h1 className="font-bold text-blue-500">{game.title}</h1>
        <span className="text-sm text-zinc-400">
          by {game.creator?.username ?? "Unknown"}
        </span>
            <Link href="/">
            <span>
               Return Home
            </span>
</Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        {game.description && (
          <p className="max-w-3xl text-center text-zinc-300">
            {game.description}
          </p>
        )}

        <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden">
         <GamePlayer src={gameUrl}/>
        </div>
      </div>
    </div>
  );
}

