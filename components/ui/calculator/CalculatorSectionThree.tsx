"use client"

import React from 'react'
import CardOne from '../home/homeexplorecontents/CardOne'
import CardTwo from '../home/homeexplorecontents/CardTwo'
import CardThree from '../home/homeexplorecontents/CardThree'
import CardFour from '../home/homeexplorecontents/CardFour'
import { MobileSlider } from '../mobileSlider';
import { SwiperSlide } from "swiper/react";

const CalculatorSectionThree = () => {
    return (
        <div>
            <section className="w-full max-w-6xl mx-auto px-4 my-10">
                <div className='max-w-xl'>
                    <div className="text-3xl leading-10 lg:leading-16 lg:text-5xl font-bold font-poppins mt-2">
                        Your Perfect Solar Package
                    </div>
                    <div className=' mt-7'>
                        <p>We’ve matched your energy needs with the best-fit solar Package complete with panels, inverter, batteries, and free installation. You can adjust or upgrade anytime.</p>
                    </div>
                </div>
                <div className='py-6'>
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
                </div>


            </section>
        </div>
    )
}

export default CalculatorSectionThree