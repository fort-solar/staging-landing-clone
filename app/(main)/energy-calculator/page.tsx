import React from 'react';
import CalculatorHero from '@/components/ui/calculator/ CalculatorHero';
import CalculatorSectionOne from '@/components/ui/calculator/CalculatorSectionOne';
import CalculatorSectionTwo from '@/components/ui/calculator/CalculatorSectionTwo';

const Page = () => {
  return (
      <div className="min-h-screen  bg-white dark:bg-black">
        <CalculatorHero />
        <CalculatorSectionOne />
        < CalculatorSectionTwo />
      </div>
  )
}

export default Page