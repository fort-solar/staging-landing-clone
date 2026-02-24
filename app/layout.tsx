import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip"

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fontPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.fortsolar.ng"),

  title: {
    default: "Fortsolar | Clean, Reliable Solar Power",
    template: "%s | Fortsolar",
  },

  description:
    "Reliable residential and commercial solar energy solutions for homes and businesses, helping you reduce energy costs and power your future sustainably.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Fortsolar | Clean, Reliable Solar Power",
    description:
      "Residential and commercial solar solutions designed for reliability, savings, and sustainability.",
    type: "website",
    siteName: "Fortsolar",
    images: [
      {
        url: "/FortsolarLogo.png",
        width: 1200,
        height: 630,
        alt: "Fortsolar – Clean, Reliable Solar Power",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Fortsolar | Clean, Reliable Solar Power",
    description:
      "Residential and commercial solar solutions for homes and businesses.",
  },
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fortsolar",
  url: "https://www.fortsolar.ng",
  logo: "https://www.fortsolar.ng/FortsolarLogo.png",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontInter.variable} ${fontPoppins.variable}  antialiased`}
      >
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
