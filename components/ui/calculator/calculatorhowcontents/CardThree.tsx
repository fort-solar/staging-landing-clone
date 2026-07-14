import React from 'react';

const CardThree = () => {
    return (
        <div className='lg:border-r p-2 border-[#CCCCCC]'>
            <div className='bg-white p-4 rounded-lg group'>
                <div className='space-y-4 flex flex-col justify-between'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1'>
                            <div className='w-2 h-2 rounded-full bg-[#048A05]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#048A05]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#048A05]'></div>
                            <div className='w-2 h-2 rounded-full bg-[#EBEBEB]'></div>
                        </div>
                        <div>
                            <p className='text-[#CCCCCC] font-semibold'>03</p>
                        </div>
                    </div>
                    <div>
                        <p className="group-hover:text-[#048A05] pb-2 font-semibold min-h-16  text-lg transition-all duration-300 text-[#3B3B3B]">
                          View System Sizing Output
                        </p>

                        <p className='text-sm min-h-16'>We instantly calculate your daily consumption and estimate the required inverter size, PV panels, and a baseline battery backup size.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardThree