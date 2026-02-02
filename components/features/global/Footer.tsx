import React from 'react';
import Image from 'next/image';
import { logo_footer } from '../images';
import Link from 'next/link';
import { TwitterIcon } from '@/components/features/icons/TwitterIcon';
import { FaTiktok, FaYoutube, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div>
      <div className="w-full max-w-6xl mx-auto px-4 pt-20 pb-10 space-y-10  dark:bg-black sm:items-start">
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-2">
          <div className='col-span-2 space-y-4 mb-5 lg:mb-0'>
            <Image src={logo_footer} alt="Fortsolar logo" height={200} width={200} />
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
              <div>
                <Link href="/about">
                  <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>About Us</p>
                </Link>
              </div>
              <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Services</p>
              <div>
                <Link href="/contact">
                  <p className='text-sm text-[#3B3B3B] hover:underline cursor-pointer'>Contact</p>
                </Link>
              </div>


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
      <div className="bg-gray-50 py-6">
        <div className="flex flex-col-reverse gap-5 lg:flex-row items-center justify-center lg:justify-between w-full max-w-6xl mx-auto px-4  dark:bg-black sm:items-start">
          <p className='text-xs'>© 2022 - {new Date().getFullYear()}. All rights reserved.</p>
           <div className='flex gap-7 items-center'>
                    <Link href="https://facebook.com/fortsolar.ng/">
                        <FaFacebook className="w-5 h-5 hover:text-[#058A05] cursor-pointer" />
                    </Link>

                    <Link href="https://x.com/Fortsolar">
                        <TwitterIcon className="w-5 h-5 hover:text-[#058A05] cursor-pointer" />
                    </Link>

                    <Link href="https://www.linkedin.com/company/fortsolar/">
                        <FaLinkedin className='w-5 h-5 hover:text-[#058A05] cursor-pointer' />
                    </Link>

                    {/* #3B3B3B */}
                    <Link href="https://www.tiktok.com/@fortsolar">
                        <FaTiktok className="w-5 h-5 hover:text-[#058A05] cursor-pointer" />
                    </Link>

                    <Link href="https://youtube.com/@Fortsolar">
                        <FaYoutube className="w-5 h-5 hover:text-[#058A05] cursor-pointer" />
                    </Link>

                    <Link href="https://www.instagram.com/fortsolar.ng/">
                        <FaInstagram className="w-5 h-5 hover:text-[#058A05] cursor-pointer" />
                    </Link>


                </div>
        </div>
      </div>

    </div>
  )
}

export default Footer
