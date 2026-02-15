"use client";

import React, { useEffect, useRef, useState } from "react";

type Stat = {
    label: string;
    start: number;
    end: number;
    suffix?: string;
    prefix?: string;
};

const STATS: Stat[] = [
    {
        label: "Installed Capacity",
        start: 23,
        end: 123,
        suffix: " kW",
    },
    {
        label: "Energy Generated",
        start: 5,
        end: 15,
        suffix: " kWh",
    },
    {
        label: "Happy Customers",
        start: 1,
        end: 10,
        suffix: "k",
        prefix: "+",
    },
    {
        label: "Installers",
        start: 10,
        end: 45,
    },
];

const NumberBanner = () => {
    const [values, setValues] = useState<number[]>(STATS.map((stat) => stat.start));
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const target = sectionRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) {
            setValues(STATS.map((stat) => stat.start));
            return;
        }

        const duration = 1800;
        const startTime = performance.now();
        let frameId = 0;

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);

            setValues(
                STATS.map((stat) => {
                    const value = stat.start + (stat.end - stat.start) * progress;
                    return Math.round(value);
                })
            );

            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [isInView]);

    return (
        <div className="h-50" ref={sectionRef}>
            <div className="relative bg-[url('/panels_on_a_roof.jpg')] bg-cover bg-center h-full z-10">
                <div className="absolute grid grid-cols-2 lg:grid-cols-4 px-4 py-2 inset-0 z-10 max-w-6xl mx-auto items-center">
                    {STATS.map((stat, index) => (
                        <div key={stat.label} className="flex flex-col gap-2 justify-center items-center">
                            <p className="text-4xl lg:text-6xl font-semibold font-poppins text-white">
                                {stat.prefix ?? ""}
                                {values[index]}
                                {stat.suffix ?? ""}
                            </p>
                            <p className="text-lg text-white">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-[#01320394] to-[#01320394] z-0" />
            </div>
        </div>
    );
};

export default NumberBanner;
