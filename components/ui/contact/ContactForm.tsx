"use client"

import React from 'react'
import 'react-phone-number-input/style.css'
import { Checkbox } from "@/components/ui/checkbox"

interface ContactHeroProps {
  formRef: React.RefObject<HTMLFormElement | null>;
}

const ContactForm = ({ formRef }: ContactHeroProps) => {


    return (
        <form className="py-8 space-y-5" id='contact-form' ref={formRef}>
            <p className='text-2xl lg:text-3xl font-semibold text-[#101828]'>Get in touch</p>
            <p className='text-[#667085] mb-10'>Our friendly team would love to hear from you.</p>
            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <label className="label">First name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="label">Last name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Doe"
                    />
                </div>
                <div>
                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="you@email.com"
                    />
                </div>
                <div>
                    <label className="label">Phone number</label>
                    {/* <PhoneInput
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        className="w-full"
                        inputClassName="input"
                    /> */}
                     <input
                        type="text"
                        className="input"
                        placeholder="+234 0901 262 4182"
                    />
                    
                </div>
                <div className='col-span-2'>
                    <label className="label">Subject</label>
                     <input
                        type="text"
                        className="input"
                        placeholder="Message Subject"
                    />
                    
                </div>
                <div className='col-span-2'>
                    <label className="label">Message</label>
                    <textarea
                        rows={5}
                        className="input"
                        placeholder=""
                    />
                </div>
                <div className='col-span-2 text-sm flex items-center gap-1'>
                  <Checkbox />  You agree to our friendly <span className='underline cursor-pointer'>privacy policy.</span> 
                </div>

                <button className="py-3 mt-4 rounded-2xl col-span-2   cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]  hover:opacity-90">
                    Send Message
                </button>
            </div>

        </form>
    )
}

export default ContactForm