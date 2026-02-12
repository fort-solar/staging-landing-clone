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
import Image from 'next/image'
import { brand_1, brand_2, brand_3, brand_4, brand_5, brand_6, brand_7 } from '@/components/features/images'

const HomeBrands = () => {
    return (
        <div className="my-10">
            <div className=" min-h-[60vh] w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className='font-poppins'>Popular brands trust  Fortsolar</p>
                </div>
                <div className="relative space-y-5 lg:space-y-8 bg-[url('/center_gradient.png')] bg-contain bg-center py-10">
                    <div className="flex items-center gap-10 lg:gap-20 justify-center">
                        <div className="w-fit">
                            <Image alt="brand logo 1" src={brand_1} height={100} width={100} />
                        </div>
                        <div className="w-fit">
                            <Image alt="brand logo 2" src={brand_2} height={100} width={100} />
                        </div>
                        <div className="w-fit">
                            <Image alt="brand logo 3" src={brand_3} height={100} width={100} />
                        </div>
                        <div className="w-fit">
                            <Image alt="brand logo 4" src={brand_4} height={100} width={100} />
                        </div>
                    </div>
                    <div className="flex items-center gap-8 lg:gap-18 justify-center">
                        <div className="w-fit">
                            <Image alt="brand logo 5" src={brand_5} height={100} width={100} />
                        </div>
                        <div className="w-fit">
                            <Image alt="brand logo 6" src={brand_6} height={100} width={100} />
                        </div>
                        <div className="w-fit">
                            <Image alt="brand logo 7" src={brand_7} height={100} width={100} />
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-8 lg:gap-20 justify-center">
                        <CrossedPlayIcon />
                        <MatomoIcon />
                    </div> */}
                    <div className="border-t border-t-white mt-4 pt-7 lg:mt-30 flex items-center justify-center gap-10 lg:gap-20">
                        <div className="w-fit">
                            <Image alt="brand logo 3" src={brand_3} height={200} width={200} />
                        </div>
                        <div className='space-y-2'>
                            <div className='flex gap-1'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon key={i} />
                                ))}
                            </div>
                            <p className='text-xs'>
                                4.4/5 (12 Reviews)
                            </p>
                        </div>
                    </div>
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-white to-transparent" />
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent" />
                    <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-20 bg-linear-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-20 bg-linear-to-l from-white to-transparent" />
                </div>

            </div>
        </div>
    )
}

export default HomeBrands