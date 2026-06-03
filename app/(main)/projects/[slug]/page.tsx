import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";

import CircularGreenCheck from "@/components/features/icons/CircularGreenCheck";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import { Button } from "@/components/ui/button";
import PublicEmptyState from "@/components/ui/public/PublicEmptyState";
import ProjectCard from "@/components/ui/projects/ProjectCard";
import { getProjectBySlug, getProjects, getProjectsPage } from "@/lib/projects-data";
import { STORE_PACKAGES_URL } from "@/lib/store-links";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Fortsolar",
    };
  }

  return {
    title: `${project.title} | Fortsolar Projects`,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { data: recentProjects } = await getProjectsPage(1, 3);
  const relatedProjects = recentProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);
  const detailImages = project.galleryImages.length ? project.galleryImages : project.heroImages;
  const primaryImage = detailImages[0] ?? "/contact_hero_image.png";
  const supportingImages = detailImages.slice(1, 5);

  return (
    <div className="bg-white">
      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 pb-10 pt-6 lg:pb-20 lg:pt-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight font-poppins text-[#333333] lg:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-[#4B5563]">{project.summary}</p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-[#6B7280] lg:items-end">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{project.detailDateLabel}</span>
              </div>

            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.65fr_1.05fr]">
            <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-black">
              <div className="relative aspect-[4/5] sm:aspect-[4/3]">
                <Image
                  src={primaryImage}
                  alt={project.title}
                  fill
                  className="object-cover opacity-85"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-black/20" />
              </div>
            </div>

            {supportingImages.length ? (
              <div className="grid h-fit grid-cols-2 gap-2">
                {supportingImages.map((image, index) => (
                  <div
                    key={`${project.slug}-gallery-${index + 1}`}
                    className="relative aspect-[4/5] overflow-hidden rounded-xl border border-black/5 bg-[#F2F4F7]"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} gallery image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 24vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <PublicEmptyState
                title="No additional project media yet"
                description="This installation does not have any extra published gallery images right now."
                className="min-h-50 rounded-2xl px-5 py-8"
              />
            )}
          </section>

          <section className="grid grid-cols-1 gap-5 pt-2 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-black/5 bg-[#B8C0CC33] p-6 lg:p-8 h-fit">
              <h2 className="text-2xl font-semibold font-poppins text-[#1F2937]">
                Installation Overview:
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#4B5563]">{project.overview}</p>
              <p className="mt-4 text-sm font-semibold text-[#374151]">
                Location: <span className="font-normal">{project.community}</span>
              </p>

              <h3 className="mt-7 text-2xl font-semibold font-poppins text-[#1F2937]">
                Highlights:
              </h3>
              {project.highlights.length ? (
                <ul className="mt-4 space-y-2 text-sm text-[#4B5563]">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4B5563]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-[#6B7280]">
                  No project highlights have been published for this installation yet.
                </p>
              )}

              <Button
                variant="outline"
                className="mt-8 h-11 rounded-xl w-full lg:w-fit border-[#0000004D] bg-transparent px-6 text-[#111827] hover:bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:text-white"
              >
                Get Quote
              </Button>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6 lg:p-8">
              <h2 className="text-2xl font-semibold font-poppins text-[#1F2937]">
                System Details:
              </h2>

              <div className="mt-4 space-y-2 rounded-sm border border-black/5 p-1">
                {[
                  ["Inverter Size", project.systemDetails.inverterSize],
                  ["PV Size", project.systemDetails.pvSize],
                  ["Battery Size", project.systemDetails.batterySize],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="rounded-sm bg-[#D1D5DB4D] px-3 py-2 text-[#6B7280]">
                      {label}
                    </div>
                    <div className="rounded-sm bg-[#D1D5DB4D] px-3 py-2 text-[#6B7280]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="mt-7 text-2xl font-semibold font-poppins text-[#1F2937]">
                What It Can Power
              </h3>
              {project.whatItCanPower.length ? (
                <ul className="mt-4 space-y-3">
                  {project.whatItCanPower.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#4B5563]">
                      <span className="mt-0.5 shrink-0">
                        <CircularGreenCheck />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-[#6B7280]">
                  Load coverage details have not been added yet.
                </p>
              )}

              <p className="mt-4 text-xs italic text-[#6B7280]">
                <span className="font-medium">Note:</span>  Actual usage may vary depending on load and battery capacity.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <Button asChild className="h-11 rounded-xl text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:opacity-90">
                  <Link href={STORE_PACKAGES_URL} className="w-full">
                    Get Package
                    <SlantedArrow className="h-3.5 w-3.5" />
                  </Link>
                </Button>


                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-[#0000004D] bg-transparent px-6 text-[#111827] hover:opacity-90 hover:text-[#111827]"
                >
                  <Link href="/contact" className="w-full">
                    Talk to an Expert
                  </Link>
                </Button>


              </div>
            </div>
          </section>
        </div>
      </main>

      {relatedProjects.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-12 lg:pb-20">
          <h2 className="text-center text-3xl font-bold font-poppins text-[#333333] lg:text-5xl">
            Explore More Projects
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {relatedProjects.map((relatedProject) => (
              <ProjectCard key={relatedProject.slug} project={relatedProject} compact />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="h-11 w-full rounded-xl border-[#0000004D] bg-transparent px-6 text-[#111827] hover:opacity-90 hover:text-[#111827] lg:w-fit"
            >
              <Link href="/projects">View all projects</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <Newsletter />
      <Footer />
    </div>
  );
}
