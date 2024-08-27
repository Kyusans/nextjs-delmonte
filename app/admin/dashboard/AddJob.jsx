"use client";
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import AddJobMaster from './AddJobStep/AddJobMaster';
import { Separator } from '@/components/ui/separator';
import AddDutiesMaster from './AddJobStep/AddDutiesMaster';
import { ScrollArea } from '@/components/ui/scroll-area';
import { retrieveData, storeData } from '@/app/utils/storageUtils';
import AddJobEducation from './AddJobStep/AddJobEducation';
import axios from 'axios';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import AddJobTraining from './AddJobStep/AddJobTraining';
import AddJobKnowledge from './AddJobStep/AddJobKnowledge';
import AddJobSkill from './AddJobStep/AddJobSkill';

function AddJob() {
  const [isLoading, setIsLoading] = useState(true);
  const [courseCategory, setCourseCategory] = useState([]);
  const [training, setTraining] = useState([]);
  const [skills, setSkills] = useState([]);
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
    if(retrieveData("jobSkill") === null) {
      storeData("jobSkill", "[]");
    }
    if(retrieveData("jobExperience") === null) {
      storeData("jobExperience", "[]");
    }
    getDropDownForAddJobs();
  }, []);

  return (
    <>
      {isLoading ? <Spinner /> :
          <Card className="rounded-md border-4 border-secondary">
            <CardContent>
              <AddJobMaster />
              <Separator className="my-6" />
              <div className='lg:grid lg:grid-cols-2 gap-4'>
                <div className='mb-5'>
                  <AddDutiesMaster />
                </div>
                <div className='mb-5'>
                  <AddJobEducation courseCategory={courseCategory} />
                </div>
                <div className='mb-5'>
                  <AddJobTraining training={training} />
                </div>
                <div className='mb-5'>
                  <AddJobKnowledge />
                </div>

                <div className='mb-5'>
                  <AddJobSkill skill={skills} />
                </div>

              </div>

            </CardContent>
          </Card>
      }
    </>
  )
}

export default AddJob
