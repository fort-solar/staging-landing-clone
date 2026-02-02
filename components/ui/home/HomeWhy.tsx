import React from 'react';
import { SolarfinancingIcon } from '@/components/features/icons/SolarfinancingIcon';
import { FreeInstallationIcon } from '@/components/features/icons/FreeInstallationIcon';
import { CustomerSupportIcon } from '@/components/features/icons/CustomerSupportIcon';
import { WarrantyAuditIcon } from '@/components/features/icons/WarrantyAuditIcon';
import Image from 'next/image';
import { PlayIcon } from '@/components/features/icons/PlayIcon';
import { Result } from '@/components/features/images';


const HomeWhy = () => {
    return (
        <div className="bg-[#B8C0CC1A]">
            <div className='bg-white rounded-4xl lg:rounded-[108px]'>
                <div className=" min-h-screen w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                    <div className="mt-6 flex flex-col items-center text-center gap-3">
                        <p className="text-3xl lg:text-5xl font-medium font-poppins">
                            <span className='font-bold'>Why Choose Us</span>  for Your Energy Transformation Journey?
                        </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 py-10'>
                        <div className="min-h-75 relative bg-[#DAF1FB] rounded-2xl p-6">
                            <div className="relative rounded-2xl h-full bg-[url('/video_background.jpg')] bg-cover bg-center">
                                <div className="rounded-2xl absolute inset-0 bg-linear-to-b from-[#168ABD80] via-[#168ABD80] to-[#168ABD80] z-0" />
                            </div>
                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <button className="bg-transparent cursor-pointer rounded-full p-4 shadow-lg transition">
                                    <PlayIcon className="w-14 h-14 text-[#168ABD]" />
                                </button>
                            </div>
                            <div className='hidden lg:block absolute -bottom-12 -right-14 p-5 bg-[#DAF1FB] rounded-2xl'>
                                <Image src={Result} alt="Solar performance chart result" height={150} width={150} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-6'>
                            <div className='justify-end w-full flex'>
                                <div className="max-w-[90%] lg:max-w-[85%] grid grid-cols-[1fr_11fr] gap-4 bg-gray-50 p-4 rounded-xl">
                                    <FreeInstallationIcon className='w-8 h-8' />
                                    <div>
                                        <p className="text-[16px] font-bold">Free Installation</p>
                                        <p className="text-sm">Enjoy quick, efficient service at no extra cost, every system comes with free setup by our professionals.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='justify-start w-full flex'>
                                <div className="max-w-[90%] lg:max-w-[85%] grid grid-cols-[1fr_11fr] gap-4 bg-[#EBFAEB] p-4 rounded-xl">
                                    <SolarfinancingIcon className='w-8 h-8' />
                                    <div>
                                        <p className="text-[16px] font-bold">Solar Financing</p>
                                        <p className="text-sm">Pay a small upfront amount and spread the balance across 3–24 months.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='justify-end w-full flex'>
                                <div className="max-w-[90%] lg:max-w-[85%] grid grid-cols-[1fr_11fr] gap-4 bg-gray-50 p-4 rounded-xl">
                                    <CustomerSupportIcon className='w-8 h-8' />
                                    <div>
                                        <p className="text-[16px] font-bold">24/7 Customer Support</p>
                                        <p className="text-sm">Our dedicated team is available around the clock to ensure your system runs smoothly you’ll never be left without power.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='justify-start w-full flex'>
                                <div className="max-w-[90%] lg:max-w-[85%] grid grid-cols-[1fr_11fr] gap-4 bg-[#EBFAEB] p-4 rounded-xl">
                                    <WarrantyAuditIcon className='w-8 h-8' />
                                    <div>
                                        <p className="text-[16px] font-bold">Warranty & Energy Audit</p>
                                        <p className="text-sm">Our systems come with product and service warranty and a complimentary energy audit ensuring optimal performance and complete peace of mind after installation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default HomeWhy
