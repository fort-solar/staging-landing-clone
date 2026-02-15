"use client"

import React from 'react'
import { Button } from '../button';
import CardOne from './homehowcontents/CardOne';
import CardTwo from './homehowcontents/CardTwo';
import CardThree from './homehowcontents/CardThree';
import CardFour from './homehowcontents/CardFour';
import { MobileSlider } from '../mobileSlider';
import { SwiperSlide } from "swiper/react";
import Link from 'next/link';

const HomeHow = () => {
    return (
        <div className="bg-[#B8C0CC1A]">
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-20 space-y-10  dark:bg-black sm:items-start">
                <div className='flex flex-col lg:flex-row justify-center text-start gap-6 lg:gap-2 lg:justify-between w-full items-start mt-5'>
                    <div className="text-3xl lg:text-5xl font-bold font-poppins mt-2">
                        How It Works
                    </div>
                    <div className='max-w-4xl mb-2 block lg:hidden'>
                        <p>Get started with solar energy in these easy steps.</p>
                    </div>
                    <div className="w-full lg:w-fit">
                        <Link href="/coming-soon" className="w-full lg:w-fit">
                            <Button variant="outline" className="w-full py-6 lg:w-fit border-[#0000004D] cursor-pointer">
                                Get Started
                            </Button>
                        </Link>

                    </div>
                </div>
                <div className='max-w-4xl mt-7 hidden lg:block'>
                    <p>Get started with solar energy in these easy steps.</p>
                </div>
                <div>
                    <MobileSlider>
                        <SwiperSlide><CardOne /></SwiperSlide>
                        <SwiperSlide><CardTwo /></SwiperSlide>
                        <SwiperSlide><CardThree /></SwiperSlide>
                        <SwiperSlide><CardFour /></SwiperSlide>
                    </MobileSlider>
                </div>
                <div className='hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[#CCCCCC]'>
                    <CardOne />
                    <CardTwo />
                    <CardThree />
                    <CardFour />
                </div>
            </div>

        </div>
    )
}

export default HomeHow