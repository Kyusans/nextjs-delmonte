import { retrieveData } from '@/app/utils/storageUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

function SelectedJob({ open, onHide, jobId }) {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const getSelectedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = retrieveData("url") + "admin.php";
      const jsonData = {
        "jobId": jobId
      }
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
      console.log("AdminJobs.jsx => getSelectedJobs(): " + error);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (open) {
      getSelectedJobs();
    }
  }, [getSelectedJobs, open]);

  const indexOfLastCandidate = currentPage * itemsPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - itemsPerPage;
  const currentCandidates = data.candidates?.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil((data.candidates?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {isLoading ? <Spinner /> :
        <Dialog open={open} onOpenChange={onHide}>
          <DialogContent className="max-w-7xl h-full md:h-4/5">
            <ScrollArea className="h-full rounded-md md:p-2">
              <DialogHeader>
                <DialogTitle>{data.jobMaster[0].jobM_title}</DialogTitle>
                <ScrollArea className="h-52 md:h-36">
                  <DialogDescription>{data.jobMaster[0].jobM_description}</DialogDescription>
                </ScrollArea>
              </DialogHeader>
              <Separator className="mb-4" />
              <Card className="w-full p-3">
                <Tabs defaultValue={2} className='mb-5'>
                  <TabsList>
                    <TabsTrigger value={1}>Details</TabsTrigger>
                    <TabsTrigger value={2}>Applicants</TabsTrigger>
                  </TabsList>
                  <TabsContent value={1}>
                    <Accordion type="multiple" collapsible="true" className="w-full" defaultValue={["item-1", "item-2"]}>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Duties and Responsibilities</AccordionTrigger>
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
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Qualifications</AccordionTrigger>
                        <AccordionContent className='px-5'>
                          <div className='text-sm mb-3 font-bold'>Educational Background</div>
                          <div className='w-full ml-3'>
                            {data.jobEducation.map((data, index) => (
                              <ul key={index} className="list-disc ml-4 mb-1">
                                <li>{data.jeduc_text}</li>
                              </ul>
                            ))}
                          </div>
                          <div className='text-sm my-3 font-bold'>Knowledge and Compliance</div>
                          <div className='w-full ml-3'>
                            {data.jobEducation.map((data, index) => (
                              <ul key={index} className="list-disc ml-4 mb-1">
                                <li>{data.jeduc_text}</li>
                              </ul>
                            ))}
                          </div>
                          <div className='text-sm my-3 font-bold'>Skills</div>
                          <div className='w-full ml-3'>
                            {data.jobSkills.map((data, index) => (
                              <ul key={index} className="list-disc ml-4 mb-1">
                                <li>{data.jskills_text}</li>
                              </ul>
                            ))}
                          </div>
                          <div className='text-sm my-3 font-bold'>Trainings</div>
                          <div className='w-full ml-3'>
                            {data.jobTrainings.map((data, index) => (
                              <ul key={index} className="list-disc ml-4 mb-1">
                                <li>{data.jtrng_text}</li>
                              </ul>
                            ))}
                          </div>
                          <div className='text-sm my-3 font-bold'>Experience</div>
                          <div className='w-full ml-3'>
                            {data.jobExperience.map((data, index) => (
                              <ul key={index} className="list-disc ml-4 mb-1">
                                <li>{data.jwork_responsibilities} {`${data.jwork_duration} year${data.jwork_duration > 1 ? "s" : ""} of experience needed`}</li>
                              </ul>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  <TabsContent value={2}>
                    {data.candidates?.length > 0 ? (
                      <Table className="w-full text-center">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-center">Index</TableHead>
                            <TableHead className="text-center">Full Name</TableHead>
                            <TableHead className="text-center">Points</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentCandidates?.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                              <TableCell>{data.FullName}</TableCell>
                              <TableCell>{data.posA_totalpoints}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) :
                      (
                        <>
                        <Card className="text-center bg-background">
                          <CardDescription className="p-5">
                            No applicants applied yet
                          </CardDescription>
                        </Card>
                        </>
                      )
                    }
                    {data.candidates?.length > itemsPerPage && (
                      <div className='flex justify-end items-end mt-4'>
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={handlePreviousPage}
                                href="#"
                                className={"hover:text-primary"}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                              <PaginationItem key={index}>
                                <PaginationLink
                                  href="#"
                                  onClick={() => handlePageChange(index + 1)}
                                  className={` ${currentPage === index + 1 ? "text-primary font-extrabold text-lg" : ""}`}
                                >
                                  {index + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                onClick={handleNextPage}
                                href="#"
                                className={"hover:text-primary"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      }
    </>
  );
}

export default SelectedJob;
