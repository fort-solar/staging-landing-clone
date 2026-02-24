import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CallToActionOne = () => {
    return (
        <div className='mt-20'>
            <div className="min-h-[20vh] lg:min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-12 lg:py-0 dark:bg-black sm:items-start bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] rounded-3xl md:rounded-[80px] lg:rounded-[108px] flex flex-col items-center justify-center text-center gap-5">
                <div className='max-w-3xl mx-auto'>
                    <p className='text-white leading-10 lg:leading-16 text-2xl lg:text-5xl font-bold font-poppins'>Ready to power your home or business with solar?</p>
                </div>
                <div className='max-w-xl mx-auto'>
                    <p className='text-white'>Discover how affordable clean energy can be with Fortsolar. Start saving money and the planet in just a few clicks.</p>
                </div>
                <div className='flex flex-col lg:flex-row gap-5 mt-8 lg:mt-0 items-center justify-center w-full lg:max-w-xl mx-auto'>
                    <div className='w-full lg:w-fit'>
                        <Link href={"/coming-soon"} className="w-full lg:w-fit">
                            <Button className="w-full lg:w-fit py-6 rounded-xl bg-transparent border-white border hover:bg-transparent cursor-pointer">
                                Get a Free Quote
                            </Button>
                        </Link>

                    </div>
                    <div className='w-full lg:w-fit'>
                        <Link href="/coming-soon" className="w-full lg:w-fit">
                            <Button className="w-full lg:w-fit py-6 rounded-xl bg-white text-[#058a05] hover:bg-white hover:opacity-90 cursor-pointer">
                                Explore Packages
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CallToActionOne