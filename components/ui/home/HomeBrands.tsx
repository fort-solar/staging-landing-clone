import React from 'react'
import { RIbbonUnityIcon } from '@/components/features/icons/RIbbonUnityIcon'
import { LinearIcon } from '@/components/features/icons/LinearIcon'
import { SlackIcon } from '@/components/features/icons/SlackIcon'
import { MetaIcon } from '@/components/features/icons/MetaIcon'
import { MiroIconFull } from '@/components/features/icons/MiroIconFull'
import { MiroIconHalf } from '@/components/features/icons/MiroIconHalf'
import { MatomoIcon } from '@/components/features/icons/MatomoIcon'
import { DbtIcon } from '@/components/features/icons/DbtIcon'
import { CrossedPlayIcon } from '@/components/features/icons/CrossedPlayIcon'
import { StarIcon } from '@/components/features/icons/StarIcon'

const HomeBrands = () => {
    return (
        <div className="my-10">
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className='font-poppins'>Popular brands trust  Fortsolar</p>
                </div>
                <div className="space-y-5 lg:space-y-8 bg-[url('/center_gradient.png')] bg-contain bg-center py-10">
                    <div className="flex items-center gap-10 lg:gap-28 justify-center">
                        <DbtIcon />
                        <LinearIcon />
                        <MetaIcon />
                    </div>
                    <div className="flex items-center gap-8 lg:gap-24 justify-center">
                        <RIbbonUnityIcon />
                        <SlackIcon />
                        <MiroIconHalf />
                    </div>
                    <div className="flex items-center gap-8 lg:gap-20 justify-center">
                        <CrossedPlayIcon />
                        <MatomoIcon />
                    </div>

                </div>
                <div className="border-t border-t-white flex items-center justify-center gap-10 lg:gap-20">
                    <MiroIconFull />
                    <div className='space-y-2'>
                        <div className='flex gap-1'>
                            {Array.from({length: 5}).map((_,i) => (
                                <StarIcon key={i}/>
                            ))}                                                                                                                                                                                                              
                        </div>
                        <p className='text-xs'>
                            4.4/5 (14,590 Reviews)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeBrands