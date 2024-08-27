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
    getDropDownForAddJobs();
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <Card className="rounded-md border-4 border-secondary">
        <CardContent>
          <AddJobMaster />
          <Separator className="my-6" />
          <div className='lg:grid lg:grid-cols-2 gap-4'>
            <div className='mb-5'>
              <AddDutiesMaster />
            </div>
            <AddJobEducation />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}

export default AddJob
