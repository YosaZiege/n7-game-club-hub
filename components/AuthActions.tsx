"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

type AuthActionProps = {
  variant?: "desktop" | "mobile";
};

export function AuthAction({ variant = "desktop" }: AuthActionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <div className="h-9 w-24" />;
  }

  // ✅ Logged in → show avatar
  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 rounded-full hover:bg-muted p-1 transition"
      >
        <Image
          src={session.user.image ?? "/images/personne.svg"}
          alt="Avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        {variant === "mobile" && (
          <span className="text-sm font-medium">
            {session.user.name?.split(" ")[0]}
          </span>
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={()=> {router.push("/signup")}} // or signIn("google")
      size="sm"
      className="bg-blue-500 hover:bg-blue-600 rounded-xl"
    >
      Sign up
    </Button>
  );
}

