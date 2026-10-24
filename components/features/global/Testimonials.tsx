"use client"

import React, { useEffect, useState } from 'react';
import { StarIcon } from '../icons/StarIcon';
import { GoogleIcon } from '../icons/GoogleIcon';
import { TESTIMONIAL_CONTENT } from '../constants';
import { motion } from "framer-motion";
import { buildApiUrl } from '@/lib/public-content';

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
    const [items, setItems] = useState<any[]>(TESTIMONIAL_CONTENT);

    useEffect(() => {
        let active = true;
        fetch(buildApiUrl("/reviews"))
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => {
                if (!active || !json) return;
                const rows = Array.isArray(json) ? json : json?.data || [];
                if (rows.length > 0) {
                    const mapped = rows.map((r: any) => ({
                        name: r.name || "Customer",
                        role: r.role || "Verified Google Customer",
                        testimony: r.review_text || "",
                        star: r.rating || 5,
                    }));
                    setItems([...mapped, ...TESTIMONIAL_CONTENT]);
                }
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    return (
        <div>
            <div className="min-h-[60%] w-full max-w-6xl mx-auto px-4 space-y-10 sm:items-start">
                <div className="mt-6 flex flex-col items-center text-center gap-3">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins">
                        What Our Customers Say
                    </p>
                    <p className="text-[#5A646B]">Affordable and efficient solutions tailored to your needs.</p>

                    {/* Consolidated Google Verified Rating (Location-Aware Google Search) */}
                    <a
                      href="https://www.google.com/search?q=Fortsolar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-2 inline-flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 rounded-2xl sm:rounded-full border border-amber-300/80 bg-gradient-to-b from-amber-50/90 to-amber-100/60 px-4 py-2 sm:py-1.5 text-xs font-medium text-amber-950 transition hover:from-amber-100 hover:to-amber-200/80 shadow-2xs max-w-full"
                      title="View Fortsolar verified reviews and company profile on Google"
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
                        {items.concat(items).map((t, i) => (
                            <TestimonialRow key={`${t.name}-${i}`} t={t} />
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
    const isGoogle = typeof t.role === 'string' && t.role.includes('Google');
    return (
        <div className='bg-[#F9FAFB] p-5 rounded-2xl border border-gray-100/90 shadow-2xs space-y-4 hover:border-emerald-200 transition-colors'>
            <div className='flex gap-3 items-center'>
                <AvatarInitial name={t.name} />
                <div className='min-w-0'>
                    <p className='font-semibold text-sm text-slate-900 truncate'>{t.name}</p>
                    <p className='text-xs font-medium text-slate-500 flex items-center gap-1.5'>
                        {isGoogle && <span className="inline-flex shrink-0 scale-90"><GoogleIcon /></span>}
                        <span className={isGoogle ? 'text-emerald-700 font-semibold' : ''}>{t.role}</span>
                    </p>
                </div>
            </div>
            <div>
                <p className='text-xs text-slate-600 leading-relaxed'>{t.testimony}</p>
            </div>
            <div className='flex gap-1 items-center'>
                {Array.from({length: t.star || 5}).map((_,i) => (
                    <StarIcon key={i} />
                ))}
            </div>
        </div>
    )
}