"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { submitForm } from "@/actions/SubmitForm";
import { ContactFormData, ContactFormSchema } from "@/types/api.types";



interface ContactHeroProps {
    formRef: React.RefObject<HTMLFormElement | null>;
}

const ContactForm = ({ formRef }: ContactHeroProps) => {
    const [agreed, setAgreed] = React.useState(false);
    const [showPolicyError, setShowPolicyError] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);



    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        trigger
    } = useForm<ContactFormData>({
        resolver: zodResolver(ContactFormSchema),
        mode: "onChange"
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
                    endpoint: "contact-us",
                    method: "POST",
                    values: payload,
                }),
                {
                    loading: "Sending message...",
                    position: "top-right",
                    success: () => {
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
                        return "Your message has been sent successfully";
                    },
                    error: (err) => err?.error ?? "Something went wrong",
                }
            );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // toast.promise 
        }
    };


    React.useEffect(() => {
        const timeout = setTimeout(() => {
            trigger();
        }, 100);

        return () => clearTimeout(timeout);
    }, [trigger]);





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

            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className="label">First name</label>
                    <input
                        {...register("firstName")}
                        className="input"
                        placeholder="John"
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
                        placeholder="Doe"
                    />
                </div>

                <div>
                    <label className="label">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="input"
                        placeholder="you@email.com"
                    />
                </div>

                <div>
                    <label className="label">Phone number</label>
                    <input
                        {...register("phone")}
                        className="input"
                        placeholder="+234 0901 262 4182"
                    />
                </div>

                <div className="col-span-2">
                    <label className="label">Subject</label>
                    <input
                        {...register("subject")}
                        className="input"
                        placeholder="Message Subject"
                    />
                </div>

                <div className="col-span-2">
                    <label className="label">Message</label>
                    <textarea
                        {...register("message")}
                        rows={5}
                        className="input"
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
          bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)]
          hover:opacity-90 disabled:opacity-50"
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
