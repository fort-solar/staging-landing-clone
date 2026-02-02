"use client";

import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { Pagination, Autoplay } from "swiper/modules";


export const MobileSlider = ({
  children,
  extra,
  className,
}: {
  children: React.ReactNode;
  extra?: boolean;
  className?: string;
}) => {
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
        modules={[Pagination, Autoplay]}
        slidesPerView={1.1}
        spaceBetween={16}
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
