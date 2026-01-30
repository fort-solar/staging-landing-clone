"use client"

import React from 'react'
import CardOne from './calculatorhowcontents/CardOne';
import CardTwo from './calculatorhowcontents/CardTwo';
import CardThree from './calculatorhowcontents/CardThree';
import CardFour from './calculatorhowcontents/CardFour';
import { MobileSlider } from '../mobileSlider';
import { SwiperSlide } from "swiper/react";

const CalculatorSectionOne = () => {
    return (
        <div>
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 pt-10 space-y-10  dark:bg-black sm:items-start">
                <div className='flex flex-col lg:flex-row justify-center text-center  gap-6 lg:gap-2 lg:text-start lg:justify-between w-full items-center mt-5'>
                    <div className="max-w-3xl leading-10 lg:leading-16 text-3xl lg:text-5xl font-bold font-poppins mt-2">
                        How to Use the Energy Calculator
                    </div>
                    <div className="">
                        <p className='max-w-xl'>
                            Follow these simple steps to know your exact energy needs and find the best solar Package. Then complete with free installation.
                        </p>
                    </div>
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
                <div>
                    <p className="italic">Note: <span>Start by typing the item and it will suggest an appliance and wattage, you can then adjust as desired. </span> </p>
                </div>
            </div>
        </div>
    )
}

export default CalculatorSectionOne