"use client";

import React from "react";
import { Swiper } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import { Autoplay, Navigation } from "swiper/modules";
import { usePathname } from "next/navigation";


export const MobileSliderHome = ({
  children,
  extra,
  className,
}: {
  children: React.ReactNode;
  extra?: boolean;
  className?: string;
}) => {
  const pathName = usePathname();
  return (
    <div className={`md:hidden ${className ?? ""}`}>
      {extra && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        ></motion.div>
      )}

      <Swiper
        modules={[Autoplay, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        className="overflow-hidden hero-slider"
        speed={800}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: ".hero-slider-prev",
          nextEl: ".hero-slider-next",
        }}
      >
        {children}
      </Swiper>

      {pathName !== "/about" && (
        <div className="flex gap-3">
          <button
            className="hero-slider-prev h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="hero-slider-next h-12 w-12 rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] text-white flex items-center justify-center shadow"
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      )}

    </div>
  );
};
