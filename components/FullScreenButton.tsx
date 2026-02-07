// app/games/[slug]/FullscreenButton.tsx
"use client"

export default function FullscreenButton() {
  const enterFullscreen = () => {
    const iframe = document.getElementById("game-frame")

    if (!iframe) return

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen()
    }
  }

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={enterFullscreen}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Fullscreen
      </button>
    </div>
  )
}

