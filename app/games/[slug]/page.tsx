import fs from "fs"
import path from "path"

export function generateStaticParams() {
   const gamesDir = path.join(process.cwd(), "public/games")

   const slugs = fs
      .readdirSync(gamesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => ({ slug: d.name }))

   return slugs
}

export default function GamePage({
   params,
}: {
   params: { slug: string }
}) {
   const gameUrl = `/games/${params.slug}/index.html`

   return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
         <div className="p-4 bg-zinc-800 flex justify-between">

         </div>

         <div className="flex-1 flex justify-center items-center p-4">
            <div className="w-full max-w-5xl aspect-video bg-black">
               <iframe
                  src={gameUrl}
                  className="w-full h-full border-none"
                  allow="fullscreen"
               />
            </div>
         </div>
      </div>
   )
}

