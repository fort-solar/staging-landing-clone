import React from 'react'
import { how_it_works_two } from '@/components/features/images';
import Image from 'next/image';


const CardTwo = () => {
    return (
        <div className='lg:border-r p-2 border-[#CCCCCC]'>
            <div className='bg-white p-4 rounded-lg group h-full'>
                <div className='space-y-4 flex flex-col justify-between h-full'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1'>
                            <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                        </div>
                        <div>
                            <p className='text-[#CCCCCC] font-semibold'>02</p>
                        </div>
                    </div>
                    <div>
                        <p className="pb-2 font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                            Get Quote
                        </p>

                        <p className='text-sm'>Request a personalized quote that fits your energy goals and budget from us.</p>
                    </div>
                    <div className="relative h-75 lg:h-50 mt-5">
                        <Image
                            fill
                            alt="Step 2: Design your solar solution"
                            src={how_it_works_two}
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover rounded-t-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardTwo
