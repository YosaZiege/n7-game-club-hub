import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import ListOfGames from "@/components/ListOfGames"
import Navbar from "@/components/Navbar"

const page = () => {
   return (
      <div className="w-full">
         <Navbar />
         <div className=" mt-40 max-w-[1200px] mx-auto  h-min-screen  flex flex-col gap-20 mb-40">
            <Hero />
            <ListOfGames />
         </div>
         {/*<Footer />*/}
      </div>
   )
}

export default page
