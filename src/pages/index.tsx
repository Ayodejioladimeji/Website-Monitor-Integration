import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className="flex flex-col gap-10 items-center justify-center h-screen"
    >
      <h1 className="text-blue-500 text-3xl">Website Monitor Integration</h1>
      <p className="mt-5">Monitor website uptime and send alerts for downtime.</p>
      <Link href="/api/integration">View JSON</Link>
      <h3 className="text-blue-500 text-3xl">Author: LAYOBRIGHT</h3>
    </div>
  );
}
