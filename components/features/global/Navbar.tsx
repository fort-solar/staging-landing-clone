"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { navItems, NotDesigned } from "../constants";
import Link from "next/link";
import { Logo } from "../icons/Logo";
import { Logo_half } from "../icons/Logo_half";
import { LogoMobile } from "../icons/LogoMobile";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full lg:bg-background p-3 lg:p-0 bg-transparent">
      <div className="bg-white border lg:border-none rounded-lg lg:rounded-none lg:bg-white flex items-center justify-between px-4 lg:px-2 py-2 lg:py-5 max-w-6xl mx-auto">
        <div className="font-bold text-2xl text-fbp-primary-quiet font-poppins cursor-pointer w-fit">
          <Link href={"/"} prefetch={true} className="gap-2 items-center hidden lg:flex">
            <Logo className="h-7 w-auto" />
          </Link>
          <Link href={"/"} prefetch={true} className="gap-2 items-center flex lg:hidden">
            <LogoMobile className={`h-7 w-auto ${isScrolled ? "hidden" : "block"}`} />
          </Link>
          <Link href={"/"} prefetch={true} className="gap-2 items-center flex lg:hidden">
            <Logo_half className={`h-8 w-auto ${isScrolled ? "block" : "hidden"}`} />
          </Link>
        </div>

        <nav className="hidden lg:flex space-x-1">
          {navItems.map((item) => {
            const isPartOfNotDesigned = NotDesigned.find((i) => i.name === item.label);
            const isActive =
              pathname === item.path ||
              (item.path === "/projects" && pathname.startsWith("/projects/")) ||
              (item.path === "/blog" && pathname.startsWith("/blog/"));
            return (
              <Link
                href={isPartOfNotDesigned ? "" : item.path}
                key={item.path}
                prefetch={true}
                className={`flex gap-1 items-center transition-colors py-2 px-4 rounded-md ${
                  isActive
                    ? "text-[#000000] font-semibold cursor-pointer bg-gray-50"
                    : isPartOfNotDesigned
                    ? "opacity-30 cursor-not-allowed"
                    : "text-fbp-primary-quiet hover:text-fbp-primary-quiet hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-3">
          <Link href="/contact" prefetch={true}>
            <Button
              variant="outline"
              className="cursor-pointer font-medium text-slate-800 border-slate-300 hover:border-[#048A05] hover:text-[#048A05] hover:bg-emerald-50/60 transition-all rounded-xl px-4 py-2 text-sm shadow-2xs hover:shadow-xs"
            >
              Get a Quote
            </Button>
          </Link>
          <Link href="/energy-calculator" prefetch={true}>
            <Button className="cursor-pointer text-white font-semibold bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-95 shadow-md shadow-emerald-700/15 transition-all rounded-xl px-5 py-2 text-sm">
              Energy Calculator
            </Button>
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-fbp-primary-quiet"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fadeIn bg-white/90 backdrop-blur-2xl">
          <div className="flex justify-between items-center p-7">
            <Logo_half className="h-10 w-auto block lg:hidden" />
            <FaTimes size={20} onClick={toggleMenu} className="cursor-pointer" />
          </div>
          <div className="flex flex-col mt-4 px-6">
            {navItems.map((item) => {
              const isPartOfNotDesigned = NotDesigned.find((i) => i.name === item.label);
              const isActive =
                pathname === item.path ||
                (item.path === "/projects" && pathname.startsWith("/projects/")) ||
                (item.path === "/blog" && pathname.startsWith("/blog/"));
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.path.startsWith("http")) {
                      window.location.assign(item.path);
                    } else {
                      router.push(item.path);
                    }
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 text-lg font-medium mb-4 text-left ${
                    isActive
                      ? "text-[#048A05] font-semibold"
                      : isPartOfNotDesigned
                      ? "opacity-50 cursor-not-allowed"
                      : "text-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-[#3E45501A] mt-4 pt-6 flex flex-col gap-3">
              <Link href="/contact" onClick={() => setMenuOpen(false)} prefetch={true}>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer font-medium text-slate-800 border-slate-300 hover:bg-slate-50 py-5 rounded-xl text-base"
                >
                  Get a Quote
                </Button>
              </Link>
              <Link href="/energy-calculator" onClick={() => setMenuOpen(false)} prefetch={true}>
                <Button className="w-full cursor-pointer text-white font-semibold bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-90 py-5 rounded-xl shadow-md text-base">
                  Energy Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
