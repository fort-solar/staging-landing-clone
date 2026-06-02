import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import { Button } from "@/components/ui/button";
import PublicEmptyState from "@/components/ui/public/PublicEmptyState";
import ProjectCard from "@/components/ui/projects/ProjectCard";
import PublicPagination from "@/components/ui/public/PublicPagination";
import { parsePageParam } from "@/lib/public-content";
import { getProjectsPage } from "@/lib/projects-data";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { STORE_PACKAGES_URL } from "@/lib/store-links";

export const metadata: Metadata = {
  title: "Projects | Fortsolar",
  description:
    "Explore completed Fortsolar solar projects across Nigeria and see real installation outcomes for homes and businesses.",
  alternates: {
    canonical: "/projects",
  },
};

type ProjectsPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parsePageParam(resolvedSearchParams.page);
  const { data: projects, pagination } = await getProjectsPage(page);

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
              <Link href={STORE_PACKAGES_URL} className="gap-3 font-medium w-full lg:w-fit">
                View Available Packages
                <SlantedArrow className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 lg:pt-14">
        <div className="flex min-h-[70vh] flex-col justify-between gap-10">
          {projects.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <PublicEmptyState
              title="No projects published yet"
              description="Completed Fortsolar installations will be listed here once project case studies are published."
              className="min-h-64"
            />
          )}

          {pagination.total > 0 ? (
            <PublicPagination
              basePath="/projects"
              page={pagination.page}
              totalPages={pagination.totalPages}
            />
          ) : null}
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
