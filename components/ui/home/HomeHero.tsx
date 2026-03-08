"use client"

import React, { useState, useEffect, useRef } from "react";
import { CAROUSEL_CONTENT } from "@/components/features/constants";
import { Button } from "../button";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { GreenTick } from "@/components/features/icons/Greentick";
import Image from "next/image";
import Link from "next/link";
import { brand_6, trusted_brands_2, trusted_brands_3, trusted_brands_4, trusted_brands_5 } from "@/components/features/images";
import { MobileSliderHome } from "../mobileSliderHome";
import { SwiperSlide } from "swiper/react";
import { AnimatePresence, motion } from "framer-motion";

const TRUSTED_BRANDS = [
    { src: brand_6, alt: "Trusted brand logo 1", cardClassName: "bg-white" },
    { src: trusted_brands_2, alt: "Trusted brand logo 2", cardClassName: "bg-black" },
    { src: trusted_brands_3, alt: "Trusted brand logo 3", cardClassName: "bg-white" },
    { src: trusted_brands_4, alt: "Trusted brand logo 4", cardClassName: "bg-white" },
    { src: trusted_brands_5, alt: "Trusted brand logo 5", cardClassName: "bg-white" },
];

const HomeHero = () => {
    const [current, setCurrent] = useState(0);
    const heroRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((current + 1) % CAROUSEL_CONTENT.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [current, setCurrent]);


    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-5 lg:py-10 space-y-10 lg:space-y-20 bg-white dark:bg-black sm:items-start" ref={heroRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                <div className="flex flex-col  justify-between">
                    <div className='flex flex-col gap-5'>
                        <div className="hidden lg:block">
                            <div
                                key={current}
                                className="animate-fade"
                            >
                                <div
                                    className="p-2 text-xs lg:text-sm w-fit rounded-lg font-medium"
                                    style={{
                                        backgroundColor: CAROUSEL_CONTENT[current].toast_background_color,
                                        color: CAROUSEL_CONTENT[current].toast_color,
                                    }}
                                >
                                    {CAROUSEL_CONTENT[current].toast}
                                </div>

                                <h1 className="text-4xl lg:text-6xl font-bold font-poppins mt-1 lg:mt-2 min-h-30">
                                    {CAROUSEL_CONTENT[current].title}
                                </h1>

                                <div className="mt-1 lg:mt-2  min-h-24">
                                    {CAROUSEL_CONTENT[current].content}
                                </div>
                            </div>

                            <div className="mt-0 lg:mt-2 animate-fade">
                                <Link href="/coming-soon" className="flex gap-10 items-center">
                                    <Button
                                        className="
                            transition-all
                      text-white
                      cursor-pointer
                      flex 
                       py-5
                      font-medium
                      rounded-xl
                      items-center 
                      justify-center 
                      gap-3
                      bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                      hover:opacity-90
                    "
                                    >
                                        {CAROUSEL_CONTENT[current].buttonName}
                                        <SlantedArrow className='h-1 w-1 ' />
                                    </Button>
                                </Link>

                            </div>
                        </div>

                        <div className="lg:hidden">
                            <MobileSliderHome className="md:block lg:hidden">
                                {CAROUSEL_CONTENT.map((item, index) => (
                                    <SwiperSlide key={`${item.title}-${index}`}>
                                        <div className="px-3">
                                            <div className="flex flex-col gap-4">
                                                <div
                                                    className="p-2 text-xs w-fit rounded-lg font-medium"
                                                    style={{
                                                        backgroundColor: item.toast_background_color,
                                                        color: item.toast_color,
                                                    }}
                                                >
                                                    {item.toast}
                                                </div>

                                                <div className="min-h-26 flex items-start">
                                                    <h1 className="text-3xl font-bold font-poppins leading-tight">
                                                        {item.title}
                                                    </h1>
                                                </div>

                                                <div className="min-h-30 leading-6">
                                                    {item.content}
                                                </div>

                                                <Link href="/coming-soon" className="flex gap-10 items-center">
                                                    <Button
                                                        className="
                            transition-all
                      text-white
                      cursor-pointer
                      text-[16px]
                      font-medium
                      flex 
                      w-full
                      py-7
                      rounded-xl
                      items-center 
                      justify-center 
                      gap-3
                      bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                      hover:opacity-90
                    "
                                                    >
                                                        {item.buttonName}
                                                        <SlantedArrow className='h-3 w-3 text-sm' />
                                                    </Button>
                                                </Link>

                                                <div className="relative h-100 mt-10 w-full overflow-hidden rounded-4xl border-white">
                                                    <Image
                                                        fill
                                                        alt="Residential solar installation"
                                                        src={item.image}
                                                        className="object-fill rounded-4xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </MobileSliderHome>
                        </div>
                    </div>
                    <div>
                        <div className="mt-10 py-1 px-2 rounded-lg bg-[#058a0525] border border-[#058A0580] flex gap-2 items-center">
                            <GreenTick className="w-4 h-4" />
                            <p className="text-[#058A05] text-xs lg:text-sm">Trusted by 100+ homeowners businesses and partners.</p>
                        </div>
                        <div className="trusted-brands-marquee mt-4">
                            <div className="trusted-brands-track">
                                {[...TRUSTED_BRANDS, ...TRUSTED_BRANDS].map((brand, index) => (
                                    <div
                                        key={`${brand.alt}-${index}`}
                                        className="trusted-brands-item px-1"
                                        aria-hidden={index >= TRUSTED_BRANDS.length}
                                    >
                                        <div className={`border rounded-lg w-full py-2 flex justify-center items-center ${brand.cardClassName}`}>
                                            <Image alt={brand.alt} src={brand.src} height={100} width={100} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>


                <div className="hidden lg:block relative h-140 w-full overflow-hidden rounded-4xl border-white ">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            className="absolute inset-0 "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Image
                                fill
                                alt="Residential solar installation"
                                src={CAROUSEL_CONTENT[current].image}
                                className="object-fill rounded-4xl inverted-radius-image-bottom "
                            />
                        </motion.div>
                    </AnimatePresence>


                    <div className="absolute bottom-0 right-0 flex gap-3 z-10 bg-white pb-2 px-2 rounded-tl-4xl rounded-br-4xl">
                        <button
                            onClick={() =>
                                setCurrent((prev) =>
                                    prev === 0 ? CAROUSEL_CONTENT.length - 1 : prev - 1
                                )
                            }
                            className="h-12 cursor-pointer w-12 rounded-xl bg-white flex items-center justify-center shadow"
                        >
                            ←
                        </button>



                        <button
                            onClick={() =>
                                setCurrent((prev) => (prev + 1) % CAROUSEL_CONTENT.length)
                            }
                            className="h-12 w-12 cursor-pointer rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
    hover:opacity-90 text-white flex items-center justify-center shadow"
                        >
                            →
                        </button>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default HomeHero
