import React from "react";
import Newsletter from "@/components/features/global/Newsletter";
import Footer from "@/components/features/global/Footer";
import ContactHero from "@/components/ui/contact/ContactHero";
import ContactSectionOne from "@/components/ui/contact/ContactSectionOne";
import ContactSectionTwo from "@/components/ui/contact/ContactSectionTwo";
import Faq from "@/components/features/global/Faq";
import { resolveSitePageOrFallback } from "@/lib/site-pages";
import SitePageRenderer from "@/components/site-pages/SitePageRenderer";

const Page = async () => {
  const { page, hasDynamicContent } =
    await resolveSitePageOrFallback("contact-us");

  if (page && hasDynamicContent) {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="min-h-screen  bg-white dark:bg-black">
      <ContactHero />
      <ContactSectionOne />
      <ContactSectionTwo />
      <Faq />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Page;
