

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
      <div className="flex flex-col gap-4 w-full mx-auto">
         {children}
      </div>
  );
}
