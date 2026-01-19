"use client"

import React from "react";
import { GreenMarkIcon } from "@/components/features/icons/GreenMarkIcon";
import { Button } from "../button";
import CardOne from "./homeexplorecontents/CardOne";
import CardTwo from "./homeexplorecontents/CardTwo";
import CardThree from "./homeexplorecontents/CardThree";
import CardFour from "./homeexplorecontents/CardFour";
import { MobileSlider } from '../mobileSlider';
import { SwiperSlide } from "swiper/react";
import Link from "next/link";

const HomeExplore = () => {
    return (
        <div className="bg-[#B8C0CC1A]">
            <div className=" min-h-screen w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className="text-3xl lg:text-5xl font-bold font-poppins">
                        Explore Our Solar
                    </p>

                    <div className="text-3xl lg:text-5xl font-bold font-poppins flex ">
                        <span className="relative inline-flex items-center px-2 py-1 lg:py-4">
                            <GreenMarkIcon className="absolute inset-0 w-full h-full z-0" />
                            <span className="relative z-10">Packages</span>
                        </span>
                        <p className="py-1 lg:py-4">
                            & Products
                        </p>

                    </div>
                    <p className="mt-2 font-medium max-w-xl">
                        Affordable and efficient solutions tailored to your needs.
                    </p>
                </div>
                <div>
                    <MobileSlider extra={true}>
                        <SwiperSlide><CardOne /></SwiperSlide>
                        <SwiperSlide><CardTwo /></SwiperSlide>
                        <SwiperSlide><CardThree /></SwiperSlide>
                        <SwiperSlide><CardFour /></SwiperSlide>
                    </MobileSlider>
                </div>
                <div className="md:grid hidden md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                    <CardOne />
                    <CardTwo />
                    <CardThree />
                    <CardFour />
                </div>

                <div className="flex items-center justify-center py-4">
                    <Link href={"/coming-soon"}>
                        <Button
                            className="
                            transition-all
                      text-white
                      cursor-pointer
                      text-sm
                      flex 
                      items-center 
                      justify-center 
                      gap-3
                      bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                      hover:opacity-90
                    "
                        >
                            See All Packages {" "}{" "}→
                        </Button>
                    </Link>

                </div>
            </div>
        </div>

    )
}

export default HomeExplore
