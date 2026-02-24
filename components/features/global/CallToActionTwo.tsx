import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CallToActionTwo = () => {
    return (
        <div className='mt-20'>
            <div className="min-h-[40vh] lg:min-h-[60vh] w-full max-w-6xl mx-auto  dark:bg-black sm:items-start rounded-3xl md:rounded-[80px]   lg:rounded-[108px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="bg-[#013201]
    lg:flex flex-col justify-center h-full hidden
    gap-4 px-6 py-10 lg:px-16">
                    <p className='text-white leading-16 text-3xl md:text-4xl lg:text-5xl font-bold font-poppins'>Join Our Installer Network</p>
                    <p className=' text-white '>Are you a certified installer? Reach more customers and grow your business with Fortsolar</p>
                    <Link href={"/coming-soon"}>
                        <Button className="w-fit bg-transparent py-6 rounded-xl border-white border hover:bg-transparent cursor-pointer">
                            Become an Installer
                        </Button>
                    </Link>

                </div>
                <div className="hidden lg:block relative w-full h-full bg-[url('/man_carrying_solar_panel.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-linear-to-l from-[rgba(1,50,1,0)] to-[#013203] z-0" />
                </div>
                <div className="block lg:hidden relative bg-[url('/man_carrying_solar_panel.png')] bg-cover bg-center ">
                    <div className='absolute px-4 py-8 inset-0 z-10 h-full w-full flex flex-col justify-between items-center space-y-5'>
                        <div>
                            <p className='text-white leading-16 text-2xl lg:text-5xl font-bold font-poppins'>Join Our Installer Network</p>
                            <p className=' text-white '>Are you a certified installer? Reach more customers and grow your business with Fortsolar</p>
                        </div>
                        <Link href={"/coming-soon"} className="w-full">
                            <Button className="w-full py-6 bg-transparent rounded-xl border-white border hover:bg-transparent cursor-pointer">
                                Become an Installer
                            </Button>
                        </Link>
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-[#01320117] to-[#013203] z-0" />
                </div>

            </div>
        </div>
    )
}

export default CallToActionTwo