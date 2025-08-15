"use client"

import { motion } from "framer-motion"

import BallPit from "@/components/play-area"
import { Television } from "@/components/television"

export default function HomePage() {
  return (
    <main className="bg-background flex min-h-svh flex-col justify-between overflow-hidden p-8">
      <div className="h-svh w-svh">
        <Television />
      </div>
      <div className="flex flex-1 flex-col gap-y-20">
        <motion.h2
          initial={{ color: "#111", x: 500 }}
          animate={{
            color: ["#109d", "#93ef11", "#214a32"],
            x: [0, 500, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-svh overflow-hidden font-bold"
        >
          ORDINARY
        </motion.h2>
        <motion.h2
          initial={{ y: -1000, x: -1000, opacity: 0 }}
          whileInView={{
            backgroundColor: "#214a32",
            opacity: 1,
            x: 0,
            y: 0,
          }}
          transition={{ duration: 2, type: "spring" }}
          className="h-svh overflow-hidden font-bold"
        >
          CREATIVE
        </motion.h2>
        <motion.h2
          initial={{ y: 100 }}
          animate={{
            translateX: 100,
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="overflow-hidden font-bold"
        >
          STUDIO
        </motion.h2>
      </div>
      <BallPit />
    </main>
  )
}
