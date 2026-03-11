"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../button'
import { SlantedArrow } from '@/components/features/icons/SlantedArrow'

interface ContactHeroProps {
    formRef: React.RefObject<HTMLFormElement | null>;
}

const ContactHero = ({ formRef }: ContactHeroProps) => {

    const scrollToForm = () => {
        if (!formRef.current) return;

        const offset = 80;
        const startY = window.scrollY;
        const targetY =
            formRef.current.getBoundingClientRect().top +
            window.scrollY -
            offset;

        const duration = 1000;
        const startTime = performance.now();

        const easeInOutCubic = (t: number) =>
            t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo({
                top: startY + (targetY - startY) * easedProgress,
            });

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };



    return (
        <div className='h-[60vh] lg:h-[40vhth]'>
            <div className="relative h-full z-10 overflow-hidden">
                <Image
                    fill
                    priority
                    src="/contact_hero_image.png"
                    alt="Solar installation background"
                    sizes="100vw"
                    className="object-cover"
                />
                <div className='absolute px-4 inset-0 z-10  flex flex-col items-center space-y-5 text-center justify-center '>
                    <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-white max-w-4xl mx-auto">Start Your Solar Journey Today</h1>
                    <p className='max-w-2xl mx-auto text-white text-lg'>Have questions about our solar products, packages, or installations? Our support and sales team are always ready to help you make the switch to clean, reliable energy.</p>
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-center">
                        <Link href="/energy-calculator" className='w-full lg:w-fit'>
                            <Button
                                className="
                            transition-all
                      text-white
                      cursor-pointer
                      text-sm
                      flex 
                      py-6
w-full lg:w-fit
                      items-center 
                      justify-center 
                      gap-3
                      bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                      hover:opacity-90
                    "
                            >
                                Get a Free Quote
                                <SlantedArrow className='h-1 w-1 arrow' />
                            </Button>
                        </Link>
                        <Button
                            variant={"outline"}
                            className="
                            transition-all
                            border-white
                            text-white
                            bg-transparent
                            w-full lg:w-fit
                            py-6
                      cursor-pointer
                      text-sm
                      hover:opacity-90
                    "
                            onClick={() => {
                                setTimeout(scrollToForm, 100);
                            }}
                        >
                            Send Us a Message
                        </Button>

                    </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-b from-[#01320394] to-[#01320394] z-0" />
            </div>
        </div>
    )
}

export default ContactHero
