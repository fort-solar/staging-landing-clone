import React from 'react';
import { StarIcon } from '../icons/StarIcon';
import { TESTIMONIAL_CONTENT } from '../constants';
import { avatar } from '../images';
import Image from 'next/image';

const Testimonials = () => {
    return (
        <div>
            <div className=" min-h-screen w-full max-w-6xl mx-auto px-4 py-10 space-y-10  dark:bg-black sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className="text-3xl lg:text-5xl font-bold font-poppins">
                        What Our Customers Say
                    </p>
                    <p>Affordable and efficient solutions tailored to your needs.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {TESTIMONIAL_CONTENT.map((t, i) => (
                        <div key={i} className='bg-[#F9FAFB] p-4 space-y-2 h-fit'>
                            <div className='flex gap-2 items-center'>
                                <Image alt='avatar image' height={50} width={50} src={avatar} />
                                <div>
                                    <p className='font-semibold'>{t.name}</p>
                                    <p className='text-xs font-medium'>{t.role}</p>
                                </div>
                            </div>
                            <div>
                                <p className='text-xs'>{t.testimony}</p>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Testimonials