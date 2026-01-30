import React from 'react';
import CalculatorHero from '@/components/ui/calculator/ CalculatorHero';
import CalculatorSectionOne from '@/components/ui/calculator/CalculatorSectionOne';
import CalculatorSectionTwo from '@/components/ui/calculator/CalculatorSectionTwo';
import CalculatorSectionThree from '@/components/ui/calculator/CalculatorSectionThree';
import Newsletter from '@/components/features/global/Newsletter';
import Footer from '@/components/features/global/Footer';
import CalculatorSectionFour from '@/components/ui/calculator/CalculatorSectionFour';

const Page = () => {
  return (
    <div className="min-h-screen  bg-white dark:bg-black">
      <CalculatorHero />
      <CalculatorSectionOne />
      < CalculatorSectionTwo />
      <CalculatorSectionThree />
      <CalculatorSectionFour />
      <Newsletter />
      <Footer />

    </div>
  )
}

export default Page