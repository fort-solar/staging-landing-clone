import React from 'react';

const CardTwo = () => {
    return (
        <div className='lg:border-r p-2 border-[#CCCCCC]'>
            <div className='bg-white p-4 rounded-lg group'>
                <div className='space-y-4 flex flex-col justify-between'>
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
                        <p className="group-hover:text-[#058A05] pb-2 font-semibold text-lg transition-all duration-300 text-[#3B3B3B]">
                          Enter Quantity & Usage Time
                        </p>

                        <p className='text-sm'>Tell us how many units of the appliance you want to use, the power rating and how long you use them each day.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardTwo