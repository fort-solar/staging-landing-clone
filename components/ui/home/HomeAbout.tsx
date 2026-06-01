import React from 'react';
import { Button } from '../button';
import Image from 'next/image';
import Link from 'next/link';
import { solar_cells, man_carrying_solar_panel, solar_installation_image_double_cut } from '@/components/features/images'

const HomeAbout = () => {
    return (
        <div>
            <div className='flex flex-col lg:flex-row justify-center text-start gap-6 lg:gap-2 lg:justify-between w-full items-start mt-5'>
                <div className="text-3xl lg:text-5xl font-bold font-poppins mt-2">
                    About Fortsolar
                </div>
                <div className="w-full lg:w-fit">
                    <Link href="/coming-soon" className="w-full lg:w-fit">
                        <Button variant="outline" className="w-full py-6 lg:w-fit border-[#0000004D] cursor-pointer rounded-xl">
                            Get a Free Quote
                        </Button>
                    </Link>

                </div>
            </div>

           `     <div className='max-w-4xl mt-7'>
                    <p>We transform how people power their homes and businesses across Nigeria. Established in 2022, we’re committed to providing reliable, affordable, and future-ready solar energy solutions that help households, offices, and remote workers save time and money on electricity bills.</p>
                </div>`

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
                <div className='grid grid-cols-1 lg:grid-cols-2'>


                    <div className='bg-[#EBFAEB80] h-125'>
                        <div className='h-[50%] p-4 space-y-2'>
                            <p className='text-sm font-bold'>01</p>
                            <p className='font-medium text-2xl font-poppins'>Our Mission</p>
                            <p>To empower individuals and businesses with dependable, cost-effective solar solutions that drive sustainability, reduce carbon footprints, and ensure continuous access to clean energy.</p>
                        </div>
                        <div className='h-[50%] p-4 relative'>
                            <Image
                                fill
                                alt="Solar cells close-up"
                                src={solar_cells}
                                sizes="(min-width: 1024px) 33vw, 100vw"
                                className="object-cover rounded-4xl px-4 py-4"
                            />
                        </div>
                    </div>


                    <div className='bg-[#DAF1FB80] h-125 flex flex-col-reverse lg:flex-col'>
                        <div className='h-[50%] p-4 relative'>
                            <Image
                                fill
                                alt="Technician carrying a solar panel"
                                src={man_carrying_solar_panel}
                                sizes="(min-width: 1024px) 33vw, 100vw"
                                className="object-cover rounded-4xl px-4 py-4"
                            />
                        </div>
                        <div className='h-[50%] p-4 space-y-2'>
                            <p className='text-sm font-bold'>02</p>
                            <p className='font-medium text-2xl font-poppins'>Our Vision</p>
                            <p>To be a leading force in Africa’s renewable energy revolution, ensuring every home and business has access to clean, sustainable, and affordable power.</p>
                        </div>
                    </div>

                </div>

                <div>
                    <div className="hidden lg:block relative h-125 w-full rounded-4xl overflow-hidden">
                        <div className="w-full h-full">
                            <Image
                                fill
                                alt="Solar installation with panel array"
                                src={solar_installation_image_double_cut}
                                sizes="(min-width: 1024px) 40vw, 100vw"
                                className="object-fit w-full h-full"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 flex gap-3 z-10 bg-transparent pb-2 px-4 rounded-tl-4xl rounded-br-4xl">
                            <Link href="/about">
                                <Button className="cursor-pointer px-9 py-5 text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:opacity-90">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className='lg:hidden block w-full'>
                        <Link href="/about">
                            <Button className="w-full mt-4  py-6 cursor-pointer text-white rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:opacity-90">
                                Learn More
                            </Button>
                        </Link>
                    </div>




                </div>
            </div>


        </div>
    )
}

export default HomeAbout
