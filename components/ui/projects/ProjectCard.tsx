"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import type { ProjectItem } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: ProjectItem;
  className?: string;
  compact?: boolean;
};

export default function ProjectCard({
  project,
  className,
  compact = false,
}: ProjectCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = (project.heroImages.length ? project.heroImages : ["/contact_hero_image.png"]).slice(0, 4);

  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <article className="relative overflow-hidden rounded-3xl border border-black/5 bg-black text-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/35 to-black/30" />

        <div className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{project.dateLabel}</span>
        </div>

        <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5" />
          <span>{project.locationLabel}</span>
        </div>

        <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-1.5">
          {slides.map((_, index) => (
            <span
              key={`${project.slug}-dot-${index}`}
              className={cn(
                "h-1.5 rounded-full bg-white/55 transition-all",
                activeIndex === index ? "w-4 bg-[#2CB22C]" : "w-1.5",
              )}
            />
          ))}
        </div>

        <div className={cn("relative h-80 w-full", compact && "h-65")}>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={slides.length > 1}
            speed={700}
            autoplay={
              slides.length > 1
                ? {
                    delay: 3200,
                    disableOnInteraction: false,
                  }
                : false
            }
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-full"
          >
            {slides.map((image, index) => (
              <SwiperSlide key={`${project.slug}-slide-${index}`}>
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 p-5 lg:p-6">
          <h3 className="line-clamp-2 text-xl font-semibold leading-tight font-poppins">
            {project.listingTitle}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/85">{project.summary}</p>
        </div>
      </article>
    </Link>
  );
}
