import Image from "next/image";

import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";
import { Hamburger } from "lucide-react";
import { AuthAction } from "./AuthActions";
const Navbar = () => {
   const user = "static_for_now";
   const imageUrl = "./images/cover.svg"
   
   return (
         <div className="flex flex-row w-full mx-auto px-4 items-center p-2 justify-between border-b  ">
            <div className="cursor-pointer">
            <Link href="/">  <Image src="logo.svg" alt="logo N7GC" width={80} height={80} /></Link> 
            </div>
            <div className="hidden md:flex flex-row gap-6  items-center">
            {/* <Link href={"/gallery"}>  <p className="navbar-tag"> Game Gallery</p></Link>*/}
               <Link href={`/upload`} >               <p className="navbar-tag">Upload Game</p></Link>
               <AuthAction variant="desktop"></AuthAction>
            </div>
            <div className="md:hidden display ">
               <Sheet >
                  <SheetTrigger><Hamburger className="" /></SheetTrigger>
                  <SheetTitle className="hidden">Menu</SheetTitle>
                  <SheetContent className="py-6">
                     <SheetHeader>
                        <Link href={"/gallery"}>  <p className="navbar-tag text-center"> Game Gallery</p></Link>
                     </SheetHeader>
                     <SheetHeader>
                        <Link href={`/upload/${user}`} >               <p className="navbar-tag text-center">Upload Game</p></Link>
                     </SheetHeader>
                     <SheetHeader>
                        <AuthAction variant="mobile"></AuthAction>                     </SheetHeader>
                  </SheetContent>
               </Sheet>
            </div>
         </div>
   )
}

export default Navbar
