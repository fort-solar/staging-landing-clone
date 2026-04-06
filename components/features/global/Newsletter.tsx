"use client"

import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Phone, Mail, MapPin } from 'lucide-react';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { submitForm } from "@/actions/SubmitForm";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const Newsletter = () => {
  const pathname = usePathname();
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address", { position: "top-center" });
      return;
    }

    try {
      setIsSubmitting(true);
      await toast.promise(
        submitForm({
          endpoint: "newsletter/subscribe",
          method: "POST",
          values: { email: email.trim() },
        }),
        {
          loading: "Subscribing...",
          position: "top-center",
          success: "You have been subscribed successfully.",
          error: err => (err instanceof Error ? err.message : "Unable to subscribe right now"),
        }
      );
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div>
      <Toaster />
      <div className={`relative w-full max-w-6xl mx-auto px-4 ${pathname === "/energy-calculator" ? "lg:pt-0" : "lg:pt-20"}  dark:bg-black sm:items-start`}>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_6fr_3fr]'>
          <div className="hidden lg:block bg-[url('/engineer_updated.png')] bg-cover bg-center min-h-87.5">

          </div>
          <div className='lg:py-10 h-full lg:min-h-87.5'>
            <div className='h-full max-w-2xl mx-auto text-center flex flex-col gap-5 items-center justify-center'>
              <p className="leading-16 max-w-2xl text-3xl lg:text-5xl font-bold font-poppins mt-2">Stay Updated with Solar Insights</p>
              <div className='max-w-xl mt-4 mb-7'>
                <p>Be the first one to know  about discounts, offers and events.</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block bg-[url('/solar_panel_in_sun.png')] bg-cover bg-center min-h-87.5">

          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_6fr_3fr] mt-5 lg:mt-0'>
          <div className="">

          </div>
          <div className='h-full px-2'>
            <form onSubmit={handleSubscribe}>
              <InputGroup className='rounded-xl'>
                <InputGroupInput
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter Email Address..."
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="submit"
                    disabled={isSubmitting}
                    className='py-4 px-6 rounded-lg cursor-pointer
    text-white
    bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] hover:text-white
    hover:opacity-80 disabled:opacity-50'
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe →"}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>

          <div className="">

          </div>
        </div>
        {pathname !== "/contact" && (
          <div className="grid grid-cols-2 gap-5 lg:gap-2 lg:grid-cols-4 mt-10">
            <div className='flex flex-col items-start gap-2'>
              <Phone className='text-[#55565B] w-5 h-5' />
              <div className='flex flex-col gap-1'>
                <p className='text-[#55565B] text-sm'>Tel</p>
                <Link href={"tel:+2347066524793"} className='text-[#058A05] text-sm'>+234 706 652 4793</Link>
                <Link href={"tel:+2342013309043"} className='text-[#058A05] text-sm'>+234 201 330 9043</Link>
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <Mail className='text-[#55565B] w-5 h-5' />
              <div>
                <p className='text-[#55565B] text-sm'>Mail</p>
                <Link href="mailto:enquiry@fortsolar.ng" className='text-[#058A05] text-sm'>enquiry@fortsolar.ng</Link>
              </div>
            </div>
            <div className='flex flex-col items-start gap-2'>
              <MapPin className='text-[#55565B] w-5 h-5' />
              <div>
                <p className='text-[#55565B] text-sm'>Lagos Address</p>
                <p className='text-[#058A05] text-sm'>Suite D1 038 HFP East Line Complex Abraham Adesanya</p>
              </div>
            </div>
            <div className='flex flex-wrap items-start gap-2'>
              <MapPin className='text-[#55565B] w-5 h-5' />
              <div>
                <p className='text-[#55565B] text-sm'>Uyo Address</p>
                <p className='text-[#058A05] text-sm'>183 Ikot Ekpene Road, Uyo, Akwa Ibom State</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Newsletter
