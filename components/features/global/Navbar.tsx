"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Search } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Logo } from "../icons/Logo"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Store", href: "/store" },
  { label: "Installations", href: "/installations" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full  bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          {/* <span className="sr-only">FortSolar</span> */}
        </Link>


        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList>
              {NAV_LINKS.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}


        {!isMobile && (
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#0000004D] cursor-pointer">
              <Search /> Search
            </Button>
            <Button
              className="
              cursor-pointer
    text-white
    bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
    hover:opacity-90
  "
            >
              Energy Calculator
            </Button>
          </div>
        )}


        {isMobile && (
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md border p-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>


      {isMobile && open && (
        <div className="border-t bg-background px-4 py-4">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" className="w-fit border-[#0000004D] cursor-pointer">
                <Search /> Search
              </Button>
              <Button
                className="
    w-fit
    text-white
    bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
    hover:opacity-90
  "
              >
                Energy Calculator
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
