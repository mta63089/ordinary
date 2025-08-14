import "@/styles/globals.css";

import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cn } from "../lib/utils";
export const metadata: Metadata = {
  title: "Ordinary Creative Studio",
  description: "Design and Web Development that you can depend on",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased font-sans min-h-svh", fontSans.variable)}
      >
        <div className="relative flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
