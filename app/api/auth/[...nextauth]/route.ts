
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user exists in DB, create if not
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email!,
            username: user.name || user.email!.split("@")[0],
            googleId: user.id,
            role: "STUDENT", // default role
          },
        });
      }

      return true;
    },

    async session({ session }) {
      // Add custom fields to session
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user!.email! },
      });
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.role = dbUser.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

