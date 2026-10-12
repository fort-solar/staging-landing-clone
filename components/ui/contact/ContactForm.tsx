"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { submitForm } from "@/actions/SubmitForm";
import { ContactFormData, ContactFormSchema } from "@/types/api.types";

interface ContactHeroProps {
    formRef?: React.RefObject<HTMLFormElement | null>;
}

const ContactForm = ({ formRef }: ContactHeroProps) => {
    const [agreed, setAgreed] = React.useState(false);
    const [showPolicyError, setShowPolicyError] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [submittedName, setSubmittedName] = React.useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(ContactFormSchema),
        mode: "onBlur"
    });

    const onSubmit = async (data: ContactFormData) => {
        if (!agreed) {
            setShowPolicyError(true);
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
        };

        try {
            await toast.promise(
                submitForm({
                    endpoint: "contacts",
                    method: "POST",
                    values: payload,
                }),
                {
                    loading: "Sending enquiry...",
                    position: "top-right",
                    success: () => {
                        setSubmittedName(data.firstName);
                        setIsSubmitted(true);
                        reset(
                            {
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                                subject: "",
                                message: "",
                            },
                            {
                                keepIsValid: false,
                                keepTouched: false,
                            }
                        );
                        setAgreed(false);
                        setIsSubmitting(false);
                        return "Your enquiry has been received successfully.";
                    },
                    error: (err) => (err instanceof Error ? err.message : "Something went wrong while sending enquiry"),
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            ref={formRef}
            id="contact-form"
            className="py-4 space-y-3"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Toaster />
            <p className="text-2xl lg:text-3xl font-semibold text-[#101828]">
                Get in touch
            </p>
            <p className="text-[#667085] mb-10">
                Our friendly team would love to hear from you.
            </p>

            {isSubmitted ? (
                <div className="py-10 px-6 sm:px-8 bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-3xl space-y-5 text-center animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 bg-[#D1FADF] rounded-full mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-[#039855]" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-[#101828]">Enquiry Submitted Successfully!</h3>
                        <p className="text-base text-[#475467] max-w-md mx-auto leading-relaxed">
                            Thank you{submittedName ? `, ${submittedName}` : ""}. We have received your enquiry. A Fortsolar energy consultant will review your message and reply via email or phone within 24 hours.
                        </p>
                    </div>
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setIsSubmitted(false)}
                            className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-90 cursor-pointer shadow-md transition"
                        >
                            Send Another Enquiry →
                        </button>
                    </div>
                </div>
            ) : (
                <>

            <div className="grid grid-cols-2 gap-5">
                <div>
                    {/* [ui-fix] added required asterisk (*) as standard UX indicator for mandatory fields */}
                    <label className="label">First name <span className="text-red-500">*</span></label>
                    <input
                        {...register("firstName")}
                        className="input"
                        placeholder="e.g. Idara"
                    />
                    {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <label className="label">Last name</label>
                    <input
                        {...register("lastName")}
                        className="input"
                        placeholder="e.g. Umar"
                    />
                </div>

                <div>
                    {/* [ui-fix] added required asterisk (*) as standard UX indicator for mandatory fields */}
                    <label className="label">Email <span className="text-red-500">*</span></label>
                    <input
                        {...register("email")}
                        type="email"
                        className="input"
                        placeholder="e.g. idaraemekaumar@email.com"
                    />
                </div>

                <div>
                    {/* [ui-fix] added required asterisk (*) as standard UX indicator for mandatory fields */}
                    <label className="label">Phone number <span className="text-red-500">*</span></label>
                    <input
                        {...register("phone")}
                        className="input"
                        placeholder="+234"
                    />
                </div>

                <div className="col-span-2">
                    {/* [ui-fix] added required asterisk (*) as standard UX indicator for mandatory fields */}
                    <label className="label">Subject <span className="text-red-500">*</span></label>
                    <input
                        {...register("subject")}
                        className="input"
                        placeholder="Message Subject"
                    />
                </div>

                <div className="col-span-2">
                    {/* [ui-fix] added required asterisk (*) as standard UX indicator for mandatory fields */}
                    <label className="label">Message <span className="text-red-500">*</span></label>
                    <textarea
                        {...register("message")}
                        rows={5}
                        className="input"
                        placeholder="Message description"
                    />
                </div>

                <div className="col-span-2 text-sm flex items-center gap-2">
                    <Checkbox
                        className="cursor-pointer"
                        checked={agreed}
                        onCheckedChange={(checked) => {
                            const isChecked = checked === true;
                            setAgreed(isChecked);
                            if (isChecked) setShowPolicyError(false);
                        }}
                    />

                    You agree to our friendly
                    <span className="underline cursor-pointer">privacy policy</span>
                </div>
                {showPolicyError && (
                    <p className="text-sm text-red-500">
                        You must agree to the privacy policy
                    </p>
                )}

                <button
                    disabled={!isValid || !agreed || isSubmitting}
                    className="py-3 rounded-2xl col-span-2 cursor-pointer text-white
          bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)]
          hover:opacity-90 disabled:opacity-50"
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                </button>
            </div>
            </>
            )}
        </form>
    );
};

export default ContactForm;
