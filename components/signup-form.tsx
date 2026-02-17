"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react"; // optional Google login
import Link from "next/link";



const handleGoogleSignIn = async () => {
   await signOut({redirect: false});
   signIn("google", {
    prompt: "select_account",
    callbackUrl: "/",  // where to go after login
  });

}
export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      username: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm-password"),
    };
    const register_data = {
         username: data.username,
         email: data.email,
         password: data.password,
      }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register_data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.message || "Something went wrong");
      } else {
        setError(""); 
        await signIn("credentials", {
               email: data.email,
               password: data.password,
               redirect: true,
               callbackUrl: "/",
        })
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };
 const {data: session} = useSession();
   if (session) 
      return ( 
          <div>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
      );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"></CardTitle>
          <CardDescription>
             <Button variant="outline" size={"lg"} className="py-4" onClick={() => handleGoogleSignIn()}>
                    Sign in with Google
                  </Button>
                  <p className="text-xl py-6">Or</p>
                  <p className="font-bold text-xl text-black">Create your account</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
                 
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" name="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input id="confirm-password" name="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>
              {error && <FieldDescription className="text-red-500 text-center">{error}</FieldDescription>}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </Field>
              <Field>
                  <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href={"/login"}>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
                 
        </CardContent>
      </Card>
 
    </div>
  );
}

