import React from 'react';
import Image from 'next/image';
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import { our_packages_four } from "@/components/features/images";

const CardFour = () => {
    return (
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
    )
}

export default CardFour