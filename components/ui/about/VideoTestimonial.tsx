import React from 'react'
import { SquarePlay } from '@/components/features/icons/SquarePlay'

const VideoTestimonial = () => {
    return (
        <div>
            <div className=" min-h-[60%] w-full max-w-5xl mx-auto px-4  space-y-10  dark:bg-black sm:items-start">
                <div className="flex flex-col items-center text-center gap-3">
                    <p className="text-3xl lg:text-5xl font-bold font-poppins">
                        Video Testimonials
                    </p>
                    <p>Real stories. Real results. Watch how Fortsolar is transforming lives and powering success across the nation.</p>
                </div>
                <div className="mt-10 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-14">
                    <div className="relative min-h-100 rounded-xl overflow-hidden bg-[url('/video_testimony_image_one.png')] bg-cover bg-center">
                        <div className='absolute z-10 inset-0 flex items-end justify-between p-6'>
                            <div className='text-white'>
                                <p className='text-lg font-semibold'>Bidemi Fortune</p>
                                <p>CEO of Ajax Hairs</p>
                            </div>
                            <div >
                                <SquarePlay className='cursor-pointer'/>
                            </div>

                        </div>
                        <div className="absolute inset-0 bg-linear-to-b from-[rgba(1,50,1,0)] to-[#024A02] z-0" />
                    </div>
                    <div className="relative min-h-100 rounded-xl overflow-hidden bg-[url('/video_testimony_image_two.png')] bg-cover bg-center">
                        <div className='absolute z-10 inset-0 flex items-end justify-between p-6'>
                            <div className='text-white'>
                                <p className='text-lg font-semibold'>Werey Yo</p>
                                <p>Director of Tombia Gas</p>
                            </div>
                            <div >
                                <SquarePlay className='cursor-pointer'/>
                            </div>

                        </div>
                        <div className="absolute inset-0 bg-linear-to-b from-[rgba(1,50,1,0)] to-[#024A02] z-0" />
                    </div>
                    <div className="relative min-h-100 rounded-xl overflow-hidden bg-[url('/video_testimony_image_three.png')] bg-cover bg-center">
                        <div className='absolute z-10 inset-0 flex items-end justify-between p-6'>
                            <div className='text-white'>
                                <p className='text-lg font-semibold'>Rome Edith</p>
                                <p>Founder of BeautyV</p>
                            </div>
                            <div >
                                <SquarePlay className='cursor-pointer'/>
                            </div>

                        </div>
                        <div className="absolute inset-0 bg-linear-to-b from-[rgba(1,50,1,0)] to-[#024A02] z-0" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoTestimonial