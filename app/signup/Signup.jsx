"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInformation from './PersonalInformation';
import { useTheme } from 'next-themes';

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { setTheme } = useTheme();

  const handleNext = () => {
    if (currentStep === 1) {
      //console.log the personalinformation
    }
    if (currentStep < 3) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const pages = [
    { title: "Personal Information", content: <PersonalInformation nextPage={handleNext} /> },
    { title: "Account Information", content: <div>Account Information</div> },
  ];

  useEffect(() => {
    setTheme("dark");
  }, []);

  return (
    <main className='bg-[#0e4028] h-screen'>
      <div className="flex flex-col w-full justify-center items-center">
        <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={152} height={152} className='mt-16' />

        {/* Steppers container */}
        <div className="flex items-center gap-3 sm:gap-4 mt-6 w-full max-w-5xl px-4">
          {/* Step 1 */}
          <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 1 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {currentStep > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '1'}
          </div>
          {/* Connector */}
          <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-primary dark:bg-[#0e4028]' : 'bg-gray-200'}`} />
          {/* Step 2 */}
          <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 2 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {currentStep > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '2'}
          </div>
          {/* Connector */}
          <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-primary dark:bg-[#0e4028]' : 'bg-gray-200'}`} />
          {/* Step 3 */}
          <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 3 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {currentStep === 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '3'}
          </div>
        </div>

        <div className="w-full max-w-4xl mt-6">
          <Card className="w-full h-full flex flex-col bg-[#0e5a35]  xs:border-[#0e4028]">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-center">{pages[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {pages[currentStep - 1].content}
            </CardContent>
          </Card>
        </div>


        {/* Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mt-3 justify-end">
          <Button
            onClick={handlePrevious}
            className="px-4 py-2 rounded w-full sm:w-auto"
            variant="secondary"
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="px-4 py-2 text-white rounded dark:bg-[#0e4028] w-full sm:w-auto"
            disabled={currentStep === 3}
          >
            Next
          </Button>
        </div> */}
      </div>
    </main>
  );
};

export default Signup;
