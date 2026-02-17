import localFont from "next/font/local";

export const departureMono = localFont({
  src: [
    {
      path: "../public/fonts/departure-mono/DepartureMonoNerdFontMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-departure-mono",
  display: "swap",
});

export const departurePropo = localFont({
  src: [
    {
      path: "../public/fonts/departure-mono/DepartureMonoNerdFontPropo-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-departure-propo",
  display: "swap",
});

