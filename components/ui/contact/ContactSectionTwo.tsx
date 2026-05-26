import React from 'react'
import ContactForm from './ContactForm'
import ContactMap from './ContactMap'

interface ContactHeroProps {
  formRef?: React.RefObject<HTMLFormElement | null>;
}

const ContactSectionTwo = ({ formRef }: ContactHeroProps) => {
    return (
        <div className="min-h-[60vh] w-full max-w-6xl mx-auto gap-10 px-4 pt-10 space-y-10  dark:bg-black sm:items-start grid grid-cols-1 lg:grid-cols-2">
            <div>
                <ContactMap />
            </div>
            <div>
                <ContactForm formRef={formRef}/>
            </div>
        </div>
    )
}

export default ContactSectionTwo
