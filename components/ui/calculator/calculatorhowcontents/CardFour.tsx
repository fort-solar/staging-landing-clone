import React from 'react';

const CardFour = () => {
    return (
        <div className=' lg:border-r p-2 border-[#CCCCCC]'>
            <div className='bg-white p-4 rounded-lg group'>
                <div className='space-y-4 flex flex-col justify-between'>
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
                        <p className="group-hover:text-[#058A05] pb-2 font-semibold text-lg transition-all duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                          Get a Perfect Solar Match
                        </p>

                        <p className='text-sm'>See the best solar Packages for your load, with free installation included.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardFour