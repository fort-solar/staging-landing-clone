
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { navItems, NotDesigned } from "../constants";
import Link from "next/link";
import { Search } from "lucide-react"
import { Logo } from "../icons/Logo"






export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);




  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full  bg-background">
      <div className="flex items-center justify-between  px-2 py-5 max-w-6xl mx-auto">
        <div
          className="font-bold  text-2xl text-fbp-primary-quiet font-poppins cursor-pointer w-fit"
        >
          <Link href={"/home"} className="flex gap-2 items-center">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>


        <nav className="hidden lg:flex space-x-1">
          {navItems.map((item) => {
            const isPartOfNotDesigned = NotDesigned.find((i) => i.name === item.label);
            return (
              <Link
                href={isPartOfNotDesigned ? "" : item.path}
                key={item.path}
                className={`flex gap-1 items-center transition-colors py-2 px-4 rounded-md  ${pathname === item.path
                  ? "text-fbp-primary  cursor-pointer bg-gray-50"
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
          <Button variant="outline" className="disabled border-[#0000004D] cursor-pointer">
            <Search /> Search
          </Button>
          <Link href="/coming-soon">
            <Button className="cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]  hover:opacity-90"> Energy Calculator </Button>
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
        <div className="fixed inset-0 bg-white z-40 lg:hidden animate-fadeIn">
          <div className="flex justify-end p-7">
            <FaTimes size={20} onClick={toggleMenu} className="text-fbp-primary-quiet" />
          </div>
          <div className="flex flex-col mt-20 px-14">
            {navItems.map((item) => {
              const isPartOfNotDesigned = NotDesigned.find((i) => i.name === item.label);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 text-lg mb-4 ${pathname === item.path
                    ? "text-fbp-secondary"
                    : isPartOfNotDesigned ? "opacity-50 cursor-not-allowed"
                      : "text-fbp-primary-quiet hover:text-fbp-secondary"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
            <Button variant="outline" className="w-fit px-10 mb-5 disabled border-[#0000004D] cursor-pointer">
              <Search /> Search
            </Button>
            <Link href="/coming-soon">
              <Button className=" cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]  hover:opacity-90"> Energy Calculator </Button>
            </Link>
          </div>


        </div>
      )}
    </header>
  );
}

