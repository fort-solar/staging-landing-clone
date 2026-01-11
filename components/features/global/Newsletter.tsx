import React from 'react'

const Newsletter = () => {
  return (
    <div>
      <div className="relative min-h-screen w-full max-w-6xl mx-auto px-4 py-20 space-y-10  dark:bg-black sm:items-start">
        <div className='grid grid-cols-[3fr_6fr_3fr]'>
          <div className="bg-[url('/engineer.png')] bg-cover bg-center min-h-87.5">

          </div>
          <div className='py-10 h-full'>
           <div className='h-full max-w-2xl mx-auto text-center flex flex-col gap-5 items-center justify-center'>
            <p className="leading-16 max-w-2xl text-3xl lg:text-5xl font-bold font-poppins mt-2">Stay Updated with Solar Insights</p>
             <div className='max-w-xl mt-4 mb-7'>
                    <p>Be the first one to know  about discounts, offers and events.</p>
                </div>
          </div>  
          </div>
         
          <div className="bg-[url('/solar_panel_in_sun.png')] bg-cover bg-center">

          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter