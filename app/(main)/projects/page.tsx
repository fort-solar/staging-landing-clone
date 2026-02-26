import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ui/projects/ProjectCard";
import { projects } from "@/lib/projects-data";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";

export const metadata: Metadata = {
  title: "Projects | Fortsolar",
  description:
    "Explore completed Fortsolar solar projects across Nigeria and see real installation outcomes for homes and businesses.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/contact_hero_image.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#013203]/55" />
        <div className="relative mx-auto flex min-h-105 max-w-7xl items-center justify-center px-4 py-16 text-center lg:min-h-125">
          <div className="max-w-4xl text-white">
            <h1 className=" font-bold leading-tight font-poppins text-2xl lg:text-5xl">
              Our Solar Installations Across Nigeria
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-sm text-white/90 sm:text-base lg:text-xl font-semibold">
              Explore some of our completed projects. 
            </p>
            <p className="mx-auto max-w-3xl text-sm text-white/90 sm:text-base lg:text-xl">
              Each solution is designed
              to deliver reliable, efficient, and affordable solar power. Find inspiration and choose the perfect plan for your homes or business.
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-2xl px-8 text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:opacity-90"
            >
              <Link href="/coming-soon" className="gap-3 font-medium w-full lg:w-fit">
                View Available Packages
                <SlantedArrow className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 lg:pt-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="h-11 rounded-xl border-[#D6EED6] bg-[#ECF8EC] px-5 text-[#058A05] hover:bg-[#e3f3e3] cursor-pointer hover:text-[#058A05]"
          >
            <ArrowDown className="h-4 w-4" />
            Load more
          </Button>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}

