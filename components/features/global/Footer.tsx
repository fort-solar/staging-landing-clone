import React from 'react'
import { FacebookIcon } from '../icons/FacebookIcon'
import { LinkedinIcon } from '../icons/LinkedinIcon'
import { TwitterIcon } from '../icons/TwitterIcon'
import Image from 'next/image'
import { logo_footer } from '../images'

const Footer = () => {
  return (
    <div>
      <div className="w-full max-w-6xl mx-auto px-4 pt-20 pb-10 space-y-10  dark:bg-black sm:items-start">
        <div className="grid grid-cols-2 lg:grid-cols-7">
          <div className='col-span-2 space-y-4'>
            <Image src={logo_footer} alt="footer logo" height={200} width={200} />
            <p className='text-[#3B3B3BB2]'>Reliable solar solutions built to keep you powered, anytime, anywhere.</p>
          </div>
          <div className="flex justify-start lg:justify-center">
            <div className='space-y-3'>
              <p className='text-sm text-[#3B3B3B] font-semibold'>Store</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Products</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Packages</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>App</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Pricing</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>New Bundles</p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className='space-y-3'>
              <p className='text-sm text-[#3B3B3B] font-semibold'>Company</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>About Us</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Services</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Contact</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Become an installer</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>News</p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className='space-y-3'>
              <p className='text-sm text-[#3B3B3B] font-semibold'>Resources</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Blog</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>FAQs</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Newsletter</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Help center</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Support </p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Events</p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className='space-y-3'>
              <p className='text-sm text-[#3B3B3B] font-semibold'>Social</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Twitter</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Linkedin</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Facebook</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Instagram</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>TikTok</p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className='space-y-3'>
              <p className='text-sm text-[#3B3B3B] font-semibold'>Legal</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Terms</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Privacy</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Cookies</p>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Contact</p>
            </div>
          </div>




        </div>

      </div>
      <div className="bg-gray-50 w-full max-w-6xl mx-auto px-4 py-4 space-y-10  dark:bg-black sm:items-start">
        <div>
          
        </div>

      </div>
    </div>
  )
}

export default Footer