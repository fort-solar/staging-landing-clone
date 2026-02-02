"use client"

import React, { useState, useEffect, useRef } from "react";
import { CAROUSEL_CONTENT } from "@/components/features/constants";
import { Button } from "../button";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { GreenTick } from "@/components/features/icons/Greentick";
import Image from "next/image";
import Link from "next/link";
import { trusted_brands_1, trusted_brands_2, trusted_brands_3, trusted_brands_4 } from "@/components/features/images";
import { MobileSliderHome } from "../mobileSliderHome";
import { SwiperSlide } from "swiper/react";
import { AnimatePresence, motion } from "framer-motion";


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

                                <h1 className="text-4xl lg:text-6xl font-bold font-poppins mt-1 lg:mt-2">
                                    {CAROUSEL_CONTENT[current].title}
                                </h1>

                                <div className="mt-1 lg:mt-2">
                                    {CAROUSEL_CONTENT[current].content}
                                </div>
                            </div>

                            <div className="mt-0 lg:mt-2 animate-fade">
                                <Link href="/coming-soon">
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
                                        {CAROUSEL_CONTENT[current].buttonName}
                                        <SlantedArrow className='h-1 w-1 arrow' />
                                    </Button>
                                </Link>

                            </div>
                        </div>

                        <div className="lg:hidden">
                            <MobileSliderHome className="md:block lg:hidden">
                                {CAROUSEL_CONTENT.map((item, index) => (
                                    <SwiperSlide key={`${item.title}-${index}`}>
                                        <div className="space-y-4">
                                            <div
                                                className="p-2 text-xs w-fit rounded-lg font-medium"
                                                style={{
                                                    backgroundColor: item.toast_background_color,
                                                    color: item.toast_color,
                                                }}
                                            >
                                                {item.toast}
                                            </div>

                                            <h1 className="text-3xl font-bold font-poppins">
                                                {item.title}
                                            </h1>

                                            <div>{item.content}</div>

                                            <Link href="/coming-soon">
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
                                                    {item.buttonName}
                                                    <SlantedArrow className='h-1 w-1 arrow' />
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
                                    </SwiperSlide>
                                ))}
                            </MobileSliderHome>
                        </div>
                    </div>
                    <div>
                        <div className="mt-10 py-1 px-2 rounded-lg bg-[#058a0525] flex gap-2 items-center">
                            <GreenTick className="w-4 h-4" />
                            <p className="text-[#058A05] text-xs lg:text-sm">Trusted by 100+ homeowners businesses and partners.</p>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-4">
                            <div className="border rounded-lg bg-white w-full py-5 flex justify-center items-center">
                                <Image alt="Trusted brand logo 1" src={trusted_brands_1} height={30} width={30} />
                            </div>
                            <div className="border rounded-lg bg-white w-full py-5 flex justify-center items-center">
                                <Image alt="Trusted brand logo 2" src={trusted_brands_2} height={30} width={30} />
                            </div>
                            <div className="border rounded-lg bg-black w-full py-5 flex justify-center items-center">
                                <Image alt="Trusted brand logo 3" src={trusted_brands_3} height={30} width={30} />
                            </div>
                            <div className="border rounded-lg bg-white w-full py-5 flex justify-center items-center">
                                <Image alt="Trusted brand logo 1" src={trusted_brands_1} height={30} width={30} />
                            </div>
                            <div className="border rounded-lg bg-white w-full py-5 flex justify-center items-center">
                                <Image alt="Trusted brand logo 4" src={trusted_brands_4} height={30} width={30} />
                            </div>
                            <div className="border rounded-lg bg-white w-full py-5 flex justify-center items-center">
                                <Image alt="Trusted brand logo 4" src={trusted_brands_4} height={30} width={30} />
                            </div>
                        </div>
                    </div>

                </div>


                <div className="hidden lg:block relative h-130 w-full overflow-hidden rounded-4xl border-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Image
                                fill
                                alt="Residential solar installation"
                                src={CAROUSEL_CONTENT[current].image}
                                className="object-fill rounded-4xl inverted-radius-image-bottom"
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
