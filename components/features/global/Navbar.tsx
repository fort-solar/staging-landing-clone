
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { navItems, NotDesigned } from "../constants";
import Link from "next/link";
import { Search } from "lucide-react"
import { Logo } from "../icons/Logo"
import { Logo_half } from "../icons/Logo_half";
import { LogoMobile } from "../icons/LogoMobile";






export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    <header className="sticky top-0 z-50 w-full  lg:bg-background p-3 lg:p-0 bg-transparent ">
      <div className="bg-white border lg:border-none rounded-lg lg:rounded-none lg:bg-white flex items-center justify-between px-4 lg:px-2 py-2 lg:py-5 max-w-6xl mx-auto">
        <div
          className="font-bold  text-2xl text-fbp-primary-quiet font-poppins cursor-pointer w-fit"
        >
          <Link href={"/"} className="gap-2 items-center hidden lg:flex">
            <Logo className="h-7 w-auto" />
          </Link>
          <Link href={"/"} className="gap-2 items-center flex lg:hidden">
            <LogoMobile className={`h-7 w-auto  ${isScrolled ? "hidden" : "block"}`} />
          </Link>
          <Link href={"/"} className="gap-2 items-center flex lg:hidden">
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
                className={`flex gap-1 items-center transition-colors py-2 px-4 rounded-md  ${isActive
                  ? "text-[#000000] font-semibold  cursor-pointer bg-gray-50"
                  : isPartOfNotDesigned ? "opacity-30 cursor-not-allowed"
                    : "text-fbp-primary-quiet  hover:text-fbp-primary-quiet hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:flex items-center justify-end gap-3">
          <div
            className={`relative flex items-center overflow-hidden transition-all duration-300 ease-out
    border rounded-lg py-2 bg-white
    ${searchOpen ? "w-64 px-3" : "w-fit px-0"}
  `}
          >

            <button
              onClick={() => setSearchOpen(true)}
              className={`absolute left-2 transition-all flex items-center gap-3 duration-200
      ${searchOpen ? "opacity-0 scale-75" : "opacity-100"}
    `}
            >
              <Search className="w-4 h-4" /> Search
            </button>
            <input
              type="text"
              placeholder="Search..."
              autoFocus={searchOpen}
              onBlur={() => setSearchOpen(false)}
              className={`w-full bg-transparent text-sm outline-none transition-all duration-300
      ${searchOpen ? "opacity-100 pl-8" : "opacity-0 pointer-events-none"}
    `}
            />
          </div>
          <Link href="/energy-calculator">
            <Button className="cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)]  hover:opacity-90"> Energy Calculator </Button>
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
        <div className="fixed inset-0 z-40 lg:hidden animate-fadeIn bg-white/75 backdrop-blur-2xl">
          <div className="flex justify-between items-center p-7">
            <Logo_half className="h-10 w-auto block lg:hidden" />
            <FaTimes size={20} onClick={toggleMenu} className="" />
          </div>
          <div className="flex flex-col mt-6 px-6">
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
                  className={`flex items-center gap-3 text-lg font-medium mb-4 ${isActive
                    ? "text-[#036d03]"
                    : isPartOfNotDesigned ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="border-t border-[#3E45501A] mt-5 mb-10">
              <div
                className={`relative mt-5 flex items-center overflow-hidden transition-all duration-300 ease-out
    border rounded-lg py-4 bg-white
    ${searchOpen ? "w-64 px-3" : "w-full px-0"}
  `}
              >

                <button
                  onClick={() => setSearchOpen(true)}
                  className={`absolute left-2 transition-all flex items-center gap-3 duration-200
      ${searchOpen ? "opacity-0 scale-75" : "opacity-100"}
    `}
                >
                  <Search className="w-4 h-4" /> Search
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus={searchOpen}
                  onBlur={() => setSearchOpen(false)}
                  className={`w-full bg-transparent text-sm outline-none transition-all duration-300
      ${searchOpen ? "opacity-100 pl-8" : "opacity-0 pointer-events-none"}
    `}
                />
              </div>
              <Link href="/energy-calculator" onClick={() => setMenuOpen(false)}>
                <Button className="w-full mt-4 cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)]  hover:opacity-90 py-6"> Energy Calculator </Button>
              </Link>
            </div>
          </div>


        </div>
      )}
    </header>
  );
}
