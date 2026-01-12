import React from 'react'
import { Button } from '@/components/ui/button';

const CallToActionTwo = () => {
    return (
        <div className='mt-20'>
            <div className="min-h-[40vh] lg:min-h-[60vh] w-full max-w-6xl mx-auto  dark:bg-black sm:items-start   lg:rounded-[108px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className='bg-[#013201] flex flex-col h-full items-start justify-center text-start gap-5 px-5 lg:px-16'>
                    <p className='text-white leading-16 text-3xl lg:text-5xl font-bold font-poppins'>Join Our Installer Network</p>
                    <p className=' text-white '>Are you a certified installer? Reach more customers and grow your business with FortSolar</p>
                    <Button className="w-fit bg-transparent border-white border hover:bg-transparent cursor-pointer">
                        Become an Installer
                    </Button>
                </div>



                <div className="hidden md:block relative w-full h-full bg-[url('/man_carrying_solar_panel.png')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-linear-to-l from-[rgba(1,50,1,0)] to-[#013203] z-0" />
                </div>

            </div>
        </div>
    )
}

export default CallToActionTwo