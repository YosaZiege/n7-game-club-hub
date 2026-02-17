import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
const Footer = () => {
   return (
      <section
         className="
        relative 
        w-full 
        min-h-[60vh] 
        bg-contain
        flex 
        items-center 
        justify-center
      "
         style={{
            backgroundImage: "url('/images/test2.svg')",
         }}
      >         <div className="w-full max-w-[1200px]">
            <div className="flex flex-col justify-start gap-4">
               <div className="cursor-pointer">
                  <Image src="/logo.png" alt="logo N7GC" width={80} height={80} />
               </div>
               <p className="text-gray-400">Empowering Indie Enset Game Developers</p>
               <div className="flex flex-row w-full gap-2">
                  <div className="w-[40px] h-[40px] border border-white rounded-md p-2 text-center">
                     <FaLinkedinIn className="text-white " />
                  </div>
                  <div className="w-[40px] h-[40px] border border-white rounded-md p-2 text-center">
                     <FaDiscord className="text-white " />
                  </div>
                  <div className="w-[40px] h-[40px] border border-white rounded-md p-2 text-center">
                  </div>
                  <div className="w-[40px] h-[40px] border border-white rounded-md p-2 text-center">
                  </div>
               </div>
            </div>
            <div></div>
            <div></div>
            <div></div>
         </div>
         <div></div>
      </section>
   )
}

export default Footer
