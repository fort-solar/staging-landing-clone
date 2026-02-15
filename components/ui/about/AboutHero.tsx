import React from 'react'

const AboutHero = () => {
    return (
        <div className='h-37.5 lg:h-60'>
            <div className="relative bg-[url('/about_hero_update.jpg')] bg-cover bg-center h-full z-10">
            <div className='absolute px-4 inset-0 z-10 max-w-6xl mx-auto flex items-center '>
                <h1 className="text-2xl lg:text-5xl font-bold font-poppins text-white">Powering Nigeria with Reliable Solar Energy</h1>
            </div>
                <div className="absolute inset-0 bg-linear-to-b from-[#01320353] to-[#01320353] z-0" />
            </div>
        </div>

    )
}

export default AboutHero