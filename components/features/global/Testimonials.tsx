"use client"

import React from 'react';
import { StarIcon } from '../icons/StarIcon';
import { GoogleIcon } from '../icons/GoogleIcon';
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
            <div className="min-h-[60%] w-full max-w-6xl mx-auto px-4 space-y-10 sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins">
                        What Our Customers Say
                    </p>
                    <p className="text-[#5A646B]">Affordable and efficient solutions tailored to your needs.</p>

                    {/* Consolidated Google Verified Rating (Location-Aware Google Maps) */}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Fortsolar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-2 inline-flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 rounded-2xl sm:rounded-full border border-amber-300/80 bg-gradient-to-b from-amber-50/90 to-amber-100/60 px-4 py-2 sm:py-1.5 text-xs font-medium text-amber-950 transition hover:from-amber-100 hover:to-amber-200/80 shadow-2xs max-w-full"
                      title="View Fortsolar reviews and nearest office on Google Maps"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex text-amber-500 text-xs tracking-tight">★★★★★</span>
                        <span className="font-bold text-slate-900">4.9 / 5.0</span>
                        <span className="text-slate-400">·</span>
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <GoogleIcon />
                          <span>Google Verified</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#048A05] group-hover:translate-x-0.5 transition-transform">
                        <span>View Reviews &amp; Nearest Office</span>
                        <span className="text-[10px]">↗</span>
                      </div>
                    </a>
                </div>

                <div className="relative h-105 overflow-hidden">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{
                            duration: 45,
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