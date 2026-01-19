import React from 'react'
import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { FacebookIcon } from '@/components/features/icons/FacebookIcon';
import { LinkedinIcon } from '@/components/features/icons/LinkedinIcon';
import { TwitterIcon } from '@/components/features/icons/TwitterIcon';

const ContactSectionOne = () => {
    return (
        <div>
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 pt-10 space-y-10  dark:bg-black sm:items-start">
                <div className='my-10'>
                    <div className=" w-fit p-4 rounded-t-lg transition-all text-white cursor-pointer text-sm flex items-center justify-center  gap-3 bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:opacity-90">
                        <p className='font-medium'>Lagos Experience Centre</p>
                    </div>
                    <div className='border grid grid-cols-1 lg:grid-cols-3'>
                        <div className="p-7 border-r border-b">
                            <Mail className='text-[#058A05] w-5 h-5 mb-5' />
                            <div className='mt-2 flex flex-col gap-1'>
                                <p className='text-[#101828] text-lg font-semibold'>Email Address</p>
                                <Link href={"mailto:enquiry@fortsolar.ng"} className='text-[#667085] text-sm'>enquiry@fortsolar.ng</Link>
                            </div>
                        </div>
                        <div className="p-7 border-r border-b">
                            <Phone className='text-[#058A05] w-5 h-5 mb-5' />
                            <div className='mt-2 flex flex-col gap-1'>
                                <p className='text-[#101828] text-lg font-semibold'>Call Us</p>
                                <Link href={"tel:+2347066524793"} className='text-[#667085] text-sm'>+234 706 652 4793</Link>
                                <Link href={"tel:+2342013309043"} className='text-[#667085] text-sm'>+234 201 330 9043</Link>
                            </div>
                        </div>
                        <div className="p-7 border-r border-b">
                            <MapPin className='text-[#058A05] w-5 h-5 mb-5' />
                            <div className='mt-2'>
                                {/* <p className='text-[#101828] text-lg font-semibold'>Lagos Experience Centre</p> */}
                                <p className='text-[#667085] text-sm'>Suite D1 038 HFP Eastline Shopping Complex Abraham Adesanya Axis, Lekki-Epe Expressway, Lagos</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-10'>
                    <div className=" w-fit p-4 rounded-t-lg transition-all text-white cursor-pointer text-sm flex items-center justify-center  gap-3 bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:opacity-90">
                        <p className='font-medium'>Uyo Experience Centre</p>
                    </div>
                    <div className='border grid grid-cols-1 lg:grid-cols-3'>
                        <div className="p-7 border-r border-b">
                            <Mail className='text-[#058A05] w-5 h-5 mb-5' />
                            <div className='mt-2 flex flex-col gap-1'>
                                <p className='text-[#101828] text-lg font-semibold'>Email Address</p>
                                <Link href={"mailto:enquiry@fortsolar.ng"} className='text-[#667085] text-sm'>enquiry@fortsolar.ng</Link>
                            </div>
                        </div>
                        <div className="p-7 border-r border-b">
                            <Phone className='text-[#058A05] w-5 h-5 mb-5' />
                            <div className='mt-2 flex flex-col gap-1'>
                                <p className='text-[#101828] text-lg font-semibold'>Call Us</p>
                                <Link href={"tel:+2349076160371"} className='text-[#667085] text-sm'>+234 907 616 0371</Link>
                                <Link href={"tel:+2349076160371"} className='text-[#667085] text-sm'>+234 907 616 0371</Link>
                            </div>
                        </div>
                        <div className="p-7 border-r border-b">
                            <MapPin className='text-[#058A05] w-5 h-5 mb-5' />
                            <div className='mt-2'>
                                {/* <p className='text-[#101828] text-lg font-semibold'>Uyo Experience Centre</p> */}
                                <p className='text-[#667085] text-sm'>183 Ikot Ekpene Road, Uyo, Akwa Ibom State</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-5 items-center justify-center'>
                    <TwitterIcon />
                    <LinkedinIcon className='text-[#058A05]'/>
                    {/* #3B3B3B */}
                    <FacebookIcon />
                </div>˝

            </div>
        </div>
    )
}

export default ContactSectionOne