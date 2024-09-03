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
import axios from 'axios';
import Skills from './Skills';
import Training from './Training';
import Spinner from '@/components/ui/spinner';
import EnterPin from './modals/EnterPin';
import StepsCompleteScreen from './StepsCompleteScreen';
import SubscribeToEmail from './SubscribeToEmail';
import { removeData, retrieveData, storeData } from '../utils/storageUtils';
import { Progress } from '@/components/ui/progress';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [institutions, setInstitutions] = useState([{ value: "others", label: "Others..." }]);
  const [courses, setCourses] = useState([]);
  const [courseGraduate, setCourseGraduate] = useState([]);
  const [skills, setSkills] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const { setTheme } = useTheme();
  const [isValidated, setIsValidated] = useState(false);
  const [progress, setProgress] = useState(0);

  const [pincode, setPincode] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  const handleShowPin = () => { setShowPin(true); }
  const handleHidePin = (status) => {
    switch (status) {
      case 1:
        handleNext();
        setIsValidated(true);
        break;
      case 2:
        setPincode("");
        setExpirationDate("");
        break;
      default:
        break;
    }
    setShowPin(false);
  }

  const handleSaveInformation = async () => {
    setIsLoading(true);
    try {
      const url = retrieveData("url") + "users.php";
      const jsonData = {
        personalInfo: JSON.parse(retrieveData("personalInfo")),
        educationalBackground: JSON.parse(retrieveData("educationalBackground")),
        employmentHistory: JSON.parse(retrieveData("employmentHistory")),
        skills: JSON.parse(retrieveData("skills")),
        trainings: JSON.parse(retrieveData("training")),
        isSubscribeToEmail: retrieveData("isSubscribeToEmail") ?? 0
      }
      console.log("IYANG INFO LMAO: ", jsonData);
      console.log("IYANG INFO lol: ", JSON.stringify(jsonData));
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "signup");
      const res = await axios.post(url, formData);
      console.log("res ni handleSaveInformation: ", res.data);
      if (res.data === 1) {
        toast.success("Signup successful");
        removeData("personalInfo");
        removeData("educationalBackground");
        removeData("employmentHistory");
        removeData("skills");
        removeData("training");
        removeData("positionId");
        removeData("isSubscribeToEmail");

      }
    } catch (error) {
      toast.error("Network error");
      console.log("Signup.jsx => handleSaveInformation(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = () => {

    // if (currentStep === 2) {
    //   if (retrieveData("educationalBackground") === null || retrieveData("educationalBackground") === "[]") {
    //     toast.error("Please complete your educational background first");
    //     return;
    //   }
    // } else if (currentStep === 3) {
    //   if (retrieveData("employmentHistory") === null || retrieveData("employmentHistory") === "[]") {
    //     toast.error("Please complete your employment history first");
    //     return;
    //   }
    // } else if (currentStep === 4) {
    //   if (retrieveData("skills") === null || retrieveData("skills") === "[]") {
    //     toast.error("Please complete your skills first");
    //     return;
    //   }
    // }

    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
      switch (currentStep) {
        case 1:
          setProgress(0);
          break;
        case 2:
          setProgress(25);
          break;
        case 3:
          setProgress(35);
          break;
        case 4:
          setProgress(50);
          break;
        case 5:
          setProgress(75);
          break;
        case 6:
          setProgress(88);
          break;
        default:
          break;
      }
    }

  };

  const handleSubmit = async () => {
    const personalInfo = JSON.parse(retrieveData("personalInfo"))
    if (isValidated === true && email === personalInfo.email) {
      handleNext();
    } else if (pincode === "") {
      try {
        setIsLoading(true);
        const url = retrieveData("url") + "users.php";
        const jsonData = {
          email: personalInfo.email,
        }
        // console.log("url: " + url);
        console.log("email niya: " + JSON.stringify(jsonData));
        const formData = new FormData();
        formData.append("json", JSON.stringify(jsonData));
        formData.append("operation", "getPinCode");
        const res = await axios.post(url, formData);

        // console.log("RES DATA: ", res.data);
        if (res.data === -1) {
          toast.error("Email already exist, please return to step 1");
          return;
        } else if (res.data !== 0) {
          console.log("pincode niya: " + JSON.stringify(res.data));
          setEmail(personalInfo.email);
          setPincode(res.data.pincode);
          setExpirationDate(res.data.expirationDate);
          handleShowPin();
        }

      } catch (error) {
        setTimeout(() => {
          toast.error("Network error");
        }, [500])
        console.log("Signup.jsx => onSubmit(): " + error);
      } finally {
        setIsLoading(false);
      }
    } else {
      handleShowPin();
    }
  };

  const pages = [
    { content: "" },
    { title: "Tell us about your Educational Background", content: <EducationalBackground courseList={courses} graduateCourseList={courseGraduate} institutionList={institutions} /> },
    { title: "Tell us about your Employment History", content: <EmploymentHistory /> },
    { title: "Tell us about your Skills", content: <Skills skillList={skills} /> },
    { title: "Tell us about your Trainings", content: <Training trainingList={trainings} /> },
    { title: "Subscribe to email update?", content: <SubscribeToEmail /> },
    { title: "Woohoo! All steps completed! 🎉", content: <StepsCompleteScreen /> },


  ];

  const getAllDataForDropdownSignup = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = retrieveData("url") + "users.php";
      const formData = new FormData();
      formData.append("operation", "getAllDataForDropdownSignup");
      const res = await axios.post(url, formData);
      console.log(res.data);

      if (res.data !== 0) {
        const formattedInstitutions = res.data.institution.map((institution) => ({
          value: institution.institution_id,
          label: institution.institution_name,
          points: institution.institution_points
        }))
        const formattedCourses = res.data.courses.map((course) => ({
          value: course.courses_id,
          label: course.courses_name,
          categoryId: course.courses_coursecategoryId
        }))
        const formattedCourseGraduate = res.data.courseGraduate.map((courseGrad) => ({
          value: courseGrad.course_graduateId,
          label: courseGrad.course_graduateName
        }))
        const formattedSkills = res.data.skills.map((skill) => ({
          value: skill.perS_id,
          label: skill.perS_name
        }))
        const formattedTrainings = res.data.training.map((training) => ({
          value: training.perT_id,
          label: training.perT_name
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

  useEffect(() => {
    if (retrieveData("educationalBackground") === null) {
      storeData("educationalBackground", "[]");
    }

    if (retrieveData("employmentHistory") === null) {
      storeData("employmentHistory", "[]");
    }
    if (retrieveData("skills", "[]") === null) {
      storeData("skills", "[]");
    }
    if (retrieveData("trainings") === null) {
      storeData("trainings", "[]");
    }
  }, []);
  return (
    <>
      <main className='bg-[#0e4028]'>
        <div className={`flex flex-col w-full justify-center items-center ${isLoading ? 'h-screen' : ''} `}>
          {isLoading ? <Spinner /> :
            <>
              <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={160} height={160} className='my-16' />
              <Progress className="w-full max-w-4xl" value={progress} />
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
                  {currentStep <= 6 &&
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
                        onClick={currentStep === 5 ? handleSubmit : currentStep === 6 ? handleSaveInformation : handleNext}
                        className="px-4 py-2 rounded bg-[#f5f5f5] text-[#0e4028]  w-full sm:w-auto"
                      >
                        {currentStep === 6 ? 'Submit' : 'Next'}
                      </Button>
                    </div>
                  }
                </div>
              }
            </>
          }
        </div>
      </main>
      <EnterPin open={showPin} onHide={handleHidePin} pincode={pincode} expirationDate={expirationDate} />
    </>
  );
};

export default Signup;

              // {/* Steppers container
              // <div className="flex items-center gap-3 sm:gap-4 mt-6 w-full max-w-5xl px-4">
              //   {/* Step 1 */}
              //   <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 1 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
              //     {currentStep > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '1'}
              //   </div>
              //   {/* Connector */}
              //   <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              //   {/* Step 2 */}
              //   <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 2 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
              //     {currentStep > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '2'}
              //   </div>
              //   {/* Connector */}
              //   <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              //   {/* Step 3 */}
              //   <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 3 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
              //     {currentStep > 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '3'}
              //   </div>
              //   {/* Connector */}
              //   <div className={`h-1 flex-1 ${currentStep >= 4 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              //   {/* Step 4 */}
              //   <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 4 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
              //     {currentStep > 4 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '4'}
              //   </div>
              //   {/* Connector */}
              //   <div className={`h-1 flex-1 ${currentStep >= 5 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              //   {/* Step 5 */}
              //   <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 5 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
              //     {currentStep > 5 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '5'}
              //   </div>
              //   {/* Connector */}
              //   <div className={`h-1 flex-1 ${currentStep >= 6 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
              //   {/* Step 6 */}
              //   <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 6 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
              //     {currentStep > 6 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '6'}
              //   </div>
              // </div> 
