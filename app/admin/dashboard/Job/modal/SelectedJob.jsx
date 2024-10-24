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
import JobDetails from './JobDetails/JobDetails';

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
                      <JobDetails />
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
    </>
  );
}

export default SelectedJob;