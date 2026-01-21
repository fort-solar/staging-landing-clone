"use client"

import React from 'react';
import { StarIcon } from '../icons/StarIcon';
import { TESTIMONIAL_CONTENT } from '../constants';
import { motion } from "framer-motion";

interface AvatarInitialProps {
  name: string;
  size?: number; 
}

const AvatarInitial = ({ name, size = 40 }: AvatarInitialProps) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const getColorFromName = (str: string) => {
    const colors = [
      "from-green-500 to-emerald-600",
      "from-green-500 to-emerald-600",
      "from-green-500 to-emerald-600",
      "from-green-500 to-emerald-600",
      "from-green-500 to-emerald-600",
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold bg-linear-to-br ${getColorFromName(
        name
      )}`}
      style={{
        width: size,
        height: size,
        fontSize: size / 2.2,
      }}
    >
      {getInitials(name)}
    </div>
  );
};


const Testimonials = () => {
    return (
        <div>
            <div className=" min-h-[60%] w-full max-w-6xl mx-auto px-4  space-y-10  dark:bg-black sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className="text-3xl lg:text-5xl font-bold font-poppins">
                        What Our Customers Say
                    </p>
                    <p>Affordable and efficient solutions tailored to your needs.</p>
                </div>

                <div className="relative h-105 overflow-hidden">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{
                            duration: 35,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {TESTIMONIAL_CONTENT.concat(TESTIMONIAL_CONTENT).map((t, i) => (
                            <TestimonialRow key={i} t={t} />
                        ))}
                    </motion.div>
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-white to-transparent" />
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent" />
                </div>


            </div>
        </div>
    )
}

export default Testimonials

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TestimonialRow({ t }: any) {
    return (
        <div className='bg-[#F9FAFB] p-4 space-y-6'>
            <div className='flex gap-2 items-center'>
                <AvatarInitial name={t.name} />
                <div>
                    <p className='font-semibold'>{t.name}</p>
                    <p className='text-xs font-medium'>{t.role}</p>
                </div>
            </div>
            <div>
                <p className='text-xs'>{t.testimony}</p>
            </div>
            <div className='flex gap-1 items-center'>
                {Array.from({length: t.star}).map((_,i) => (
                    <StarIcon key={i} />
                ))}
            </div>
        </div>
    )
}