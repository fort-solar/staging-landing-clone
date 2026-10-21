import type { Metadata } from "next";
import React from "react";
import Newsletter from "@/components/features/global/Newsletter";
import Footer from "@/components/features/global/Footer";
import ContactHero from "@/components/ui/contact/ContactHero";
import ContactSectionOne from "@/components/ui/contact/ContactSectionOne";
import ContactSectionTwo from "@/components/ui/contact/ContactSectionTwo";
import Faq from "@/components/features/global/Faq";

export const metadata: Metadata = {
  title: "Contact Us | Fortsolar",
  description:
    "Get in touch with Fortsolar’s energy consultants for residential, commercial solar inquiries, financing options, or free quotes.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Fortsolar | Solar Inquiries & Consultation",
    description:
      "Reach out to Fortsolar for solar installations, financing support, and system audits.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactHero />
      <ContactSectionOne />
      <ContactSectionTwo />
      <Faq />
      <Newsletter />
      <Footer />
    </div>
  );
}
