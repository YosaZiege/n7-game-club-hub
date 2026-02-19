"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signIn, signOut, useSession } from "next-auth/react";
import {
   Field,
   FieldDescription,
   FieldGroup,
   FieldLabel,
   FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const { data: session } = useSession();
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/",
         });
         if (result?.error) {
            setError("Invalid email or password");
         } else {
            router.push("/");
            router.refresh();
         }
      } catch (error) {
         setError("An error occurred. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   if (session) {
      return (
         <div className="flex flex-col items-center gap-4 p-8">
            <p>Signed in as {session.user.email}</p>
            <Button onClick={() => signOut()}>Sign Out</Button>
         </div>
      );
   }

   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
               <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                  <FieldGroup>
                     <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                     </div>

                     {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                           {error}
                        </div>
                     )}

                     <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                           id="email"
                           type="email"
                           placeholder="m@example.com"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           disabled={isLoading}
                        />
                     </Field>

                     <Field>
                        <div className="flex items-center">
                           <FieldLabel htmlFor="password">Password</FieldLabel>
                           <p
                              onClick={() =>
                                 alert("Forgot your password?\n\nPlease contact: +212 6 09 39 88 30")
                              }
                              className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer"
                           >
                              Forgot your password?
                           </p>
                        </div>
                        <Input
                           id="password"
                           type="password"
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           disabled={isLoading}
                        />
                     </Field>

                     <Field>
                        <Button type="submit" disabled={isLoading}>
                           {isLoading ? "Loading..." : "Login"}
                        </Button>
                     </Field>

                     <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                        Or continue with
                     </FieldSeparator>

                     <Field className="w-full">
                        <Button
                           variant="outline"
                           type="button"
                           onClick={() => signIn("google")}
                           disabled={isLoading}
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                              <path
                                 d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                 fill="currentColor"
                              />
                           </svg>
                           Login with Google
                        </Button>
                     </Field>

                     <FieldDescription className="text-center">
                        Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                     </FieldDescription>
                  </FieldGroup>
               </form>

               <div className="bg-muted relative hidden md:block">
                  <Image
                     src="/images/personne.svg"
                     alt="person"
                     fill
                     className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
