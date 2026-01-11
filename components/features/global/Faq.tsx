
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

const Faq = () => {
    return (
        <div className="mt-20 bg-[url('/sun.png')] bg-cover bg-center">
            <div className='relative overflow-hidden bg-transparent'>
                <div className="relative min-h-screen w-full max-w-6xl mx-auto px-4 py-20 space-y-10  dark:bg-black sm:items-start">
                    <div className='flex justify-between w-full items-center mt-5'>
                        <div className="leading-16 max-w-2xl text-3xl lg:text-5xl font-bold font-poppins mt-2">
                            Frequently Asked Questions
                        </div>
                        <div>
                            <Button variant="outline" className="w-fit border-[#0000004D] cursor-pointer">
                                Learn More
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-[4fr_8fr]">
                        <div className="flex items-end">
                          <div className="space-y-1 text-white w-[80%] rounded-xl h-fit bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] p-4">
                            <p className="text-lg font-bold">
                                Don&apos;t see what you&apos;re looking for?
                            </p>
                            <p className="text-sm">
                                Reach out to our team directly and we&apos;ll get back to you.
                            </p>
                            <Button
                                className="
                                          cursor-pointer
                                text-[#058A05]
                                bg-white
                                hover:opacity-90
                              "
                            >
                                Get in Touch
                            </Button>

                        </div>   
                        </div>
                       
                        <div><Accordion type="single" collapsible className="w-full space-y-4">


                            <AccordionItem
                                value="item-1"
                                className="border border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                            >
                                <AccordionTrigger
                                    className=" text-lg
                text-left font-medium 
                data-[state=open]:text-fbp-secondary
              "
                                >
                                    Do I need to pay the full amount upfront?
                                </AccordionTrigger>
                                <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                    Not you don&apos;t need to. We have a payment plan that can help you break down payments to convinent chunks
                                </AccordionContent>
                            </AccordionItem>


                            <AccordionItem
                                value="item-2"
                                className="border  border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                            >
                                <AccordionTrigger
                                    className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                >
                                    How long does installation take
                                </AccordionTrigger>
                                <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                    Most FortSolar installations are completed within 2–5 days, depending on system size and site conditions. Our team handles everything from inspection to setup, ensuring minimal disruption to your routine.
                                </AccordionContent>
                            </AccordionItem>


                            <AccordionItem
                                value="item-3"
                                className="border border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                            >
                                <AccordionTrigger
                                    className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                >
                                    What happens during a free energy audit?
                                </AccordionTrigger>
                                <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae alias voluptate omnis laudantium quibusdam deleniti optio dolore architecto natus libero odio vero iusto placeat eligendi, ratione fugiat quis voluptas officiis!
                                </AccordionContent>
                            </AccordionItem>


                            <AccordionItem
                                value="item-4"
                                className="border border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                            >
                                <AccordionTrigger
                                    className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                >
                                    Can I use solar power during cloudy or rainy days?
                                </AccordionTrigger>
                                <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                    Yes you can
                                </AccordionContent>
                            </AccordionItem>


                            <AccordionItem
                                value="item-5"
                                className="border border-b border-gray-400 rounded-lg px-4 data-[state=open]:border-fbp-secondary"
                            >
                                <AccordionTrigger
                                    className="text-left text-lg font-medium data-[state=open]:text-fbp-secondary"
                                >
                                    How long will my solar system last?
                                </AccordionTrigger>
                                <AccordionContent className="text-[16px] opacity-80 leading-relaxed">
                                    All our solar systems come with one year warranty
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Faq