import React from 'react'

const ProductCardFour = () => {
  return (
     <div className="h-80 bg-[#EBFAEB] p-2">
        <div className="group relative bg-[url('/double_solar_panels.png')] rounded-lg overflow-hidden bg-contain bg-center h-full z-10">

          <div className='absolute px-4 bottom-3 z-10 w-full flex flex-col items-start space-y-2'>
            <p className="text-lg font-semibold font-poppins text-white">Monocrystalline Solar Panel 550W</p>
            <p className='text-xs text-white'> High-efficiency solar panel ideal for home and business installations.</p>
            <button className='text-sm border border-white rounded-xl py-3 w-full text-white hover:bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] cursor-pointer ring-0 hover:border-[#2CB22C]'>View Details</button>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-[#000000af] to-[#00000000] z-0" />
        </div>
      </div>
  )
}

export default ProductCardFour