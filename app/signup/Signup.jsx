"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../navbar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInformation from './PersonalInformation';
import { useTheme } from 'next-themes';
import EmploymentHistory from './EmploymentHistory';
import { toast } from 'sonner';
import EducationalBackground from './EducationalBackground';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import Skills from './Skills';

const Signup = () => {
  const [progress, setProgress] = useState(13);
  const [isLoading, setIsLoading] = useState(false);
  const [institutions, setInstitutions] = useState([{ value: "others", label: "Others..." }]);
  const [courses, setCourses] = useState([]);
  const [courseGraduate, setCourseGraduate] = useState([]);
  const [skills, setSkills] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const { setTheme } = useTheme();

  const handleNext = () => {

    if (currentStep === 2) {
      if (localStorage.getItem("educationalBackground") === null || localStorage.getItem("educationalBackground") === "[]") {
        toast.error("Please complete your educational background first");
        return;
      }
    } else if (currentStep === 3) {
      if (localStorage.getItem("employmentHistory") === null || localStorage.getItem("employmentHistory") === "[]") {
        toast.error("Please complete your employment history first");
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const pages = [
    { content: "" },
    { title: "Tell us about your Educational Background", content: <EducationalBackground courseList={courses} graduateCourseList={courseGraduate} institutionList={institutions} /> },
    { title: "Tell us about your Employment History", content: <EmploymentHistory /> },
    { title: "Tell us about your Skills", content: <Skills skillList={skills} /> },

  ];

  const getAllDataForDropdownSignup = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = secureLocalStorage.getItem("url") + "users.php";
      const formData = new FormData();
      formData.append("operation", "getAllDataForDropdownSignup");
      setTimeout(() => {
        setProgress(45);
      }, [1000])
      const res = await axios.post(url, formData);
      console.log(res.data);
      setTimeout(() => {
        setProgress(80);
      }, [1000]);
      if (res.data !== 0) {
        const formattedInstitutions = res.data.institution.map((institution) => ({
          value: institution.institution_id,
          label: institution.institution_name,
          points: institution.institution_points
        }))
        const formattedCourses = res.data.courses.map((course) => ({
          value: course.courses_id,
          label: course.courses_name,
          categoryId: course.course_category_id
        }))
        const formattedCourseGraduate = res.data.courseGraduate.map((courseGrad) => ({
          value: courseGrad.course_graduate_id,
          label: courseGrad.course_graduate_name
        }))
        const formattedSkills = res.data.skills.map((skill) => ({
          value: skill.personal_skills_id,
          label: skill.personal_skills_name
        }))
        const formattedTrainings = res.data.training.map((training) => ({
          value: training.personal_training_id,
          label: training.personal_training_name
        }))
        setInstitutions(formattedInstitutions);
        setCourses(formattedCourses);
        setCourseGraduate(formattedCourseGraduate);
        setSkills(formattedSkills);
        setTrainings(formattedTrainings);

      }
    } catch (error) {
      toast.error("Network error");
      console.log("PersonalInformation.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }
  }, [])


  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    getAllDataForDropdownSignup();
  }, [getAllDataForDropdownSignup]);
  return (
    <main className='bg-[#0e4028]'>
      <div className={`flex flex-col w-full justify-center items-center ${isLoading ? 'h-screen' : ''} `}>
        {isLoading ? <Progress value={progress} className='w-3/4 sm:w-1/3' /> :
          <>
            <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={152} height={152} className='mt-16' />
            {/* Steppers container */}
            <div className="flex items-center gap-3 sm:gap-4 mt-6 w-full max-w-5xl px-4">
              {/* Step 1 */}
              <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 1 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '1'}
              </div>
              {/* Connector */}
              <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              {/* Step 2 */}
              <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 2 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '2'}
              </div>
              {/* Connector */}
              <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              {/* Step 3 */}
              <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 3 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep === 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '3'}
              </div>
              {/* Connector */}
              <div className={`h-1 flex-1 ${currentStep >= 4 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              {/* Step 4 */}
              <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 4 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep === 4 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '4'}
              </div>
              {/* Connector */}
              <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              {/* Step 5 */}
              <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 5 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep === 5 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '5'}
              </div>
            </div>
            {currentStep === 1 ? <PersonalInformation nextPage={handleNext} />
              :
              <div className="w-full max-w-4xl mt-6">
                <ScrollArea className="h-[calc(100vh-25rem)]">
                  <Card className="w-full h-full flex flex-col bg-[#0e5a35]  xs:border-[#0e4028]">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl text-center">{pages[currentStep - 1].title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full">
                      {pages[currentStep - 1].content}
                    </CardContent>
                  </Card>
                </ScrollArea>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mt-3 justify-end">
                  <Button
                    onClick={handlePrevious}
                    className="px-4 py-2 rounded w-full sm:w-auto bg-[#0e5a35]"
                    variant="secondary"
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="px-4 py-2 rounded bg-[#f5f5f5] text-[#0e4028]  w-full sm:w-auto"
                    disabled={currentStep === 5}
                  >
                    Next
                  </Button>
                </div>
              </div>
            }
          </>
        }

      </div>
    </main>
  );
};

export default Signup;
