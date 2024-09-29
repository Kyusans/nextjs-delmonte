import { removeData, storeData } from '@/app/utils/storageUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/ui/spinner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import UpdateJobModal from '../Job/UpdateJobDetails/UpdateJobModal';
import SelectedApplicant from './SelectedApplicant';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, SortAsc, SortDesc } from 'lucide-react';
import InterviewPage from '../Job/Interview/InterviewPage';
import ViewApplicants from '../Job/ViewApplicants/ViewApplicants';

function SelectedJob({ open, onHide, jobId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    onHide();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose} className="text-white">
        <DialogContent className="max-w-7xl h-full md:h-4/5 bg-[#107343] dark:bg-background">
          <DialogTitle className="hidden" />
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <ScrollArea className="h-full rounded-md md:p-2">
                <DialogHeader className="text-white">
                  <DialogTitle>{data.jobMaster[0].jobM_title}</DialogTitle>
                  <ScrollArea className="h-52 md:h-36">
                    <DialogDescription className="text-white">{data.jobMaster[0].jobM_description}</DialogDescription>
                  </ScrollArea>
                </DialogHeader>
                <Separator className="mb-4" />
                <Card className="w-full p-3 dark:bg-[#1c1917]">
                  <Tabs defaultValue={1} className='mb-5'>
                    <TabsList>
                      <TabsTrigger value={1} >Details</TabsTrigger>
                      <TabsTrigger value={2}>Applicants</TabsTrigger>
                      <TabsTrigger value={3}>Interview Criteria</TabsTrigger>
                    </TabsList>
                    <TabsContent value={1}>
                      <Accordion type="multiple" collapsible="true" className="w-full" defaultValue={["item-1", "item-2"]}>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <div className="flex items-center w-full">
                              <span className='mr-2'>Duties and Responsibilities</span>
                              <div>{handleUpdateJob(data.jobDuties, "duties")}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className='px-5'>
                            <div className='w-full'>
                              {data.jobDuties.map((data, index) => (
                                <ul key={index} className="list-disc ml-4 mb-1">
                                  <li>{data.duties_text}</li>
                                </ul>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        {data.jobEducation.length > 0 || data.jobSkills.length > 0 || data.jobTrainings.length > 0 || data.jobExperience.length > 0 ? (
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Qualifications</AccordionTrigger>
                            <AccordionContent className='px-5'>
                              {data.jobEducation.length > 0 && (
                                <>
                                  <div className='text-sm mb-3 font-bold flex items-center'>
                                    <span className='mr-2'>Educational Background </span>
                                    {handleUpdateJob(data.jobEducation, "education")}
                                  </div>
                                  <div className='w-full ml-3'>
                                    {data.jobEducation.map((data, index) => (
                                      <ul key={index} className="list-disc ml-4 mb-1">
                                        <li>
                                          {data.jeduc_text}
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
                                          {data.jskills_text}
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
                                          {data.jtrng_text}
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
                                          {data.jwork_responsibilities} {`${data.jwork_duration} year${data.jwork_duration > 1 ? "s" : ""} of experience needed`}
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
                                          {data.jknow_text}
                                          <Badge className='ml-2 text-xs'>{data.jknow_points} point{data.jknow_points > 1 ? "s" : ""}</Badge>
                                        </li>
                                      </ul>
                                    ))}
                                  </div>
                                </>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ) : null}
                      </Accordion>
                    </TabsContent>
                    <TabsContent value={2}>
                        <ViewApplicants datas={data} passingPercentage={data.jobPassing[0].passing_percentage} />
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
