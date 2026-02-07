import FullScreenButton from "@/components/FullScreenButton";

export default async function Page({ params }: { params: string }) {

   const slug = await params;
   const gameUrl = `/games/${slug}/BlindCowboy.html`
   return (
      <div className="w-full h-screen ml-20 p-10">
         <h1 className="font-bold text-xl text-blue-500 text-center">N7-Game Club Hub</h1>

         <FullScreenButton />

         <iframe
            id="game-frame"
            src={gameUrl}
            className=" w-full p-6 mx-auto max-w-6xl h-min-screen h-full"
            allow="fullscreen"
         />
      </div>
   )
}
