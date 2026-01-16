"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div>
      <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden bg-[#0A0F0A]">
        <div className="absolute -top-50 -left-50 w-125 h-125 bg-green-500/30 rounded-full blur-[140px]" />
        <div className="absolute -bottom-50 -right-50 w-125 h-125 bg-green-700/40 rounded-full blur-[160px]" />


        <div className="relative z-10 w-full max-w-3xl rounded-[32px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl p-10 md:p-16 text-center text-white">

          <div className="flex items-center justify-center">
            <span className="flex w-fit items-center gap-2 mb-4 rounded-full bg-green-500/20 px-5 py-2 text-sm font-semibold tracking-wide">
              Page Not Found   <AlertTriangle className="w-4 h-4" />
            </span>
          </div>


          <h1 className="mt-6 font-poppins text-[72px] md:text-[96px] font-extrabold tracking-tight">
            404
          </h1>

          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Looks like this page went off-grid 🌱
            Don’t worry — clean energy is still just a click away.
          </p>


          <div className="mt-3">
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
    </div>

  );
}
