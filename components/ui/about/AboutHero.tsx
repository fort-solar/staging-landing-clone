import React from 'react'

const AboutHero = () => {
    return (
        <div className='h-37.5'>
            <div className="relative bg-[url('/about_hero_update.jpg')] bg-cover bg-center h-full z-10">
            <div className='absolute px-4 inset-0 z-10 max-w-6xl mx-auto flex items-center '>
                <h1 className="text-4xl lg:text-6xl font-bold font-poppins text-white">About Fortsolar</h1>
            </div>
                <div className="absolute inset-0 bg-linear-to-b from-[#01320353] to-[#01320353] z-0" />
            </div>
        </div>

    )
}

export default AboutHero