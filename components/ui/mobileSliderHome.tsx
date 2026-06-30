"use client";

import React from "react";
import { Swiper } from "swiper/react";
import "swiper/css";
// [ui-fix] replaced Navigation module + custom arrow buttons with Pagination module (dot indicators) to match the mobile services slider style
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Autoplay, Pagination } from "swiper/modules";


export const MobileSliderHome = ({
  children,
  extra,
  className,
}: {
  children: React.ReactNode;
  extra?: boolean;
  className?: string;
}) => {
  return (
    <div className={`w-full ${className ?? ""}`}>
      {extra && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        ></motion.div>
      )}

      {/* [ui-fix] uses Pagination (clickable dots) instead of Navigation arrows so the desktop services slider shows the same dot indicators as the mobile version */}
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        className="overflow-hidden hero-slider h-full w-full"
        speed={800}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
      >
        {children}
      </Swiper>

    </div>
  );
};
