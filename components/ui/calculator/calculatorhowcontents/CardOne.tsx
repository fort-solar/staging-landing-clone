import React from 'react';

const CardOne = () => {
    return (
        <div className='lg:border-r p-2 border-[#CCCCCC] '>
            <div className='bg-white p-4 rounded-lg group'>
                <div className='space-y-4 flex flex-col justify-between'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1'>
                            <div className='w-2 h-2 rounded-full bg-[#058A05]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                        </div>
                        <div>
                            <p className='text-[#CCCCCC] font-semibold'>01</p>
                        </div>
                    </div>
                    <div>
                        <p className=" pb-2 font-semibold text-lg transition-all min-h-16 duration-300 text-[#3B3B3B] group-hover:text-[#058A05]">
                           Enter Your Appliances
                        </p>

                        <p className='text-sm min-h-16'>Search/ Pick the items you use daily eg, TVs, fans, Laptops, fridge, etc.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardOne