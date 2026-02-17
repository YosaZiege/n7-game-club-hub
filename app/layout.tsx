"use client"
import type { Metadata } from "next";
import "./globals.css";
import { departureMono, departurePropo } from "@/lib/fonts";
import { SessionProvider } from "next-auth/react";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
// export const metadata: Metadata = {
//   title: "N7-hub : Display your godot Games !!",
//   description: "Made for Game Developers to show case their games",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${departureMono.variable} ${departurePropo.variable} antialiased`}
      >

<SessionProvider >   
               {children}
</SessionProvider>

      </body>
    </html>
  );
}
