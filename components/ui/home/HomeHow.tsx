import React from 'react'
import { Button } from '../button';
import Image from 'next/image';
import { how_it_works_one, how_it_works_two, how_it_works_three, how_it_works_four } from '@/components/features/images';

const HomeHow = () => {
    return (
        <div className="bg-[#B8C0CC1A]">
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-20 space-y-10  dark:bg-black sm:items-start">
                 <div className='flex flex-col lg:flex-row justify-center text-center gap-6 lg:gap-2 lg:text-start lg:justify-between w-full items-center mt-5'>
                    <div className="text-3xl lg:text-5xl font-bold font-poppins mt-2">
                        How It Works
                    </div>
                    <div>
                        <Button variant="outline" className="w-fit border-[#0000004D] cursor-pointer">
                            Get Started
                        </Button>
                    </div>
                </div>
                <div className='max-w-4xl mt-7'>
                    <p>Get started with solar energy in these easy steps.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[#CCCCCC]'>
                    <div className='border-r p-2 border-[#CCCCCC]'>
                        <div className='bg-white p-4 rounded-lg group'>

                            <div className='space-y-4 flex flex-col justify-between'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                                    </div>
                                    <div>
                                        <p className='text-[#CCCCCC] font-semibold'>01</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="pb-2 font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                                        Browse Products & Packages
                                    </p>

                                    <p className='text-sm'>Explore solar options tailored to your home or business needs.</p>
                                </div>

                                <div className="relative h-75 lg:h-50 mt-5">
                                    <Image
                                        fill
                                        alt="how_it_works_one"
                                        src={how_it_works_one}
                                        className="object-fill rounded-t-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border-r p-2 border-[#CCCCCC]'>
                        <div className='bg-white p-4 rounded-lg group h-full'>
                            <div className='space-y-4 flex flex-col justify-between'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                                    </div>
                                    <div>
                                        <p className='text-[#CCCCCC] font-semibold'>02</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                                        Get Quote
                                    </p>

                                    <p className='text-sm'>Request a personalized quote that fits your energy goals and budget from us.</p>
                                </div>
                                <div className="relative h-75 lg:h-50 mt-5">
                                    <Image
                                        fill
                                        alt="how_it_works_two"
                                        src={how_it_works_two}
                                        className="object-fill rounded-t-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border-r p-2 border-[#CCCCCC]'>
                        <div className='bg-white p-4 rounded-lg group h-full'>

                            <div className='space-y-4 flex flex-col justify-between h-full'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                                    </div>
                                    <div>
                                        <p className='text-[#CCCCCC] font-semibold'>03</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                                        Book Installation
                                    </p>

                                    <p className='text-sm'>Schedule a quick, professional installation with our certified experts.</p>
                                </div>
                                <div className="relative h-75 lg:h-50 mt-5">
                                    <Image
                                        fill
                                        alt="how_it_works_three"
                                        src={how_it_works_three}
                                        className="object-fill rounded-t-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-2'>
                        <div className='bg-white p-4 rounded-lg group h-full'>

                            <div className='space-y-4 flex flex-col justify-between h-full'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                    </div>
                                    <div>
                                        <p className='text-[#CCCCCC] font-semibold'>04</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                                        Start Saving
                                    </p>

                                    <p className='text-sm'>Enjoy uninterrupted power and reduced electricity costs from day one.</p>
                                </div>
                                <div className="relative h-75 lg:h-50 mt-5">
                                    <Image
                                        fill
                                        alt="how_it_works_four"
                                        src={how_it_works_four}
                                        className="object-fill rounded-t-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default HomeHow