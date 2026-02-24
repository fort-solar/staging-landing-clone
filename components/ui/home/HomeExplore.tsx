"use client"

import React, { useState } from "react";
import { GreenMarkIcon } from "@/components/features/icons/GreenMarkIcon";
import { Button } from "../button";
import CardOne from "./homeexplorecontents/CardOne";
import CardTwo from "./homeexplorecontents/CardTwo";
import CardThree from "./homeexplorecontents/CardThree";
import CardFour from "./homeexplorecontents/CardFour";
import ProductCardOne from "./homeexplorecontents/products/ProductCardOne";
import ProductCardTwo from "./homeexplorecontents/products/ProductsCardTwo";
import ProductCardThree from "./homeexplorecontents/products/ProductCardThree";
import ProductCardFour from "./homeexplorecontents/products/ProductCardFour";
import { MobileSlider } from '../mobileSlider';
import { SwiperSlide } from "swiper/react";
import Link from "next/link";

const HomeExplore = () => {
    const [activeSection, setActiveSection] = useState("Packages")
    return (
        <div className="bg-[#B8C0CC1A]">
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-1 lg:gap-3">
                    <p className="text-2xl lg:text-5xl font-bold font-poppins">
                        Explore Our Solar
                    </p>
                    <div className="text-2xl lg:text-5xl font-bold font-poppins flex ">
                        <p className="relative inline-flex items-center px-2 py-1 lg:py-4 cursor-pointer" onClick={() => setActiveSection("Packages")}>
                            {activeSection === "Packages" && (<GreenMarkIcon className="absolute inset-0 w-full h-full z-0" />)}
                            <span className={`relative z-10 ${activeSection === "Products" ? "opacity-60" : ""}`}>Packages </span>
                        </p>
                        <p className="relative inline-flex items-center px-2 py-1 lg:py-4">
                            &
                        </p>
                        <p className="relative inline-flex items-center px-2 py-1 lg:py-4 cursor-pointer" onClick={() => setActiveSection("Products")}>
                            {activeSection === "Products" && (<GreenMarkIcon className="absolute inset-0 w-full h-full z-0" />)}
                            <span className={`relative z-10 ${activeSection === "Packages" ? "opacity-60" : ""}`}> Products </span>
                           
                        </p>
                    </div>
                    <p className="mt-2 font-medium max-w-xl hidden lg:block">
                        Affordable and efficient solutions tailored to your needs.
                    </p>
                </div>
                   {     activeSection === "Packages" ? ( <div>
                    <MobileSlider extra={true}>
                        <SwiperSlide><CardOne /></SwiperSlide>
                        <SwiperSlide><CardTwo /></SwiperSlide>
                        <SwiperSlide><CardThree /></SwiperSlide>
                        <SwiperSlide><CardFour /></SwiperSlide>
                    </MobileSlider>
                </div>) : ( <div>
                    <MobileSlider extra={true}>
                        <SwiperSlide><ProductCardOne /></SwiperSlide>
                        <SwiperSlide><ProductCardTwo /></SwiperSlide>
                        <SwiperSlide><ProductCardThree /></SwiperSlide>
                        <SwiperSlide><ProductCardFour /></SwiperSlide>
                    </MobileSlider>
                </div>)
 }
               
               
                {
                    activeSection === "Packages" ? (<div className="md:grid hidden md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                        <CardOne />
                        <CardTwo />
                        <CardThree />
                        <CardFour />
                    </div>) : (<div className="md:grid hidden md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                        <ProductCardOne />
                        <ProductCardTwo />
                        <ProductCardThree />
                        <ProductCardFour />
                    </div>)
                }

             



                <div className="flex items-center justify-center py-4 w-full">
                    <Link href={"/coming-soon"} className="w-full lg:w-fit">
                        <Button
                            className="
                            transition-all
                      text-white
                      cursor-pointer
                      text-sm
                      flex 
                      w-full
                      lg:w-fit
                      rounded-xl
                      py-6
                      items-center 
                      justify-center 
                      gap-3
                      bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                      hover:opacity-90
                    "
                        >
                          {activeSection === "Packages" ? 'See All Packages →' : 'See All Products →'}  
                        </Button>
                    </Link>

                </div>
            </div>
        </div>

    )
}

export default HomeExplore
