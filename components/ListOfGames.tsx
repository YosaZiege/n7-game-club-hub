import { gameCardData, GameCardData } from "@/lib/data";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";


const ListOfGames = () => {
   const game_cards: GameCardData[] = gameCardData;
   return (
      <div id="games" className="flex flex-col gap-4 justify-center items-center w-full ">
         <p className="text-4xl font-bold text-center ">Featured Games</p>
         <p className="text-md font-semibold text-gray-500 text-center "> Discover some of the games from the community</p>
         <div className=" flex flex-row justify-between gap-y-4 flex-wrap">
            {game_cards.map((game, index) => (
               <Card className="w-full max-w-sm p-0 rounded-t-md h-[550px] m-0 " key={index}>
                  <CardHeader className="p-0 w-full h-[300px]">
                     <div className="relative w-full overflow-hidden h-[300px]">
                        <Image
                           src={game.thumbnail}
                           alt="game thumbnail"
                           width={500} // optional for Next.js sizing
                           height={300} // keeps aspect ratio
                           className="w-full  object-cover rounded-t-md"
                        />
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     <p className="font-bold text-lg">{game.title}</p>
                     <div className="flex flex-row gap-4 items-center">
                        <Avatar>
                           <AvatarImage src={game.creator_image} />
                           <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="text-md text-gray-500 font-light">{game.creator}</p>
                     </div>
                     <div className="flex flex-row gap-2">
                        {game.tags.map((tag, index) => (
                           <Badge
                              key={index}
                              variant="default"
                              className=" px-2 bg-white text-black hover:text-white border-black hover:bg-black "
                           >{tag}</Badge>))}
                     </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">

                  </CardFooter>
               </Card>

            ))
            }
         </div>
      </div>
   )
}

export default ListOfGames
