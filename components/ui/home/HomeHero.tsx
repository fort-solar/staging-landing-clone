"use client"

import React, { useState, useEffect } from "react";
import { CAROUSEL_CONTENT } from "@/components/features/constants";
import { Button } from "../button";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { GreenTick } from "@/components/features/icons/Greentick";
import Image from "next/image";


const HomeHero = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((current + 1) % CAROUSEL_CONTENT.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [current, setCurrent]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
                <div className='flex flex-col gap-5'>
                    <div
                        className="p-2 text-sm w-fit rounded-lg font-medium transition-all"
                        style={{
                            backgroundColor: CAROUSEL_CONTENT[current].toast_background_color,
                            color: CAROUSEL_CONTENT[current].toast_color,
                        }}
                    >
                        {CAROUSEL_CONTENT[current].toast}
                    </div>
                    <div className="text-6xl font-bold font-poppins mt-2 transition-all">
                        {CAROUSEL_CONTENT[current].title}
                    </div>
                    <div className="text-lg mt-2 transition-all">
                        {CAROUSEL_CONTENT[current].content}
                    </div>
                    <div className="mt-2 ">
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
                    </div>
                </div>
                <div className="mt-6">

                </div>
            </div>
            <div className="relative">
                <Image  fill  alt="solar installation image" src={CAROUSEL_CONTENT[current].image}/>
            </div>
        </div>
    )
}

export default HomeHero