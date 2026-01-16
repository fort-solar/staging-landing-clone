"use client";
import Link from "next/link";
import { Hammer } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden bg-[#0A0F0A]">
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-green-500/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-green-700/40 rounded-full blur-[160px]" />


      <div className="relative z-10 w-full max-w-3xl rounded-[32px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl p-10 md:p-16 text-center text-white">

        <div className="flex items-center justify-center">
          <span className="flex font-poppins w-fit items-center gap-2 mb-4 rounded-full bg-green-500/20 px-5 py-2 text-sm font-semibold tracking-wide">
            PAGE UNDER CONSTRUCTION <Hammer className="w-4 h-4" />
          </span>
        </div>


        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          We’re Building Something
          <span className="block text-green-400">Powerful & Sustainable</span>
        </h1>

        <p className="mt-6 text-white/80 max-w-xl mx-auto">
          This page is currently being energized.
          We’re working behind the scenes to deliver a cleaner,
          smarter solar experience.
        </p>


        <div className="mt-10">
          <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-[65%] bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] animate-pulse" />
          </div>
          <p className="mt-3 text-sm text-white/70">65% Complete</p>
          <Link
            href="/home"
            className="inline-flex mt-8 items-center justify-center rounded-full bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] px-8 py-3 text-white font-semibold hover:bg-green-700 transition"
          >
            Go Back Home
          </Link>
        </div>


        <p className="mt-10 text-xs text-white/50">
          Fortsolar — powering a brighter future 🌞
        </p>
      </div>
    </div>
  );
}
