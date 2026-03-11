import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../button'
import { SlantedArrow } from '@/components/features/icons/SlantedArrow'

const CalculatorHero = () => {
    return (
        <div className='h-[45vh] lg:h-[35vh]'>
            <div className="relative h-full z-10 overflow-hidden">
                <Image
                    fill
                    priority
                    src="/calculator_hero_image.jpg"
                    alt="Solar panels background"
                    sizes="100vw"
                    className="object-cover"
                />
            <div className='absolute px-4 inset-0 z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center mt-10 lg:mt-0 text-start gap-5 lg:gap-0 justify-start lg:justify-between'>
                <h1 className="max-w-2xl text-4xl lg:text-5xl font-bold font-poppins text-white leading-10 lg:leading-16 ">Find Out How Much Energy You Really Need</h1>
                 <Link href="" className="w-full lg:w-fit">
                            <Button
                                className="
                            transition-all
                      text-white
                      cursor-pointer
                      text-sm
                      flex 
                      w-full
                      lg:w-fit
                      py-6
                      items-center 
                      justify-center 
                      gap-3
                      bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                      hover:opacity-90
                    "
                            >
                                Start Calculating Now
                                <SlantedArrow className='h-1 w-1 arrow' />
                            </Button>
                        </Link>
            </div>
                <div className="absolute inset-0 bg-linear-to-b from-[#01320394] to-[#01320394] z-0" />
            </div>
        </div>

    )
}

export default CalculatorHero
