import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/features/global/Navbar";

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  metadataBase: new URL("https://fortsolar.com"),

  title: {
    default: "FortSolar | Clean, Reliable Solar Power",
    template: "%s | FortSolar",
  },

  description:
    "Reliable residential and commercial solar energy solutions for homes and businesses, helping you reduce energy costs and power your future sustainably.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "FortSolar | Clean, Reliable Solar Power",
    description:
      "Residential and commercial solar solutions designed for reliability, savings, and sustainability.",
    type: "website",
    siteName: "FortSolar",
    images: [
      {
        url: "/FortsolarLogo.png",
        width: 1200,
        height: 630,
        alt: "FortSolar – Clean, Reliable Solar Power",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FortSolar | Clean, Reliable Solar Power",
    description:
      "Residential and commercial solar solutions for homes and businesses.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontInter.variable}  antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
