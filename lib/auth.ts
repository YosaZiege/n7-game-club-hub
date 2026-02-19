// lib/auth.ts
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import argon2 from "argon2";
export async function ensureAdminExists() {
  const adminEmail = "admin@n7gamehub.com";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashedPassword = await argon2.hash("ChangeThisPassword123!");

    await prisma.user.create({
      data: {
        email: adminEmail,
        username: "president",
        hashedPassword,
        role: "president",
      },
    });

    console.log("Admin auto-created");
  }
}
export const authOptions: NextAuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials: any) {
            const email = credentials?.email;
            const password = credentials?.password;
            if (!email || !password) return null;
            const user = await prisma.user.findUnique({
               where: { email:  email},
            });

             if (!user) return null;
         if (!user.hashedPassword) return null;
            const ok = await argon2.verify(user.hashedPassword, password);
        if (!ok) return null;
        return { id: user.id, email: user.email, username: user.username, role: user.role };

         },
      }),
   ],
   callbacks: {
      async signIn({ user, account }) {
         if (account?.provider === "google") {
            const existingUser = await prisma.user.findUnique({
               where: { email: user.email! },
            });
            if (!existingUser) {
               await prisma.user.create({
                  data: {
                     email: user.email!,
                     username: user.name || user.email!.split("@")[0],
                     googleId: user.id,
                     role: "STUDENT",
                  },
               });
            } else if (!existingUser.googleId) {
               await prisma.user.update({
                  where: { email: user.email! },
                  data: { googleId: user.id },
               });
            }
         }
         return true;
      },
      async jwt({ token, user }: any) {
         if (user) {
            token.id = user.id;
            token.role = user.role;
            token.accessToken = user.token;
            token.username = user.username;
         }
         return token;
      },
      async session({ session, token }: any) {
         if (session.user) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.accessToken = token.accessToken as string;
            session.user.username = token.username as string;
         }
         return session;
      },
   },
   session: {
      strategy: "jwt",
   },
   secret: process.env.NEXTAUTH_SECRET,
   pages: {
      signIn: "/login",
      error: "/login",
   },
};
