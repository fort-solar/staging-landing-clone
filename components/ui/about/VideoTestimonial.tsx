import React from 'react'
import { SquarePlay } from '@/components/features/icons/SquarePlay'
import PublicEmptyState from '@/components/ui/public/PublicEmptyState'
import { HoverVideoPreview, VideoDialog } from '@/components/ui/video/VideoDialog'
import { VIDEO_ASPECT_RATIOS } from '@/lib/aspect-ratios'
import {
    VIDEO_TESTIMONIAL_EMPTY_STATE,
    VIDEO_TESTIMONIALS,
    type PublicVideo,
} from '@/lib/video-content'

function VideoTestimonialCard({ video }: { video: PublicVideo }) {
    return (
        <HoverVideoPreview
            video={video}
            className={`w-full max-w-[320px] mx-auto rounded-2xl ${VIDEO_ASPECT_RATIOS.aboutVideoTestimonialThumbnail.mobile.className}`}
            sizes="(max-width: 768px) 100vw, 320px"
        >
            <div className="absolute inset-0 bg-linear-to-b from-[rgba(1,50,1,0)] to-[#024A02] z-0" />
            <div className='absolute z-10 inset-0 flex items-end justify-between gap-4 p-6'>
                <div className='text-white'>
                    <p className='text-lg font-semibold'>{video.title}</p>
                </div>
                <VideoDialog
                    video={video}
                    iframeAspectRatioClassName={VIDEO_ASPECT_RATIOS.videoIframe.mobile.className}
                    trigger={
                        <button
                            type="button"
                            aria-label={`Play ${video.title}`}
                            className="cursor-pointer"
                        >
                            <SquarePlay />
                        </button>
                    }
                />
            </div>
        </HoverVideoPreview>
    )
}

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
                <div className="mt-10 mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
                    {VIDEO_TESTIMONIALS.length ? (
                        VIDEO_TESTIMONIALS.map((video) => (
                            <VideoTestimonialCard key={video.id} video={video} />
                        ))
                    ) : (
                        <PublicEmptyState
                            title={VIDEO_TESTIMONIAL_EMPTY_STATE.title}
                            description={VIDEO_TESTIMONIAL_EMPTY_STATE.description}
                            className="min-h-[22rem]"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoTestimonial
