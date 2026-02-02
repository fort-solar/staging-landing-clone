"use client"

import React, { useState, useEffect, useRef } from "react";
import { CAROUSEL_CONTENT } from "@/components/features/constants";
import { Button } from "../button";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { GreenTick } from "@/components/features/icons/Greentick";
import Image from "next/image";
import Link from "next/link";
import { trusted_brands_1, trusted_brands_2, trusted_brands_3, trusted_brands_4 } from "@/components/features/images";


const HomeHero = () => {
    const [current, setCurrent] = useState(0);
    const heroRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((current + 1) % CAROUSEL_CONTENT.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [current, setCurrent]);




    const scrollToTop = () => {
        if (!heroRef.current) return;

        const offset = 80;
        const startY = window.scrollY;
        const targetY =
            heroRef.current.getBoundingClientRect().top +
            window.scrollY -
            offset;

        const duration = 1000;
        const startTime = performance.now();

        const easeInOutCubic = (t: number) =>
            t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo({
                top: startY + (targetY - startY) * easedProgress,
            });

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };




    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-5 lg:py-10 space-y-10 lg:space-y-20 bg-white dark:bg-black sm:items-start" ref={heroRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                <div className="flex flex-col  justify-between">
                    <div className='flex flex-col gap-5'>
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

                        <div className="mt-0 lg:mt-2 animate-fade"
                        >
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
                        <div className="lg:hidden block relative h-100 w-full overflow-hidden rounded-4xl border-white">
                            <Image
                                fill
                                alt="Residential solar installation"
                                src={CAROUSEL_CONTENT[current].image}
                                className="object-fill rounded-4xl inverted-radius-image-bottom"
                            />


                            <div className="absolute bottom-0 right-0 flex gap-3 z-10 bg-white pb-2 px-2 rounded-tl-4xl rounded-br-4xl">
                                <button
                                    onClick={() => {
                                    setCurrent((prev) =>
                                        prev === 0 ? CAROUSEL_CONTENT.length - 1 : prev - 1
                                    );
                                    setTimeout(scrollToTop, 100);
                                }}
                                    className="h-12 cursor-pointer w-12 rounded-xl bg-white flex items-center justify-center shadow"
                                >
                                    ←
                                </button>
                                <button
                                     onClick={() => {
                                    setCurrent((prev) => (prev + 1) % CAROUSEL_CONTENT.length);
                                    setTimeout(scrollToTop, 100);
                                }}
                                    className="h-12 w-12 cursor-pointer rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
    hover:opacity-90 text-white flex items-center justify-center shadow"
                                >
                                    →
                                </button>
                            </div>
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
                    <Image
                        fill
                        alt="Residential solar installation"
                        src={CAROUSEL_CONTENT[current].image}
                        className="object-fill rounded-4xl inverted-radius-image-bottom"
                    />


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
