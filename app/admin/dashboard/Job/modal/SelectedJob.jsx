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

  const handleUpdateJob = (data, type) => {
    return <UpdateJobModal jobData={data} type={type} getSelectedJobs={getSelectedJobs} />;
  };

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

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose} className="text-white">
        <DialogContent className="max-w-7xl h-full md:h-4/5 bg-[#107343] dark:bg-background">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <DialogHeader className="text-white">
                <DialogTitle>{data.jobMaster[0].jobM_title}</DialogTitle>
                <ScrollArea className="h-64 md:h-24">
                  <DialogDescription className="text-white text-start">{data.jobMaster[0].jobM_description}</DialogDescription>
                </ScrollArea>
              </DialogHeader>
              <ScrollArea className="rounded-md h-full">
                <Card className="p-3 w-full md:p-2 dark:bg-[#1c1917]">
                  <Tabs defaultValue={selectedTab} className="mb-3" onValueChange={(value) => setSelectedTab(value)}>
                    <TabsList>
                      <TabsTrigger value={1}>Details</TabsTrigger>
                      <TabsTrigger value={2}>Applicants</TabsTrigger>
                      <TabsTrigger value={3}>Interview Criteria</TabsTrigger>
                    </TabsList>
                    <TabsContent value={1}>

                      <div className="flex items-center w-full">
                        <span className='text-sm my-3 font-bold flex items-center mr-2  '>Duties and Responsibilities</span>
                        <div>{handleUpdateJob(data.jobDuties, "duties")}</div>
                      </div>
                      <div className='w-full px-5'>
                        {data.jobDuties.map((data, index) => (
                          <ul key={index} className="list-disc ml-4 mb-1">
                            <li>{data.duties_text}</li>
                          </ul>
                        ))}
                      </div>
                      <div className='w-full px-3 mt-3'>

                        {data.jobEducation.length > 0 && (
                          <>
                            <div className='text-sm mb-3 font-bold flex items-center'>
                              <span className='mr-2'>Educational Background </span>
                              {handleUpdateJob(data.jobEducation, "education")}
                            </div>
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
                        )}
                        {data.jobSkills.length > 0 && (
                          <>
                            <div className='text-sm my-3 font-bold flex items-center'>
                              <span className='mr-2'>Skills</span>
                              {handleUpdateJob(data.jobSkills, "skills")}
                            </div>
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
                        )}
                        {data.jobTrainings.length > 0 && (
                          <>
                            <div className='text-sm my-3 font-bold flex items-center'>
                              <span className='mr-2'>Trainings</span>
                              {handleUpdateJob(data.jobTrainings, "trainings")}
                            </div>
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
                        )}
                        {data.jobExperience.length > 0 && (
                          <>
                            <div className='text-sm my-3 font-bold flex items-center'>
                              <span className='mr-2'>Experience</span>
                              {handleUpdateJob(data.jobExperience, "experience")}
                            </div>
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
                        )}
                        {data.jobKnowledge.length > 0 && (
                          <>
                            <div className='text-sm my-3 font-bold flex items-center'>
                              <span className='mr-2'>Knowledge and Compliance</span>
                              {handleUpdateJob(data.jobKnowledge, "knowledge")}
                            </div>
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
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value={2}>
                      <ViewApplicants datas={data} passingPercentage={data.jobPassing[0].passing_percentage} getSelectedJob={getSelectedJobs} />
                    </TabsContent>
                    <TabsContent value={3}>
                      <>
                        <InterviewPage interviewData={data.interview} getSelectedJob={getSelectedJobs} />
                      </>
                    </TabsContent>
                  </Tabs>
                </Card>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SelectedJob;
