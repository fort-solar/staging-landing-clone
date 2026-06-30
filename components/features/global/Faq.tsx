
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORE_PRODUCTS_URL } from "@/lib/store-links";

const Faq = () => {
    const pathname = usePathname();
    return (
        <div className="mt-20 bg-[url('/sun.png')] bg-cover bg-center">
            <div className='relative overflow-hidden bg-transparent'>
                <div className="relative min-h-screen w-full max-w-6xl mx-auto px-4 py-20 space-y-10  dark:bg-black sm:items-start">
                    <div className='flex flex-col lg:flex-row justify-center text-center gap-6 lg:gap-2 lg:text-start lg:justify-between w-full items-center mt-5'>
                        <div className="leading-10 lg:leading-16 rounded-xl max-w-2xl text-3xl lg:text-5xl font-bold font-poppins mt-2">
                            Frequently Asked Questions
                        </div>
                        {
                            pathname !== "/contact" && (
                                <div className="w-full lg:w-fit">
                                    <Link href="/contact" className="w-full lg:w-fit">
                                        <Button variant="outline" className="w-full lg:w-fit rounded-xl py-6 border-[#0000004D] cursor-pointer">
                                            Learn More
                                        </Button>
                                    </Link>

                                </div>
                            )
                        }

                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-2">
                        <div className="order-2 lg:order-1  flex items-end">
                            <div className="space-y-2 text-white lg:w-[80%] rounded-xl h-fit bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] p-4">
                                <p className="text-lg font-bold">
                                    Don&apos;t see what you&apos;re looking for?
                                </p>
                                <p className="text-sm">
                                    Reach out to our team directly and we&apos;ll get back to you.
                                </p>
                                <Link href={pathname === "/contact" ? "" : "/contact"} className="w-full lg:w-fit">
                                    <Button className="w-full py-6 lg:w-fit rounded-xl bg-white text-[#048A05] hover:bg-white hover:opacity-90 cursor-pointer">
                                        Get in Touch
                                    </Button>
                                </Link>


                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <Accordion type="single" collapsible className="w-full space-y-4">

                                <AccordionItem
                                    value="item-1"
                                    className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                >
                                    <AccordionTrigger
                                        className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                    >
                                        What does Fortsolar do?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                        Fortsolar provides reliable solar energy solutions, including solar installations, inverters, batteries, solar
                                        products such as solar fans and solar streetlights, and solar system design. Fortsolar offers the best after-
                                        sales services for homes and businesses in Nigeria. <Link className="underline text-black" href={STORE_PRODUCTS_URL}>Explore our products</Link>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-2"
                                    className="border border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                >
                                    <AccordionTrigger
                                        className=" text-lg
                text-left font-medium 
                data-[state=open]:text-fbp-secondary
              "
                                    >
                                        Is solar power reliable to power any loads in Nigeria?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                        Yes. With Nigeria’s high levels of sunlight, solar power is a reliable alternative to the national grid,
                                        especially when properly sized and installed by experts like Fortsolar.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-3"
                                    className="border  border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                >
                                    <AccordionTrigger
                                        className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                    >
                                        How much does a solar system cost in Nigeria?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                        Solar system costs vary based on energy needs, battery size, and inverter capacity. Fortsolar offers a free
                                        energy audit that assesses your power consumption, appliances, usage patterns, and budget to
                                        recommend the best solar solution tailored to your energy needs. <Link className="underline text-black" href="/energy-calculator">Book a free energy audit</Link>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-4"
                                    className="border border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                >
                                    <AccordionTrigger
                                        className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                    >
                                        Can solar power run my AC or industrial equipment?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                        Yes. Fortsolar designs systems that can power heavy appliances such as air conditioners, freezers, pumps,
                                        and office or industrial equipment.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-4"
                                    className="border border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                >
                                    <AccordionTrigger
                                        className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                    >
                                        How long do solar components last, and are they covered by warranties?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                        Solar panels typically last 20–25 years with a 12–25-year warranty; solar inverters typically come with a 3–
                                        10-year warranty; while lithium batteries last 8–12 years (or 6000 cycles) with a 5-10-year warranty,
                                        depending on proper usage and maintenance.
                                        Fortsolar offers a 1–3-year warranty on workmanship and after-sales service, so when you install, you can
                                        go on with zero worries.
                                    </AccordionContent>
                                </AccordionItem>
                                {pathname === "/contact" && (
                                    <div className="w-full space-y-4">

                                        <AccordionItem
                                            value="item-6"
                                            className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                        >
                                            <AccordionTrigger
                                                className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                            >
                                                What happens when there is no sunlight?
                                            </AccordionTrigger>
                                            <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                                Solar systems store energy in batteries, allowing you to use power at night or during cloudy periods
                                                without interruption.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="item-7"
                                            className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                        >
                                            <AccordionTrigger
                                                className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                            >
                                                Does Fortsolar offer free delivery and installation?
                                            </AccordionTrigger>
                                            <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                                Yes. Free delivery and installation apply to most of our solar bundle purchases and other products; you will
                                                see this information on the product overview page.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="item-8"
                                            className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                        >
                                            <AccordionTrigger
                                                className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                            >
                                                Does Fortsolar offer maintenance and support?
                                            </AccordionTrigger>
                                            <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                                Yes. Fortsolar offers ongoing maintenance, monitoring, technical support and after-sales to ensure your
                                                system performs optimally.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="item-9"
                                            className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                        >
                                            <AccordionTrigger
                                                className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                            >
                                                How long does solar installation take?
                                            </AccordionTrigger>
                                            <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                                Most residential and commercial solar installations by Fortsolar are completed within 2–7 days, depending
                                                on system size.
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="item-10"
                                            className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                                        >
                                            <AccordionTrigger
                                                className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                            >
                                                Is solar really cheaper than a gasoline generator?
                                            </AccordionTrigger>
                                            <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                                Yes. Solar significantly reduces fuel and generator maintenance costs, as well as electricity costs, making it
                                                more cost-effective in the long term. With Fortsolar&apos;s financing model, you can get a system installed with
                                            </AccordionContent>
                                        </AccordionItem>
                                    </div>
                                )}

                            </Accordion></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Faq
