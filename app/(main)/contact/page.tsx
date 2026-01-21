"use client"

import React, { useRef } from 'react';
import Newsletter from '@/components/features/global/Newsletter';
import Footer from '@/components/features/global/Footer';
import ContactHero from '@/components/ui/contact/ContactHero';
import ContactSectionOne from '@/components/ui/contact/ContactSectionOne';
import ContactSectionTwo from '@/components/ui/contact/ContactSectionTwo';
import Faq from '@/components/features/global/Faq';

const Page = () => {
  const contactFormRef = useRef<HTMLFormElement | null>(null);

  return (
    <div className="min-h-screen  bg-white dark:bg-black">
      <ContactHero formRef={contactFormRef}/>
      <ContactSectionOne />
      <ContactSectionTwo formRef={contactFormRef}/>
      <Faq />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Page