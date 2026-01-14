import React from 'react'
import { SquarePlay } from '@/components/features/icons/SquarePlay'

const VideoTestimonial = () => {
    return (
        <div>V
            <div className=" min-h-[60%] w-full max-w-6xl mx-auto px-4  space-y-10  dark:bg-black sm:items-start">
                <div className="flex flex-col items-center text-center gap-3">
                    <p className="text-3xl lg:text-5xl font-bold font-poppins">
                        Video Testimonials
                    </p>
                    <p>Real stories. Real results. Watch how FortSolar is transforming lives and powering success across the nation.</p>
                </div>
                <div className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="relative min-h-100 rounded-xl overflow-hidden bg-[url('/video_testimony_image_one.png')] bg-cover bg-center flex items-end justify-between">

                        <div className="absolute inset-0 bg-linear-to-b from-[rgba(1,50,1,0)] to-[#024A02] z-0" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoTestimonial