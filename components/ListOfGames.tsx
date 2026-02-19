import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Game = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  creator: { username: string | null };
  tags: { tag: { name: string } }[];
};

async function getGames(): Promise<Game[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/games`, {
    // static by default; use revalidate if you want ISR
      cache: "no-store",
   });

  if (!res.ok) return [];
console.log(res)
  return res.json();
}

export default async function ListOfGames() {
  const games = await getGames();

  return (
    <div id="games" className="h-full flex flex-col gap-4 justify-center items-center w-full ">
      <p className="text-4xl font-bold text-center">Featured Games</p>
      <p className="text-md font-semibold text-gray-500 text-center">
        Discover some of the games from the community
      </p>

      <div className=" flex flex-row flex-wrap gap-6 w-full max-w-7xl pt-10">
        {games.map((game) => (
          <Card
            key={game.id}
            className="
              w-full max-w-sm p-0 rounded-t-md h-[550px]
              transition-transform duration-200 ease-out
              hover:scale-[1.03] hover:shadow-xl 
            "
          >
            {/* Thumbnail */}
            <CardHeader className="p-0 w-full h-[300px]">
              <div className="relative w-full overflow-hidden h-[300px]">
                {game.imageUrl ? (
                  <Image
                    src={game.imageUrl}
                    alt={`${game.title} thumbnail`}
                    fill
                    className="object-cover rounded-t-md"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                    No thumbnail
                  </div>
                )}

              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-3 pt-6">
              <p className="font-bold text-lg line-clamp-1">{game.title}</p>

              <div className="flex flex-row gap-3 space-y-3 items-center ">
                <Avatar className="w-8 h-8">
                  {/* If you later store creator image, plug it here */}
                  <AvatarImage src={undefined} />
                  <AvatarFallback>
                    {game.creator?.username?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-500 font-light">
                  {game.creator?.username ?? "Unknown"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-10">
                {game.tags.map(({ tag }) => (
                  <Badge
                    key={tag.name}
                    variant="secondary"
                    className="px-2 border"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="mt-auto p-4">
              <Link href={`/play/${game.slug}`} className="w-full">
                <Button className="w-full">▶ Play</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {games.length === 0 && (
          <p className="text-zinc-500 col-span-full text-center">
            No games yet. Be the first to upload one!
          </p>
        )}
      </div>
    </div>
  );
}

