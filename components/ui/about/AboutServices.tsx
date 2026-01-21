"use client"


import React from 'react';
import { Button } from '../button';
import { Swiper, SwiperSlide } from 'swiper/react';
import "./swiper.css";
import 'swiper/css';
import { Autoplay, EffectCards } from 'swiper/modules';
import { servicesSlides } from '@/components/features/constants';
import Link from 'next/link';


const AboutServices = () => {
    return (
        <div>
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 pt-10 space-y-10  dark:bg-black sm:items-start">
                <div className="text-3xl lg:text-5xl text-[#3B3B3B] font-bold font-poppins mt-2">
                    Our Services
                </div>
                <div className='max-w-4xl text-[#3B3B3B] mt-7'>
                    <p>Explore the range of solar solutions we offer from quality products to expert installations and reliable support designed to keep your home or business powered efficiently.</p>
                </div>
                <div>

                    <div className="relative h-full flex justify-center items-center w-full" id="app">
                        <Swiper
                            effect={'cards'}
                            grabCursor={true}
                            loop={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay, EffectCards]}
                            className="w-full h-full overflow hidden lg:rounded-[18px]"
                        >
                            {servicesSlides.map((s, i) => {
                                const image = s.rightBackgroundImage;


                                return (
                                 <SwiperSlide key={i}>
                                    <div className="min-h-[40vh] lg:min-h-[60vh] w-full max-w-6xl mx-auto  dark:bg-black sm:items-start   lg:rounded-[18px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                                        <div className={`flex flex-col h-full items-start justify-center text-start gap-5 px-5 lg:px-16`} style={{ backgroundColor: s.leftColor }}>
                                            <p className='text-[#3B3B3B] leading-16 text-3xl lg:text-5xl font-bold font-poppins'>{s.title}</p>
                                            <p className=' text-[#3B3B3B] '>{s.description}</p>
                                            <Link href={s.link}>
                                                <Button
                                                    className="
                                                                           transition-all
                                                                     text-white
                                                                     cursor-pointer
                                                                     w-fit
                                                                     text-sm
                                                                     flex 
                                                                     items-center 
                                                                     justify-center 
                                                                     gap-3
                                                                     bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                                                                     hover:opacity-90
                                                                   "
                                                >
                                                    {s.buttonName} {" "}{" "}→
                                                </Button>
                                            </Link>

                                        </div>
                                        <div className={`hidden md:block relative w-full h-full  bg-cover bg-center`} style={{ backgroundImage: `url(${image})` }}>
                                        </div>

                                    </div>
                                </SwiperSlide>   
                                )
                                
})}


                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutServices



