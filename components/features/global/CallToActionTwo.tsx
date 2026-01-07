import React from 'react'
import { Button } from '@/components/ui/button';
import { man_carrying_solar_panel } from '../images';
import Image from 'next/image';

const CallToActionTwo = () => {
    return (
        <div className='mt-20'>
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto  dark:bg-black sm:items-start  rounded-4xl lg:rounded-[108px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

                <div className='bg-[#013201] flex flex-col h-full items-start justify-center text-start gap-5 px-16'>
                    <p className='text-white leading-16 text-3xl lg:text-5xl font-bold font-poppins'>Join Our Installer Network</p>
                    <p className=' text-white '>Are you a certified installer? Reach more customers and grow your business with FortSolar</p>
                    <Button className="w-fit bg-transparent border-white border hover:bg-transparent cursor-pointer">
                        Become an Installer
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default CallToActionTwo