"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";

export default function GamePlayer({ src }: { src: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen failed:", e);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-3 ml-20 py-20 " >
        <Button type="button" variant="secondary" size={"sm"} onClick={toggleFullscreen}>

         <Maximize />
        </Button>
      </div>

      <div
        ref={wrapperRef}
        className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden mx-auto"
      >
        <iframe
          src={src}
          className="w-full h-full border-none"
          allow="fullscreen; autoplay; gamepad"
        />
      </div>
    </div>
  );
}

