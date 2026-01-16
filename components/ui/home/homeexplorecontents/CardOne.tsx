import React from 'react';
import { our_packages_one } from "@/components/features/images";
import Image from 'next/image';
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";


const CardOne = () => {
    return (
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
    )
}

export default CardOne