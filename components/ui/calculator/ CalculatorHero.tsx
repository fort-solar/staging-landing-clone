import React from 'react'
import Link from 'next/link'
import { Button } from '../button'
import { SlantedArrow } from '@/components/features/icons/SlantedArrow'

const CalculatorHero = () => {
    return (
        <div className='h-[35vh]'>
            <div className="relative bg-[url('/calculator_hero_image.jpg')] bg-cover bg-center h-full z-10">
            <div className='absolute px-4 inset-0 z-10 max-w-6xl mx-auto flex items-center justify-between'>
                <h1 className="max-w-2xl text-4xl lg:text-5xl font-bold font-poppins text-white leading-10 lg:leading-16 ">Find Out How Much Energy You Really Need</h1>
                 <Link href="">
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