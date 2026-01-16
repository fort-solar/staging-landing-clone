import React from 'react';
import Newsletter from '@/components/features/global/Newsletter';
import Footer from '@/components/features/global/Footer';
import ContactHero from '@/components/ui/contact/ContactHero';
import ContactSectionOne from '@/components/ui/contact/ContactSectionOne';
import ContactSectionTwo from '@/components/ui/contact/ContactSectionTwo';

const page = () => {
  return (
    <div className="min-h-screen  bg-white dark:bg-black">
      <ContactHero />
      <ContactSectionOne />
      <ContactSectionTwo />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default page