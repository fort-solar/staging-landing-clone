import React from 'react';
import { Button } from '@/components/ui/button';
import { BLOG_CONTENT } from '../constants';
import { SlantedArrow } from '../icons/SlantedArrow';


const Blog = () => {
    return (
        <div>
            <div className=" min-h-screen w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                <div className='flex justify-between w-full items-center'>
                    <div className="max-w-3xl leading-16 text-3xl lg:text-5xl font-bold font-poppins mt-2">
                        Insights and Updates from FortSolar
                    </div>
                    <div>
                        <Button
                            className="
                                               transition-all
                                         text-white
                                         cursor-pointer
                                         text-sm
                                         flex 
                                         items-center 
                                         justify-center 
                                         gap-3
                                         bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
                                         hover:opacity-90
                                       "
                        >
                            Explore All Articles {" "}{" "}→
                        </Button>
                    </div>
                </div>

                <div className='max-w-4xl mt-4 mb-7'>
                    <p>Stay informed with the latest in solar technology, energy trends, expert tips, and project highlights.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10 mt-10'>
                    {
                        BLOG_CONTENT.map((b, i) => (
                            <div key={i} className='cursor-pointer rounded-lg shadow-lg flex flex-col justify-between h-full min-h-90 p-5'>
                                <div className='h-[50%]'></div>
                                <div className='space-y-2'>
                                    <p className='text-xs text-[#058A05] font-semibold'>
                                        {b.subheading}
                                    </p>
                                    <div className='flex justify-between w-full gap-4'>
                                        <p className="font-semibold text-lg">
                                            {b.title}
                                        </p>
                                        <SlantedArrow className='w-4 h-4' />
                                    </div>


                                    <p className="text-gray-500">
                                        {b.preview.slice(0, 75)}...
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>


            </div>
        </div>
    )
}

export default Blog