"use client";
import FaultyTerminal from "@/components/animated-background";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="flex relative min-h-svh bg-background overflow-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <FaultyTerminal mode="viewport" className="-z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <motion.h2 className="text-center">ORDINARY CREATIVE STUDIO</motion.h2>
    </main>
  );
}
