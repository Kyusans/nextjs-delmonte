"use client";
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import AddJobMaster from './AddJobStep/AddJobMaster';
import AddDutiesMaster from './AddJobStep/AddDutiesMaster';
import { removeData, retrieveData, storeData } from '@/app/utils/storageUtils';
import AddJobEducation from './AddJobStep/AddJobEducation';
import axios from 'axios';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import AddJobTraining from './AddJobStep/AddJobTraining';
import AddJobKnowledge from './AddJobStep/AddJobKnowledge';
import AddJobSkill from './AddJobStep/AddJobSkill';
import AddJobExperience from './AddJobStep/AddJobExperience';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';

function AddJob() {
  const [isLoading, setIsLoading] = useState(true);
  const [courseCategory, setCourseCategory] = useState([]);
  const [training, setTraining] = useState([]);
  const [skills, setSkills] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const getDropDownForAddJobs = async () => {
    setIsLoading(true);
    try {
      const url = retrieveData("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getDropDownForAddJobs");
      const res = await axios.post(url, formData);
      if (res.data !== 0) {
        const formattedCourse = res.data.courseCategory.map((item) => ({
          value: item.course_categoryId,
          label: item.course_categoryName,
        }))

        const formattedTraining = res.data.personalTraining.map((item) => ({
          value: item.perT_id,
          label: item.perT_name,
        }))

        const formattedSkills = res.data.personalSkills.map((item) => ({
          value: item.perS_id,
          label: item.perS_name,
        }))
        setCourseCategory(formattedCourse);
        setTraining(formattedTraining);
        setSkills(formattedSkills);
        console.log("res ni getDropDownForAddJobs", res.data);
      }

    } catch (error) {
      toast.error("Network error");
      console.log("PersonalInformation.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (!retrieveData("jobMaster")) {
      toast.error("Please add Job Master");
      return;
    } else if (!retrieveData("jobKnowledge") || retrieveData("jobKnowledge") === "[]") {
      toast.error("Please add Knowledge");
      return;
    } else if (!retrieveData("jobEducation") || retrieveData("jobEducation") === "[]") {
      toast.error("Please add Education");
      return;
    } else if (!retrieveData("duties") || retrieveData("duties") === "[]") {
      toast.error("Please add Duties");
      return;
    } else if (!retrieveData("jobTraining") || retrieveData("jobTraining") === "[]") {
      toast.error("Please add Training");
      return;
    } else if (!retrieveData("jobSkill") || retrieveData("jobSkill") === "[]") {
      toast.error("Please add Skill");
      return;
    } else if (!retrieveData("jobExperience") || retrieveData("jobExperience") === "[]") {
      toast.error("Please add Experience");
      return;
    }

    try {
      setIsLoading(true);
      const url = retrieveData("url") + "admin.php";
      const jsonData = {
        jobMaster: retrieveData("jobMaster"),
        jobMasterDuties: JSON.parse(retrieveData("duties")),
        jobEducation: JSON.parse(retrieveData("jobEducation")),
        jobTraining: JSON.parse(retrieveData("jobTraining")),
        jobKnowledge: JSON.parse(retrieveData("jobKnowledge")),
        jobSkill: JSON.parse(retrieveData("jobSkill")),
        jobExperience: JSON.parse(retrieveData("jobExperience")),
      }
      // console.log("jsonData", JSON.stringify(jsonData));

      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "addJobMaster");
      const res = await axios.post(url, formData);
      console.log("res ni add job:", res.data);

      if (res.data !== 0) {
        toast.success("Job added successfully");
        setCurrentStep(1);
        removeData("jobMaster");
        storeData("duties", "[]");
        storeData("jobEducation", "[]");
        storeData("jobTraining", "[]");
        storeData("jobKnowledge", "[]");
        storeData("jobSkill", "[]");
        storeData("jobExperience", "[]");
      } else {
        toast.error("Failed to add job");
      }

    } catch (error) {
      toast.error("Network error");
      console.log("AddJob.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNextStep = () => {
    setCurrentStep(2);
  }

  useEffect(() => {
    if (retrieveData("duties") === null) {
      storeData("duties", "[]");
    }
    if (retrieveData("jobEducation") === null) {
      storeData("jobEducation", "[]");
    }
    if (retrieveData("jobTraining") === null) {
      storeData("jobTraining", "[]");
    }
    if (retrieveData("jobKnowledge") === null) {
      storeData("jobKnowledge", "[]");
    }
    if (retrieveData("jobSkill") === null) {
      storeData("jobSkill", "[]");
    }
    if (retrieveData("jobExperience") === null) {
      storeData("jobExperience", "[]");
    }
    getDropDownForAddJobs();
  }, []);

  return (
    <>
      {isLoading ? <Spinner /> :
        <Card className="rounded-md border-4 border-secondary">
          <CardContent>

            <Tabs defaultValue={1} value={currentStep}>
              <TabsContent value={1}>
                <AddJobMaster nextStep={handleNextStep} />
              </TabsContent>
              <TabsContent value={2}>
                <div className='lg:grid lg:grid-cols-2 gap-5 mt-8'>
                  <div className='mb-5'>
                    <AddDutiesMaster />
                  </div>
                  <div className='mb-5'>
                    <AddJobKnowledge />
                  </div>
                  <div className='mb-5'>
                    <AddJobEducation courseCategory={courseCategory} />
                  </div>
                  <div className='mb-5'>
                    <AddJobTraining training={training} />
                  </div>
                  <div className='mb-5'>
                    <AddJobSkill skill={skills} />
                  </div>
                  <div className='mb-5'>
                    <AddJobExperience />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className={`${currentStep === 1 ? "hidden" : "flex justify-between items-end"}`}>
            <Button onClick={() => setCurrentStep(1)}>Previous</Button>
            <Button onClick={handleSubmit}>Add Job</Button>
          </CardFooter>
        </Card>
      }
    </>
  )
}

export default AddJob
