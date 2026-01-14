import React from 'react'

const NumberBanner = () => {
    return (
        <div className='h-50'>
            <div className="relative bg-[url('/panels_on_a_roof.jpg')] bg-cover bg-center h-full z-10">
                <div className='absolute grid grid-cols-2 lg:grid-cols-4 px-4 py-2 inset-0 z-10 max-w-6xl mx-auto items-center '>
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <p className="text-4xl lg:text-6xl font-semibold font-poppins text-white">23 kW</p>
                        <p className='text-lg text-white'>Installed Capacity</p>
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <p className="text-4xl lg:text-6xl font-semibold font-poppins text-white">15 kWh</p>
                        <p className='text-lg text-white'>Energy Generated</p>
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <p className="text-4xl lg:text-6xl font-semibold font-poppins text-white">+10k</p>
                        <p className='text-lg text-white'>Happy Customers</p>
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center'>
                        <p className="text-4xl lg:text-6xl font-semibold font-poppins text-white">45</p>
                        <p className='text-lg text-white'>Installers</p>
                    </div>
                   
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-[#01320394] to-[#01320394] z-0" />
            </div>
        </div>
    )
}

export default NumberBanner