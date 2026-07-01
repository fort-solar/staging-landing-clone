import React from 'react'
import Link from 'next/link'
import { Button } from '../button'

const CalculatorSectionFour = () => {
    return (
        <div>
            <section className="w-full max-w-6xl mx-auto px-4 py-1">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className={`order-2 lg:order-1 flex flex-col h-full py-10 lg:py-16 min-h-[40vh] lg:min-h-[60vh] justify-center text-start gap-5 px-5 lg:px-0`}>
                        <p className='text-[#3B3B3B] leading-16 text-3xl lg:text-5xl font-bold font-poppins'>Need Help Choosing the Right Setup?</p>
                        <p className=' text-[#3B3B3B] '>Our solar experts can fine-tune your setup for maximum efficiency and savings. Get a free consultation and see how much you can save every month</p>
                        <Link href={"/contact"}>
                            <Button
                                className="
                                                                           transition-all
                                                                     text-white
                                                                     cursor-pointer
                                                                     w-full
                                                                     lg:w-fit
                                                                     py-6
                                                                     text-sm
                                                                     flex 
                                                                     items-center 
                                                                     justify-center 
                                                                     gap-3
                                                                     bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)]
                                                                     hover:opacity-90
                                                                   "
                            >
                                Talk to an Expert {" "}{" "}→
                            </Button>
                        </Link>

                    </div>
                    <div className={`order-1 lg:order-2 relative w-full h-full min-h-[30vh] lg:min-h-[60vh]  bg-cover bg-center bg-[url('/calculator_section_four_background.png')]`}></div>
                </div>
            </section>
        </div>
    )
}

export default CalculatorSectionFour