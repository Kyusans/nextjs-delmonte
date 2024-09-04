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
import KnowledgeForm from './KnowledgeAndCompliance';
import ShowAlert from '@/components/ui/show-alert';
import { useRouter } from 'next/navigation';
import LicenseModule from './LicenseModule';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [institutions, setInstitutions] = useState([{ value: "others", label: "Others..." }]);
  const [courses, setCourses] = useState([]);
  const [courseGraduate, setCourseGraduate] = useState([]);
  const [skills, setSkills] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const { setTheme } = useTheme();
  const [isValidated, setIsValidated] = useState(false);
  const [license, setLicense] = useState([]);
  const [licenseType, setLicenseType] = useState("");

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

  const router = useRouter();

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
        knowledge: JSON.parse(retrieveData("knowledge")),
        licenses: JSON.parse(retrieveData("licenses")),
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
        setCurrentStep(prevStep => prevStep + 1);
        removeData("personalInfo");
        removeData("educationalBackground");
        removeData("employmentHistory");
        removeData("skills");
        removeData("training");
        removeData("positionId");
        removeData("knowledge");
        removeData("licenses");
        removeData("isSubscribeToEmail");
        setTimeout(() => {
          router.push("/login");
        }, 1250)
      }
    } catch (error) {
      toast.error("Network error");
      console.log("Signup.jsx => handleSaveInformation(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = (status) => {
    if (status === 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
    setShowAlert(false);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (retrieveData("educationalBackground") === null || retrieveData("educationalBackground") === "[]") {
        handleShowAlert("You didn't put any educational background. Are you sure you want to continue?");
        return;
      }
    }
    else if (currentStep === 3) {
      if (retrieveData("licenses") === null || retrieveData("licenses") === "[]") {
        handleShowAlert("You didn't put any licenses. Are you sure you want to continue?");
        return;
      }
    } else if (currentStep === 4) {
      if (retrieveData("employmentHistory") === null || retrieveData("employmentHistory") === "[]") {
        handleShowAlert("You didn't put any employment history. Are you sure you want to continue?");
        return;
      }
    } else if (currentStep === 5) {
      if (retrieveData("knowledge") === null || retrieveData("knowledge") === "[]") {
        handleShowAlert("You didn't put any knowledge and compliance. Are you sure you want to continue?");
        return;
      }
    } else if (currentStep === 6) {
      if (retrieveData("skills") === null || retrieveData("skills") === "[]") {
        handleShowAlert("You didn't put any skills. Are you sure you want to continue?");
        return;
      }
    } else if (currentStep === 7) {
      if (retrieveData("training") === null || retrieveData("training") === "[]") {
        handleShowAlert("You didn't put any trainings. Are you sure you want to continue?");
        return;
      }
    }
    setCurrentStep(prevStep => prevStep + 1)
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
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
    { title: "Educational Background", content: <EducationalBackground courseList={courses} graduateCourseList={courseGraduate} institutionList={institutions} /> },
    { title: "Licenses", content: <LicenseModule licenseType={licenseType} licenseList={license} /> },
    { title: "Employment History", content: <EmploymentHistory /> },
    { title: "Knowledge and compliance", content: <KnowledgeForm knowledgeList={knowledge} /> },
    { title: "Skills", content: <Skills skillList={skills} /> },
    { title: "Trainings", content: <Training trainingList={trainings} /> },
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
          categoryId: course.courses_coursecategoryId,
          courseType: course.courses_courseTypeId
        }))
        const formattedCourseGraduate = res.data.courseType.map((courseGrad) => ({
          value: courseGrad.crs_type_id,
          label: courseGrad.crs_type_name
        }))
        const formattedSkills = res.data.skills.map((skill) => ({
          value: skill.perS_id,
          label: skill.perS_name
        }))
        const formattedTrainings = res.data.training.map((training) => ({
          value: training.perT_id,
          label: training.perT_name
        }))
        const formattedKnowledge = res.data.knowledge.map((knowledge) => ({
          value: knowledge.knowledge_id,
          label: knowledge.knowledge_name
        }))
        const formattedLicenseType = res.data.licenseType.map((licenseType) => ({
          value: licenseType.license_type_id,
          label: licenseType.license_type_name
        }))
        const formattedLicense = res.data.license.map((license) => ({
          value: license.license_master_id,
          label: license.license_master_name,
          type: license.license_master_typeId
        }))
        setLicenseType(formattedLicenseType);
        setLicense(formattedLicense);
        setInstitutions(formattedInstitutions);
        setCourses(formattedCourses);
        setCourseGraduate(formattedCourseGraduate);
        setSkills(formattedSkills);
        setTrainings(formattedTrainings);
        setKnowledge(formattedKnowledge);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("Signup.jsx => onSubmit(): " + error);
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

    if (retrieveData("knowledge") === null) {
      storeData("knowledge", "[]");
    }

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

    if (retrieveData("licenses") === null) {
      storeData("licenses", "[]");
    }
  }, []);
  return (
    <>
      <main className='bg-[#0e4028]'>
        <div className={`flex flex-col w-full justify-center items-center ${isLoading ? 'h-screen' : ''} `}>
          {isLoading ? <Spinner /> :
            <>
              <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={152} height={152} className='mt-16' />
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
                  {currentStep > 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '3'}
                </div>
                {/* Connector */}
                <div className={`h-1 flex-1 ${currentStep >= 4 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
                {/* Step 4 */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 4 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 4 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '4'}
                </div>
                {/* Connector */}
                <div className={`h-1 flex-1 ${currentStep >= 5 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
                {/* Step 5 */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 5 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 5 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '5'}
                </div>
                {/* Connector */}
                <div className={`h-1 flex-1 ${currentStep >= 6 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
                {/* Step 6 */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 6 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 6 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '6'}
                </div>
                {/* Connector */}
                <div className={`h-1 flex-1 ${currentStep >= 7 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
                {/* Step 7 */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 7 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 7 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '7'}
                </div>
                {/* Connector */}
                <div className={`h-1 flex-1 ${currentStep >= 7 ? 'bg-primary dark:bg-[#16995a]' : 'bg-gray-200'}`} />
                {/* Step 8 */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border ${currentStep >= 8 ? 'dark:border-white dark:border-1 dark:bg-[#0e5a35] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 8 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : '8'}
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
                  {currentStep <= 8 &&
                    <div className="flex flex-row gap-4 w-full max-w-4xl mt-3 justify-end p-3">
                      <Button
                        onClick={handlePrevious}
                        className="px-4 py-2 rounded w-full sm:w-auto bg-[#0e5a35]"
                        variant="secondary"
                        disabled={currentStep === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={currentStep === 7 ? handleSubmit : currentStep === 8 ? handleSaveInformation : handleNext}
                        className="px-4 py-2 rounded bg-[#f5f5f5] text-[#0e4028]  w-full sm:w-auto"
                      >
                        {currentStep === 8 ? 'Submit' : 'Next'}
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
      <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
    </>
  );
};

export default Signup;