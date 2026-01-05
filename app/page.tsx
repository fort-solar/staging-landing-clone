
import HomeHero from "@/components/ui/home/HomeHero";
import HomeAbout from "@/components/ui/home/HomeAbout";
import HomeExplore from "@/components/ui/home/HomeExplore";
import HomeWhy from "@/components/ui/home/HomeWhy";
import HomeHow from "@/components/ui/home/HomeHow";
import HomeBrands from "@/components/ui/home/HomeBrands";
import Testimonials from "@/components/features/global/Testimonials";





export default function Home() {
  return (
    <div className="min-h-screen  bg-white dark:bg-black ">
      <main className="min-h-screen w-full max-w-6xl mx-auto px-4 py-10 space-y-10 lg:space-y-20 bg-white dark:bg-black sm:items-start">
        <HomeHero />
        <HomeAbout />
        
      </main>
      <HomeExplore /> 
      <HomeWhy />
      <HomeHow />
      <HomeBrands />
      <Testimonials />
    </div>
  );
}
