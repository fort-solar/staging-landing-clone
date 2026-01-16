import React from 'react';
import { how_it_works_four } from '@/components/features/images';
import Image from 'next/image';

const CardFour = () => {
  return (
     <div className='p-2'>
                        <div className='bg-white p-4 rounded-lg group h-full'>

                            <div className='space-y-4 flex flex-col justify-between h-full'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                        <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                                    </div>
                                    <div>
                                        <p className='text-[#CCCCCC] font-semibold'>04</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                                        Start Saving
                                    </p>

                                    <p className='text-sm'>Enjoy uninterrupted power and reduced electricity costs from day one.</p>
                                </div>
                                <div className="relative h-75 lg:h-50 mt-5">
                                    <Image
                                        fill
                                        alt="how_it_works_four"
                                        src={how_it_works_four}
                                        className="object-fill rounded-t-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
  )
}

export default CardFour