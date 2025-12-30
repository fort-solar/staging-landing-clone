
import HomeHero from "@/components/ui/home/HomeHero";





export default function Home() {
  return (
    <div className="flex min-h-screen  bg-white dark:bg-black ">
      <main className="min-h-screen w-full max-w-6xl mx-auto px-4 py-10  bg-white dark:bg-black sm:items-start">
        <HomeHero />

      </main>
    </div>
  );
}
