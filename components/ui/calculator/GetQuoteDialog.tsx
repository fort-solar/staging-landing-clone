"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import GradientCheckbox from "@/components/ui/gradient-checkbox";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCATION_OPTIONS = [
    { label: "Urban", value: "Urban" },
    { label: "Rural", value: "Rural" },
] as const;

const INSTALLATION_TYPE_OPTIONS = [
    { label: "Residential", value: "Residential" },
    { label: "Commercial/Industrial (C&I)", value: "Commercial/Industrial (C&I)" },
] as const;

const BUILDING_TYPE_OPTIONS = [
    { label: "Flat / Apartment", value: "Flat / Apartment" },
    { label: "Bungalow", value: "Bungalow" },
    { label: "Duplex", value: "Duplex" },
    { label: "Mansion / High-Rise", value: "Mansion / High-Rise" },
] as const;

function SelectDropdown({
    value,
    onValueChange,
    options,
    placeholder,
}: {
    value: string;
    onValueChange: (val: string) => void;
    options: readonly { label: string; value: string }[];
    placeholder: string;
}) {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={e => onValueChange(e.target.value)}
                className={cn(
                    "h-11 w-full appearance-none rounded-xl bg-[#F2F4F7] px-4 pr-10 text-sm outline-none transition cursor-pointer font-medium border border-transparent focus:border-[#2CB22C] focus:bg-white",
                    value ? "text-[#101828]" : "text-[#98A2B3]"
                )}
            >
                <option value="" disabled className="text-[#98A2B3]">
                    {placeholder}
                </option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="text-[#101828] py-1.5">
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#667085]" />
        </div>
    );
}

type Totals = {
    totalWh: number;
    dailyKWh: number;
    peakKW: number;
};

type SelectedDevice = {
    item: string;
    quantity: number;
    watts: number;
    hours: number;
    wattHours: number;
};

type Props = {
    totals: Totals;
    selectedDevices: SelectedDevice[];
    disabled?: boolean;
    isSubmitting?: boolean;
    onSubmit?: (payload: {
        name: string;
        email: string;
        phone: string;
        location: string;
        address?: string;
        installationType: string;
        buildingType?: string;
        termsAccepted: boolean;
        createAccount: boolean;
        note?: string;
        summary: {
            peakKW: number;
            dailyKWh: number;
            items: SelectedDevice[];
        };
    }) => Promise<void> | void;
};

export default function GetQuoteDialog({
    totals,
    selectedDevices,
    disabled = false,
    isSubmitting = false,
    onSubmit,
}: Props) {
    const [open, setOpen] = useState(false);


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [installationType, setInstallationType] = useState("");
    const [buildingType, setBuildingType] = useState("");
    const [note, setNote] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);

    const [summaryOpen, setSummaryOpen] = useState(true);

    const itemsToPowerText = useMemo(() => {
        const labels = selectedDevices
            .map(d => (d.item ? d.item : ""))
            .filter(Boolean);

        if (!labels.length) return "None selected";
        const joined = labels.join(", ");
        return joined.length > 40 ? `${joined.slice(0, 40)}…` : joined;
    }, [selectedDevices]);

    const canSubmit =
        !isSubmitting &&
        !disabled &&
        totals.totalWh > 0 &&
        name.trim().length > 1 &&
        email.trim().length > 3 &&
        phone.trim().length > 6 &&
        location &&
        installationType &&
        termsAccepted;

    const [isSuccess, setIsSuccess] = useState(false);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setLocation("");
        setAddress("");
        setInstallationType("");
        setBuildingType("");
        setNote("");
        setTermsAccepted(false);
        setCreateAccount(false);
        setSummaryOpen(true);
        setIsSuccess(false);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                name,
                email,
                phone,
                location,
                address: address.trim() || undefined,
                installationType,
                buildingType: buildingType.trim() || undefined,
                termsAccepted,
                createAccount,
                note: note.trim() || undefined,
                summary: {
                    peakKW: Number(totals.peakKW.toFixed(2)),
                    dailyKWh: Number(totals.dailyKWh.toFixed(2)),
                    items: selectedDevices,
                },
            };

            await onSubmit?.(payload);
            setIsSuccess(true);
        } catch {
            // Handled by parent via toast.
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={next => {
                setOpen(next);
                if (!next) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button
                    disabled={disabled || isSubmitting}
                    className="cursor-pointer text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] px-6 py-6 rounded-xl hover:opacity-90 disabled:opacity-50 w-full sm:w-auto text-base font-semibold"
                >
                    Get Quote →
                </Button>
            </DialogTrigger>

            <DialogContent className="p-0 sm:max-w-130 max-h-[90vh] rounded-3xl overflow-hidden">
                {isSuccess ? (
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        <div className="h-16 w-16 bg-[#ECFDF3] rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-[#027A48]" />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-[#101828]">
                                Quote Request Submitted!
                            </h3>
                            <p className="text-sm text-[#667085]">
                                Thank you, <span className="font-semibold text-[#101828]">{name}</span>. 
                                Your quote request has been successfully submitted. Our team will review your energy configuration and contact you within 24 business hours.
                            </p>
                        </div>

                        {createAccount ? (
                            <div className="w-full bg-[#F9FAFB] rounded-xl p-4 flex flex-col items-center space-y-2 border border-[#EAECF0]">
                                <div className="flex items-center gap-2 text-sm text-[#027A48] font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2CB22C] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2CB22C]"></span>
                                    </span>
                                    Redirecting to complete your signup...
                                </div>
                                <p className="text-xs text-[#667085]">
                                    You will be redirected shortly to choose a password.
                                </p>
                            </div>
                        ) : (
                            <Button 
                                onClick={() => setOpen(false)}
                                className="w-full rounded-xl text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-90 py-5"
                            >
                                Done
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="px-6 pt-6">
                            <DialogHeader>
                                <DialogTitle className="text-[18px] font-semibold text-[#101828]">
                                    Ready to Go Solar? Let’s Get Started!
                                </DialogTitle>
                                <DialogDescription className="text-sm text-[#667085]">
                                    Please confirm your details and project location so our team can prepare your
                                    personalized final quote and installation schedule.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                <div className="px-6 pb-6 pt-4 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">

                    <button
                        type="button"
                        onClick={() => setSummaryOpen(v => !v)}
                        className="w-full rounded-xl border border-[#D1FADF] bg-[#ECFDF3] px-4 py-3 flex items-center justify-between"
                    >
                        <span className="text-sm font-medium text-[#027A48]">
                            Your Calculated Solution Summary
                        </span>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 text-[#027A48] transition-transform",
                                summaryOpen ? "rotate-180" : "rotate-0"
                            )}
                        />
                    </button>

                    {summaryOpen && (
                        <div className="rounded-xl border border-[#EAECF0] bg-white px-4 py-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#667085]">Total Estimated Load</span>
                                <span className="font-medium text-[#101828]">{totals.peakKW.toFixed(1)} kW</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#667085]">Estimated Daily Energy Use</span>
                                <span className="font-medium text-[#101828]">{totals.dailyKWh.toFixed(1)} kWh</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#667085]">Items to be powered</span>
                                <span className="font-medium text-[#101828] text-right max-w-55">
                                    {itemsToPowerText}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        <p className="text-sm font-semibold text-[#101828]">Contact Information</p>

                        <Field label="Full Name">
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Idara Emeka Umar"
                                className="h-11 w-full rounded-xl bg-[#F2F4F7] px-4 text-sm outline-none ring-0 placeholder:text-[#98A2B3]"
                            />
                        </Field>

                        <Field label="Email Address">
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="e.g. idaraemekaumar@email.com"
                                type="email"
                                className="h-11 w-full rounded-xl bg-[#F2F4F7] px-4 text-sm outline-none ring-0 placeholder:text-[#98A2B3]"
                            />
                        </Field>

                        <Field label="Phone Number">
                            <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+234"
                                className="h-11 w-full rounded-xl bg-[#F2F4F7] px-4 text-sm outline-none ring-0 placeholder:text-[#98A2B3]"
                            />
                        </Field>
                    </div>

                    {/* Project location & details */}
                    <div className="space-y-8">
                        <p className="text-sm font-semibold text-[#101828]">Project Location & Details</p>

                        <Field label="Location">
                            <SelectDropdown value={location} onValueChange={setLocation} options={LOCATION_OPTIONS} placeholder="Select Location (e.g. Urban)" />
                        </Field>

                        <Field label="Installation Address (Optional)">
                            <input
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="No 24,"
                                className="h-11 w-full rounded-xl bg-[#F2F4F7] px-4 text-sm outline-none ring-0 placeholder:text-[#98A2B3]"
                            />
                        </Field>

                        <Field label="Installation Type">
                            <SelectDropdown value={installationType} onValueChange={setInstallationType} options={INSTALLATION_TYPE_OPTIONS} placeholder="Select Installation Type" />
                        </Field>

                        <Field label="Building Type (Optional)">
                            <SelectDropdown value={buildingType} onValueChange={setBuildingType} options={BUILDING_TYPE_OPTIONS} placeholder="Select Building Type" />
                        </Field>

                        <Field label="Note (Optional)">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Fill in any extra information you want us to know regarding where you would like this system to be installed."
                                rows={4}
                                className="w-full rounded-xl bg-[#F2F4F7] px-4 py-3 text-sm outline-none ring-0 placeholder:text-[#98A2B3] resize-none"
                            />
                        </Field>
                    </div>

                    {/* Terms & Account Creation */}
                    <div className="space-y-4">
                        <GradientCheckbox
                            checked={termsAccepted}
                            onChange={e => setTermsAccepted(e.target.checked)}
                            label="I agree to the terms of service to receive a call/email regarding my quote."
                            labelClassName="text-sm text-[#475467]"
                        />

                        <GradientCheckbox
                            checked={createAccount}
                            onChange={e => setCreateAccount(e.target.checked)}
                            label="Create an account with these details"
                            labelClassName="text-sm text-[#475467] font-medium"
                        />
                    </div>

                    {/* Footer buttons */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="rounded-xl px-6 text-white bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] hover:opacity-90 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Get My Final Quote →"}
                        </Button>
                    </div>
                </div>
                </>
            )}
        </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    const isOptional = label.includes("(Optional)");
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#344054]">
                {label}
                {!isOptional && <span className="text-[#F35B5B] ml-1">*</span>}
            </p>
            {children}
        </div>
    );
}
