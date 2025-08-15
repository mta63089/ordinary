"use client"

import PathDrawing from "@/components/draw-logo"
import BallPit from "@/components/play-area"

export default function HomePage() {
  return (
    <main className="bg-background flex min-h-svh flex-col justify-between overflow-hidden p-8">
      <div className="h-svh w-svh"></div>
      <div className="flex flex-1 flex-col gap-y-20">
        <PathDrawing />
      </div>
      <BallPit />
    </main>
  )
}
