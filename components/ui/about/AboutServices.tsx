import React from 'react'
import { Button } from '../button'

const AboutServices = () => {
    return (
        <div>
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 pt-10 space-y-10  dark:bg-black sm:items-start">
                <div className="text-3xl lg:text-5xl text-[#3B3B3B] font-bold font-poppins mt-2">
                    Our Services
                </div>
                <div className='max-w-4xl text-[#3B3B3B] mt-7'>
                    <p>Explore the range of solar solutions we offer from quality products to expert installations and reliable support designed to keep your home or business powered efficiently.</p>
                </div>
                <div>
                    <div className="min-h-[40vh] lg:min-h-[60vh] w-full max-w-6xl mx-auto  dark:bg-black sm:items-start   lg:rounded-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                        <div className='bg-[#F1F2F5] flex flex-col h-full items-start justify-center text-start gap-5 px-5 lg:px-16'>
                            <p className='text-[#3B3B3B] leading-16 text-3xl lg:text-5xl font-bold font-poppins'>Solar Products</p>
                            <p className=' text-[#3B3B3B] '>Power your space with our wide range of quality solar panels, batteries, inverters, fans, streetlights, floodlights and more sourced from reliable manufacturers, designed for durability and performance.</p>
                            <Button
                                className="
                                                                           transition-all
                                                                     text-white
                                                                     cursor-pointer
                                                                     w-fit
                                                                     text-sm
                                                                     flex 
                                                                     items-center 
                                                                     justify-center 
                                                                     gap-3
                                                                     bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                                                                     hover:opacity-90
                                                                   "
                            >
                                Shop Products {" "}{" "}→
                            </Button>
                        </div>
                        <div className="hidden md:block relative w-full h-full bg-[url('/about_services.png')] bg-cover bg-center">
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutServices