import React from 'react'
import Link from 'next/link'
import { Button } from '../button'

const ContactHero = () => {
    return (
        <div className='h-[50vh]'>
            <div className="relative bg-[url('/contact_hero_image.png')] bg-cover bg-center h-full z-10">
                <div className='absolute px-4 inset-0 z-10  flex flex-col items-center space-y-5 text-center justify-center '>
                    <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-white max-w-4xl mx-auto">Start Your Solar Journey Today</h1>
                    <p className='max-w-2xl mx-auto text-white text-lg'>Have questions about our solar products, packages, or installations? Our support and sales team are always ready to help you make the switch to clean, reliable energy.</p>
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-[#01320394] to-[#01320394] z-0" />
            </div>
        </div>
    )
}

export default ContactHero