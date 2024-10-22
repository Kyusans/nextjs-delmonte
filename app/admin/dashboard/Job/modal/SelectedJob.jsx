import { removeData, storeData } from '@/app/utils/storageUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import UpdateJobModal from '../AddJobStep/modals/UpdateJobDetails/UpdateJobModal';
import { Badge } from '@/components/ui/badge';
import InterviewPage from '../Interview/InterviewPage';
import ViewApplicants from '../ViewApplicants/ViewApplicants';
import ExamPage from '../Exam/ExamPage';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

function SelectedJob({ open, onHide, jobId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);

  const getSelectedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      const jsonData = { jobId: jobId };
      const formData = new FormData();
      formData.append("operation", "getSelectedJobs");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("RES DATA ni getSelectedJobs: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
        if (res.data.exam !== 0) {
          const response = res.data.exam
          storeData("examId", response.examMaster[0].exam_id)
        }
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (open) {
      getSelectedJobs();
      storeData("jobId", jobId);
    }
  }, [getSelectedJobs, jobId, open]);

  const [openUpdateJob, setOpenUpdateJob] = useState(false);
  const [type, setType] = useState("");
  const [jobData, setJobData] = useState([]);

  const handleOpenUpdateJob = (data, type) => {
    setJobData(data);
    setType(type);
    setOpenUpdateJob(true);
  }

  const handleCloseUpdateJob = () => {
    setOpenUpdateJob(false);
    getSelectedJobs();
  }

  // const handleUpdateJob = () => {
  //   return <UpdateJobModal open={openUpdateJob} onClose={handleCloseUpdateJob} jobData={jobData} type={type} getSelectedJobs={getSelectedJobs} />;
  // };

  const handleClose = () => {
    removeData("jobId");
    removeData("selectedStatus");
    removeData("jobEducation");
    removeData("jobTraining");
    removeData("jobKnowledge");
    removeData("jobSkill");
    removeData("jobExperience");
    removeData("jobMaster");
    removeData("duties");
    onHide();
  };
  // bg-[#107343] dark:bg-background
  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="flex flex-col h-screen md:h-[80vh]">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>{data.jobMaster[0].jobM_title}</SheetTitle>
                <SheetDescription className="text-start">
                  {data.jobMaster[0].jobM_description}
                </SheetDescription>
              </SheetHeader>
              <Card className="p-1 w-full md:p-2 dark:bg-[#1c1917] flex-grow overflow-hidden">
                <Tabs defaultValue={selectedTab} className="h-full flex flex-col" onValueChange={(value) => setSelectedTab(value)}>
                  <TabsList>
                    <TabsTrigger value={1}>Details</TabsTrigger>
                    <TabsTrigger value={2}>Applicants</TabsTrigger>
                    <TabsTrigger value={3}>Interview</TabsTrigger>
                    <TabsTrigger value={4}>Exam</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="flex-grow">
                    <TabsContent value={1} className="h-full">
                      <div>
                        <div className="flex items-center w-full px-3">
                          <span className='text-sm my-3 font-bold flex items-center mr-2'>Duties and Responsibilities</span>
                          <div>
                            <Edit className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleOpenUpdateJob(data.jobDuties, "duties")} />
                          </div>
                        </div>
                        <div className='w-full px-6'>
                          {data.jobDuties.length > 0 ? (
                            data.jobDuties.map((data, index) => (
                              <ul key={index} className="list-disc ml-4 mb-1">
                                <li>{data.duties_text}</li>
                              </ul>
                            ))
                          ) : (
                            <p>No duties and responsibilities found.</p>
                          )}
                        </div>
                        <div className='w-full px-3 mt-3'>
                          <div className='text-sm mb-3 font-bold flex items-center'>
                            <span className='mr-2'>Educational Background </span>
                            <Edit className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleOpenUpdateJob(data.jobEducation, "education")} />
                          </div>
                          {data.jobEducation.length > 0 ? (
                            <>
                              <div className='w-full ml-3'>
                                {data.jobEducation.map((data, index) => (
                                  <ul key={index} className="list-disc ml-4 mb-3">
                                    <li>
                                      Graduate of any {data.course_categoryName} courses.
                                      <Badge className='ml-2 text-xs'>{data.jeduc_points} point{data.jeduc_points > 1 ? "s" : ""}</Badge>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="ml-3">No educational background found.</p>
                            </>
                          )}
                          <div className='text-sm my-3 font-bold flex items-center'>
                            <span className='mr-2'>Skills</span>
                            <Edit className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleOpenUpdateJob(data.jobSkills, "skills")} />
                          </div>
                          {data.jobSkills.length > 0 ? (
                            <>
                              <div className='w-full ml-3'>
                                {data.jobSkills.map((data, index) => (
                                  <ul key={index} className="list-disc ml-4 mb-1">
                                    <li>
                                      {data.perS_name}
                                      <Badge className='ml-2 text-xs'>{data.jskills_points} point{data.jskills_points > 1 ? "s" : ""}</Badge>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="ml-3">No skills found.</p>
                            </>
                          )}
                          <div className='text-sm my-3 font-bold flex items-center'>
                            <span className='mr-2'>Trainings</span>
                            <Edit className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleOpenUpdateJob(data.jobTrainings, "trainings")} />
                          </div>
                          {data.jobTrainings.length > 0 ? (
                            <>
                              <div className='w-full ml-3'>
                                {data.jobTrainings.map((data, index) => (
                                  <ul key={index} className="list-disc ml-4 mb-1">
                                    <li>
                                      {data.perT_name}
                                      <Badge className='ml-2 text-xs'>{data.jtrng_points} point{data.jtrng_points > 1 ? "s" : ""}</Badge>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="ml-3">No trainings found.</p>
                            </>
                          )}
                          <div className='text-sm my-3 font-bold flex items-center'>
                            <span className='mr-2'>Experience</span>
                            <Edit className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleOpenUpdateJob(data.jobExperience, "experience")} />
                          </div>
                          {data.jobExperience.length > 0 ? (
                            <>
                              <div className='w-full ml-3'>
                                {data.jobExperience.map((data, index) => (
                                  <ul key={index} className="list-disc ml-4 mb-1">
                                    <li>
                                      {data.jwork_responsibilities} {` with at least ${data.jwork_duration} year${data.jwork_duration > 1 ? "s" : ""} of experience needed`}
                                      <Badge className='ml-2 text-xs'>{data.jwork_points} point{data.jwork_points > 1 ? "s" : ""}</Badge>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </>
                          ) :
                            <>
                              <p className="ml-3">No experience found.</p>
                            </>
                          }
                          <div className='text-sm my-3 font-bold flex items-center'>
                            <span className='mr-2'>Knowledge and Compliance</span>
                            <Edit className="h-4 w-4 cursor-pointer ml-1" onClick={() => handleOpenUpdateJob(data.jobKnowledge, "knowledge")} />
                          </div>
                          {data.jobKnowledge.length > 0 ? (
                            <>
                              <div className='w-full ml-3'>
                                {data.jobKnowledge.map((data, index) => (
                                  <ul key={index} className="list-disc ml-4 mb-1">
                                    <li>
                                      {data.knowledge_name}
                                      <Badge className='ml-2 text-xs'>{data.jknow_points} point{data.jknow_points > 1 ? "s" : ""}</Badge>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="ml-3">No knowledge and compliance found.</p>
                            </>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value={2}>
                      <ViewApplicants datas={data} passingPercentage={data.jobPassing[0].passing_percentage} getSelectedJob={getSelectedJobs} />
                    </TabsContent>
                    <TabsContent value={3}>
                      <InterviewPage interviewData={data.interview} getSelectedJob={getSelectedJobs} />
                    </TabsContent>
                    <TabsContent value={4}>
                      <ExamPage examData={data.exam} getSelectedJob={getSelectedJobs} />
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </Card>
            </>
          )}
        </SheetContent>
      </Sheet>
      <UpdateJobModal open={openUpdateJob} onClose={handleCloseUpdateJob} jobData={jobData} type={type} getSelectedJobs={getSelectedJobs} />
    </>
  );
}

export default SelectedJob;