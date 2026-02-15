import type { Metadata } from "next";
import HomeHero from "@/components/ui/home/HomeHero";
import HomeAbout from "@/components/ui/home/HomeAbout";
import HomeExplore from "@/components/ui/home/HomeExplore";
import HomeWhy from "@/components/ui/home/HomeWhy";
import HomeHow from "@/components/ui/home/HomeHow";
import HomeBrands from "@/components/ui/home/HomeBrands";
import Testimonials from "@/components/features/global/Testimonials";
import Blog from "@/components/features/global/Blog";
import CallToActionOne from "@/components/features/global/CallToActionOne";
import CallToActionTwo from "@/components/features/global/CallToActionTwo";
import Faq from "@/components/features/global/Faq";
import Newsletter from "@/components/features/global/Newsletter";
import Footer from "@/components/features/global/Footer";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore Fortsolar’s solar solutions for homes and businesses, plus financing, products, and expert installation services.",
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: "Fortsolar Home",
    description:
      "Clean, reliable solar power for homes and businesses with flexible financing and expert installation.",
    url: "/home",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen  bg-white dark:bg-black">
       <HomeHero />
      <main className="min-h-[60vh] w-full max-w-6xl mx-auto px-4 pt-5 pb-5 lg:pb-20  space-y-10 lg:space-y-20 bg-white dark:bg-black sm:items-start">
        <HomeAbout />
      </main>
      <HomeExplore /> 
      <HomeWhy />
      <HomeHow />
      <HomeBrands />
      <Testimonials />
      <Blog />
      <CallToActionTwo />
      <CallToActionOne />
      <Faq />
      <Newsletter />
      <Footer />
    </div>
  );
}
