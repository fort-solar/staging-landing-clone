import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { INSTALLER_SIGNUP_URL } from "@/lib/store-links";

const CallToActionTwo = () => {
    return (
        <div className='mt-20'>
            <div className="w-full max-w-6xl mx-auto rounded-3xl md:rounded-[80px] lg:rounded-[108px] bg-[#013201] grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-[320px]">
                {/* Left side: text details (Always visible on all viewports) */}
                <div className="flex flex-col justify-center gap-4 px-6 py-10 md:px-12 lg:px-16 text-left">
                    <p className='text-white text-3xl md:text-4xl lg:text-5xl font-bold font-poppins leading-tight'>Join Our Installer Network</p>
                    <p className='text-white text-sm md:text-base'>Are you a certified installer? Reach more customers and grow your business with Fortsolar</p>
                    <Link href={INSTALLER_SIGNUP_URL} className="w-full md:w-fit">
                        <Button className="w-full md:w-fit bg-transparent py-6 rounded-xl border-white border hover:bg-transparent cursor-pointer">
                            Become an Installer
                        </Button>
                    </Link>
                </div>
                {/* Right side: image (Shown on tablet and desktop) */}
                <div className="hidden md:block relative w-full h-full min-h-[300px] bg-[url('/man_carrying_solar_panel.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-linear-to-l from-[rgba(1,50,1,0)] to-[#013203] z-0" />
                </div>
            </div>
        </div>
    )
}

export default CallToActionTwo
