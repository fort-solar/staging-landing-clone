import React from 'react';
import { Button } from '@/components/ui/button';

const CallToActionOne = () => {
    return (
        <div className='mt-20'>
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-10   dark:bg-black sm:items-start bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] rounded-4xl lg:rounded-[108px] flex flex-col items-center justify-center text-center gap-5">
                <div className='max-w-3xl mx-auto'>
                    <p className='text-white leading-16 text-3xl lg:text-5xl font-bold font-poppins'>Ready to power your home or business with solar?</p>

                </div>
                <div className='max-w-xl mx-auto'>
                    <p className=' text-white '>Discover how affordable clean energy can be with FortSolar. Start saving money and the planet in just a few clicks.</p>
                </div>

                <div className='flex gap-5 items-center max-w-xl mx-auto'>
                    <div>
                        <Button className="w-fit bg-transparent border-white border hover:bg-transparent cursor-pointer">
                            Get a Free Quote
                        </Button>
                    </div>
                    <div>
                        <Button className="w-fit bg-white text-[#058a05] hover:bg-white hover:opacity-90 cursor-pointer">
                            Explore Packages
                        </Button>
                    </div>


                </div>

            </div>
        </div>
    )
}

export default CallToActionOne