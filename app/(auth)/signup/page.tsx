import { SignupForm } from "@/components/signup-form"
import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"


export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-12  items-center justify-center rounded-md">
                  <Image src={"/logo.png"} alt="logo" width={40} height={40}/>
          </div>
          N7 Gaming Club.
        </a>
        <SignupForm />
      </div>
    </div>
  )
}

