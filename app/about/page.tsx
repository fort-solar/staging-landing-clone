import React from 'react';
import AboutHero from '@/components/ui/about/AboutHero';
import HomeAbout from '@/components/ui/home/HomeAbout';
import NumberBanner from '@/components/ui/about/NumberBanner';
import HomeWhy from '@/components/ui/home/HomeWhy';
import Testimonials from '@/components/features/global/Testimonials';
import Faq from '@/components/features/global/Faq';
import Newsletter from '@/components/features/global/Newsletter';
import Footer from '@/components/features/global/Footer';
import AboutServices from '@/components/ui/about/AboutServices';
import HomeBrands from '@/components/ui/home/HomeBrands';
import VideoTestimonial from '@/components/ui/about/VideoTestimonial';

const page = () => {
    return (
        <div className="min-h-screen  bg-white dark:bg-black">
            <AboutHero />
            <main className="min-h-screen w-full max-w-6xl mx-auto  py-10 space-y-10 lg:space-y-20 bg-white dark:bg-black sm:items-start">
                <HomeAbout />
            </main>
            <NumberBanner />
            <HomeWhy />
            <AboutServices />
            <HomeBrands />
            <VideoTestimonial />
            <Testimonials />
            <Faq />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default page