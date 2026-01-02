import React from "react";
import { GreenMarkIcon } from "@/components/features/icons/GreenMarkIcon";
import Image from "next/image";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { Button } from "../button";
import { our_packages_one, our_packages_two, our_packages_three, our_packages_four } from "@/components/features/images";

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                    <div className="
  group flex flex-col justify-between rounded-lg pt-4 px-4
  bg-white border border-transparent cursor-pointer
  transition-all duration-300
  hover:bg-[#EBFAEB] hover:border-[#058A05]
">
                        <div className="flex w-full justify-between items-center">
                            <p className="font-semibold text-lg">
                                Campus Lite Bundle
                            </p>

                            <div className="
      border p-3 rounded-lg border-[#CCCCCC]
      transition-all duration-300
      group-hover:bg-[#058A05]
      group-hover:border-[#058A05]
    ">
                                <SlantedArrow
                                    className="
          text-[#058A05]
          transition-colors duration-300
          group-hover:text-white
        "
                                />
                            </div>
                        </div>

                        <div className="relative h-75 lg:h-62.5 mt-5">
                            <Image
                                fill
                                alt="our_packages_one"
                                src={our_packages_one}
                                className="object-fill rounded-t-lg"
                            />
                        </div>
                    </div>


                    <div className=" group flex flex-col justify-between rounded-lg pt-4 px-4 bg-white border border-transparent cursor-pointer transition-all duration-300  hover:bg-[#EBFAEB] hover:border-[#058A05]">
                        <div className="flex w-full justify-between items-center">
                            <p className="font-semibold text-lg">
                                5kva Home Solar Bundle
                            </p>
                            <div className="
      border p-3 rounded-lg border-[#CCCCCC]
      transition-all duration-300
      group-hover:bg-[#058A05]
      group-hover:border-[#058A05]
    ">
                                <SlantedArrow
                                    className="
          text-[#058A05]
          transition-colors duration-300
          group-hover:text-white
        "
                                />
                            </div>
                        </div>
                        <div className="relative h-75 lg:h-62.5 mt-5">
                            <Image
                                fill
                                alt="our_packages_two"
                                src={our_packages_two}
                                className="object-fill rounded-t-lg"
                            />
                        </div>
                    </div>
                    <div className="
  group flex flex-col justify-between rounded-lg pt-4 px-4
  bg-white border border-transparent cursor-pointer
  transition-all duration-300
  hover:bg-[#EBFAEB] hover:border-[#058A05]
">
                        <div className="flex w-full justify-between items-center">
                            <p className="font-semibold text-lg">
                                Campus Bundle
                            </p>
                            <div className="
      border p-3 rounded-lg border-[#CCCCCC]
      transition-all duration-300
      group-hover:bg-[#058A05]
      group-hover:border-[#058A05]
    ">
                                <SlantedArrow
                                    className="
          text-[#058A05]
          transition-colors duration-300
          group-hover:text-white
        "
                                />
                            </div>
                        </div>
                        <div className="relative h-75 lg:h-62.5 mt-5">
                            <Image
                                fill
                                alt="our_packages_three"
                                src={our_packages_three}
                                className="object-fill rounded-t-lg"
                            />
                        </div>
                    </div>

                    <div className="
  group flex flex-col justify-between rounded-lg pt-4 px-4
  bg-white border border-transparent cursor-pointer
  transition-all duration-300
  hover:bg-[#EBFAEB] hover:border-[#058A05]
">
                        <div className="flex w-full justify-between items-center">
                            <p className="font-semibold text-lg">
                                3kva Commercial Bundle
                            </p>
                            <div className="
      border p-3 rounded-lg border-[#CCCCCC]
      transition-all duration-300
      group-hover:bg-[#058A05]
      group-hover:border-[#058A05]
    ">
                                <SlantedArrow
                                    className="
          text-[#058A05]
          transition-colors duration-300
          group-hover:text-white
        "
                                />
                            </div>
                        </div>
                        <div className="relative h-75 lg:h-62.5 mt-5">
                            <Image
                                fill
                                alt="our_packages_four"
                                src={our_packages_four}
                                className="object-fill rounded-t-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center py-4">
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
                </div>
            </div>
        </div>

    )
}

export default HomeExplore
