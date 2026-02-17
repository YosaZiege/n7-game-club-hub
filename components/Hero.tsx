import { ArrowRight, Upload } from "lucide-react"
import { Button } from "./ui/button"

const Hero = () => {
  return (
    <div className="flex flex-col   gap-6  ">
         <p className="font-mono font-bold lg:text-6xl text-4xl">N7GAME <br/> CLUB</p>

         <p className="font-mono text-gray-500 lg:text-xl text-lg">Discover, Play and Share Incredible Indie Games</p>
         <div className="flex space-x-2">
         <Button className="w-fit py-6 px-8 lg:px-12  bg-blue-500 shadow-sm hover:bg-blue-600"> Explore Games <ArrowRight /></Button>
         <Button className="w-fit py-6 px-8 lg:px-12 hover:bg-gray-200" variant="outline" > <Upload/> Upload Your Game</Button>
</div>
      </div>
  )
}

export default Hero
