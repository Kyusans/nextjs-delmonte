"use client";
import { formatDate } from "@/app/signup/page";
import { retrieveData } from "@/app/utils/storageUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Check, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function SelectedApplicant({ open, onHide, candId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const getCandidateProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      const jsonData = {
        cand_id: candId,
        job_id: retrieveData("jobId"),
      };
      console.log("url ni getCandidateProfile: ", url);
      console.log("jsonData ni getCandidateProfile: ", jsonData);
      const formData = new FormData();
      formData.append("operation", "getCandidateProfile");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("RES DATA ni getCandidateProfile: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("SelectedApplicant.jsx => getCandidateProfile(): " + error);
    } finally {
      setIsLoading(false);
    }
  }, [candId]);

  const handleHide = () => {
    onHide();
  };

  useEffect(() => {
    if (open) {
      getCandidateProfile();
    }
  }, [getCandidateProfile, open]);

  return (
    <>
      <Sheet open={open} onOpenChange={handleHide}>
        <SheetContent side={"bottom"} className="h-full md:h-4/5">
          <ScrollArea className="h-full">
            <SheetHeader className="text-start">
              <SheetTitle>Applicant Profile</SheetTitle>
              <SheetDescription>
                View selected applicant details here.
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-5 w-full" />
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="lg:grid lg:grid-cols-4 lg:col-span-3 lg:gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:col-span-3">
                  <Card className="w-full lg:col-span-2">
                    <CardHeader className="flex flex-col items-center">
                      <Avatar className="w-32 h-32">
                        <AvatarImage
                          src={
                            process.env.NEXT_PUBLIC_API_URL +
                            "images/emptyImage.jpg"
                          }
                          alt="avatar"
                        />
                        <AvatarFallback>
                          <Spinner />
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="mt-2">
                        {data.candidateInformation
                          ? `${data.candidateInformation.cand_firstname} ${data.candidateInformation.cand_lastname}`
                          : "No applicant data available"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.skills && data.skills.length > 0 ? (
                        <>
                          <p className="font-bold">Skills:</p>
                          {data.skills.map((skill, index) => (
                            <Badge className="mr-2 my-1" key={index}>
                              {skill.perS_name}
                            </Badge>
                          ))}
                        </>
                      ) : (
                        <p className="text-center text-gray-500">
                          No skills added
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <div className="lg:col-span-2">
                    <Card className="w-full h-full">
                      <CardHeader>
                        <CardTitle>Basic Information:</CardTitle>
                      </CardHeader>
                      <ScrollArea className="h-48 w-full">
                        <CardContent className="grid md:grid-cols-2 xl:grid-cols-2 gap-3">
                          <div>
                            <p className="font-bold">Age:</p>
                            {data.candidateInformation
                              ? `${new Date().getFullYear() - new Date(data.candidateInformation.cand_dateofBirth).getFullYear()} years old`
                              : "N/A"}
                          </div>

                          <div>
                            <p className="font-bold">Email:</p>
                            {data.candidateInformation
                              ? data.candidateInformation.cand_email
                              : "N/A"}
                          </div>

                          <div>
                            <p className="font-bold">Contact number:</p>
                            {data.candidateInformation
                              ? data.candidateInformation.cand_contactNo
                              : "N/A"}
                          </div>

                          <div>
                            <p className="font-bold">Gender:</p>
                            {data.candidateInformation
                              ? data.candidateInformation.cand_sex
                              : "N/A"}
                          </div>
                          {/* 
                          <div>
                            <p className="font-bold">Present address:</p>
                            {data.candidateInformation
                              ? data.candidateInformation.cand_presentAddress
                              : "N/A"}
                          </div>

                          <div>
                            <p className="font-bold">Permanent address:</p>
                            {data.candidateInformation
                              ? data.candidateInformation.cand_permanentAddress
                              : "N/A"}
                          </div> */}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </div>
                  <div className="lg:col-span-4">
                    <Card className="w-full">
                      <ScrollArea className="h-80">
                        <CardContent>
                          <Tabs defaultValue={1} className="my-3">
                            <TabsList>
                              <TabsTrigger value={1}>Education</TabsTrigger>
                              <TabsTrigger value={2}>Trainings</TabsTrigger>
                              <TabsTrigger value={3}>Knowledge</TabsTrigger>
                              <TabsTrigger value={4}>Experience</TabsTrigger>
                            </TabsList>

                            <TabsContent value={1}>
                              {data.educationalBackground &&
                                data.educationalBackground.length > 0 ? (
                                <>
                                  <div className="w-full hidden lg:block">
                                    <Table className="w-full">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>#</TableHead>
                                          <TableHead>Institution</TableHead>
                                          <TableHead>Course</TableHead>
                                          <TableHead>Course category</TableHead>
                                          <TableHead>Course Type</TableHead>
                                          <TableHead>Graduation Date</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {data.educationalBackground.map(
                                          (education, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{index + 1}</TableCell>
                                              <TableCell>{education.institution_name}</TableCell>
                                              <TableCell>{education.courses_name}</TableCell>
                                              <TableCell>{education.course_categoryName}</TableCell>
                                              <TableCell>{education.crs_type_name}</TableCell>
                                              <TableCell>{formatDate(education.educ_dategraduate)}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <div className="block lg:hidden">
                                    {data.educationalBackground.map(
                                      (education, index) => (
                                        <div
                                          key={index}
                                          className="relative w-full p-4 rounded-md shadow"
                                        >
                                          <div className="text-sm">
                                            <div className="mb-1 text-xl">
                                              {education.institution_name}
                                            </div>
                                            {education.courses_name}
                                            <div className="text-gray-500">
                                              Graduation Date:{" "}
                                              {formatDate(
                                                education.educ_dategraduate
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </>
                              ) : (
                                <p className="text-center text-gray-500">
                                  No education added
                                </p>
                              )}
                            </TabsContent>

                            <TabsContent value={2}>
                              {data.training && data.training.length > 0 ? (
                                <>
                                  <div className='w-full ml-3 hidden lg:block'>
                                    <Table className="w-full text-center">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-center">#</TableHead>
                                          <TableHead className="text-center">Training</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {data.training.map((data, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{data.perT_name}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <div className="block lg:hidden">
                                    {data.training.map((data, index) => (
                                      <div key={index} className="relative w-full p-4 rounded-md shadow">
                                        <div className="mt-2 text-sm">
                                          <div className='mb-1 text-xl break-words'>
                                            {data.perT_name}
                                          </div>
                                        </div>
                                        <Separator className="mt-3" />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <p className="text-center text-gray-500">No training added</p>
                              )}
                            </TabsContent>

                            <TabsContent value={3}>
                              {data.knowledge && data.knowledge.length > 0 ? (
                                <>
                                  <div className='w-full ml-3 hidden lg:block'>
                                    <Table className="w-full text-center">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-center">#</TableHead>
                                          <TableHead className="text-center">Knowledge and Compliance</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {data.knowledge.map((data, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{data.knowledge_name}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <div className="block lg:hidden">
                                    {data.knowledge.map((data, index) => (
                                      <div key={index} className="relative w-full p-4 rounded-md shadow">
                                        <div className="mt-2 text-sm">
                                          <div className='mb-1 text-xl break-words'>
                                            {data.knowledge_name}
                                          </div>
                                        </div>
                                        <Separator className="mt-3" />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <p className="text-center text-gray-500">No knowledge added</p>
                              )}
                            </TabsContent>

                            <TabsContent value={4}>
                              {data.employmentHistory && data.employmentHistory.length > 0 ? (
                                <>
                                  <div className='w-full ml-3 hidden lg:block'>
                                    <Table className="w-full">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>#</TableHead>
                                          <TableHead>Company name</TableHead>
                                          <TableHead>Position</TableHead>
                                          <TableHead>Start date</TableHead>
                                          <TableHead>End date</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {data.employmentHistory.map((data, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{data.empH_companyName}</TableCell>
                                            <TableCell>{data.empH_positionName}</TableCell>
                                            <TableCell>{formatDate(data.empH_startdate)}</TableCell>
                                            <TableCell>{formatDate(data.empH_enddate)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <div className="block lg:hidden">
                                    {data.employmentHistory.map((data, index) => (
                                      <div key={index} className="relative w-full p-4 rounded-md shadow">
                                        <div className="mt-2 text-sm">
                                          <div className='mb-1 text-xl break-words'>
                                            {data.empH_positionName}
                                          </div>
                                          {data.empH_companyName}
                                          <div className='text-gray-500'>
                                            {formatDate(data.empH_startdate)} - {formatDate(data.empH_enddate)}
                                          </div>
                                        </div>
                                        <Separator className="mt-3" />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <p className="text-center text-gray-500">No experience added</p>
                              )}
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </div>
                </div>
                <Card className="w-full mt-5 lg:mt-0">
                  <CardHeader className="flex flex-col items-center">
                    <CardTitle className="mt-2">
                      Job Qualifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <ScrollArea className="h-[500px] overflow-auto">
                      <Accordion type="multiple" collapsible="true" className="w-full p-5" defaultValue={["1", "2", "3", "4", "5"]}>
                        <AccordionItem value="1" className="mb-5">
                          <AccordionTrigger>
                            Education
                          </AccordionTrigger>
                          <AccordionContent>
                            {data.criteria && data.criteria.education && data.criteria.education.length > 0 ? (
                              <>
                                <div className="grid grid-cols-3 gap-4 my-3">
                                  <p className="col-span-2">Total points</p>
                                  <p className={`flex justify-end` + (data.pointsByCategory.education.points
                                    >= (data.pointsByCategory.education.maxPoints / 2) ? " text-green-500"
                                    : " text-red-500")}
                                  >
                                    {data.pointsByCategory.education.points}
                                    /{data.pointsByCategory.education.maxPoints}
                                  </p>
                                </div>
                                <Separator />
                                {data.criteria.education.map((edu, index) => (
                                  <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                      <p className="col-span-2">{edu.course_categoryName}</p>
                                      <div className="flex justify-end">
                                        {edu.meets_criteria === 1 ?
                                          <Check className="w-5 h-5 text-green-500" />
                                          :
                                          <X className="w-5 h-5 text-red-500" />}
                                      </div>
                                    </div>
                                    <Separator className={index === data.criteria.education.length - 1 ? "hidden" : ""} />
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <p className="text-center text-gray-500">No education added</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="2" className="mb-5">
                          <AccordionTrigger>
                            Skills
                          </AccordionTrigger>
                          <AccordionContent>
                            {data.criteria && data.criteria.skills && data.criteria.skills.length > 0 ? (
                              <>
                              <div className="grid grid-cols-3 gap-4 my-3">
                                  <p className="col-span-2">Total points</p>
                                  <p className={`flex justify-end` + (data.pointsByCategory.skills.points
                                    >= (data.pointsByCategory.skills.maxPoints / 2) ? " text-green-500"
                                    : " text-red-500")}
                                  >
                                    {data.pointsByCategory.skills.points}
                                    /{data.pointsByCategory.skills.maxPoints}
                                  </p>
                                </div>
                                <Separator />
                                {data.criteria.skills.map((skills, index) => (
                                  <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                      <p className="col-span-2">{skills.perS_name}</p>
                                      <div className="flex justify-end">
                                        {skills.meets_criteria === 1 ?
                                          <Check className="w-5 h-5 text-green-500" />
                                          :
                                          <X className="w-5 h-5 text-red-500" />}
                                      </div>
                                    </div>
                                    <Separator className={index === data.criteria.skills.length - 1 ? "hidden" : ""} />
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <p className="text-center text-gray-500">No skills added</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="3" className="mb-5">
                          <AccordionTrigger>
                            Trainings
                          </AccordionTrigger>
                          <AccordionContent>
                            {data.criteria && data.criteria.training && data.criteria.training.length > 0 ? (
                              <>
                               <div className="grid grid-cols-3 gap-4 my-3">
                                  <p className="col-span-2">Total points</p>
                                  <p className={`flex justify-end` + (data.pointsByCategory.training.points
                                    >= (data.pointsByCategory.training.maxPoints / 2) ? " text-green-500"
                                    : " text-red-500")}
                                  >
                                    {data.pointsByCategory.training.points}
                                    /{data.pointsByCategory.training.maxPoints}
                                  </p>
                                </div>
                                <Separator />
                                {data.criteria.training.map((training, index) => (
                                  <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                      <p className="col-span-2">{training.perT_name}</p>
                                      <div className="flex justify-end">
                                        {training.meets_criteria === 1 ?
                                          <Check className="w-5 h-5 text-green-500" />
                                          :
                                          <X className="w-5 h-5 text-red-500" />}
                                      </div>
                                    </div>
                                    <Separator className={index === data.criteria.training.length - 1 ? "hidden" : ""} />
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <p className="text-center text-gray-500">No training added</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="4" className="mb-5">
                          <AccordionTrigger>
                            Knowledge and Compliance
                          </AccordionTrigger>
                          <AccordionContent>
                            {data.criteria && data.criteria.knowledge && data.criteria.knowledge.length > 0 ? (
                              <>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                  <p className="col-span-2">Total points</p>
                                  <p className={`flex justify-end` + (data.pointsByCategory.knowledge.points
                                    >= (data.pointsByCategory.knowledge.maxPoints / 2) ? " text-green-500"
                                    : " text-red-500")}
                                  >
                                    {data.pointsByCategory.knowledge.points}
                                    /{data.pointsByCategory.knowledge.maxPoints}
                                  </p>
                                </div>
                                <Separator />
                                {data.criteria.knowledge.map((knowledge, index) => (
                                  <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                      <p className="col-span-2">{knowledge.knowledge_name}</p>
                                      <div className="flex justify-end">
                                        {knowledge.meets_criteria === 1 ?
                                          <Check className="w-5 h-5 text-green-500" />
                                          :
                                          <X className="w-5 h-5 text-red-500" />}
                                      </div>
                                    </div>
                                    <Separator className={index === data.criteria.knowledge.length - 1 ? "hidden" : ""} />
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <p className="text-center text-gray-500">No knowledge and compliance added</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="5" className="mb-5">
                          <AccordionTrigger>
                            Experience
                          </AccordionTrigger>
                          <AccordionContent>
                            {data.criteria && data.criteria.experience && data.criteria.experience.length > 0 ? (
                              <>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                  <p className="col-span-2">Total points</p>
                                  <p className={`flex justify-end` + (data.pointsByCategory.experience.points
                                    >= (data.pointsByCategory.experience.maxPoints / 2) ? " text-green-500"
                                    : " text-red-500")}
                                  >
                                    {data.pointsByCategory.experience.points}
                                    /{data.pointsByCategory.experience.maxPoints}
                                  </p>
                                </div>
                                <Separator />
                                {data.criteria.experience.map((experience, index) => (
                                  <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 gap-4 my-3">
                                      <p className="col-span-2">{experience.jwork_responsibilities}</p>
                                      <div className="flex justify-end">
                                        {experience.meets_criteria === 1 ?
                                          <Check className="w-5 h-5 text-green-500" />
                                          :
                                          <X className="w-5 h-5 text-red-500" />}
                                      </div>
                                    </div>
                                    <Separator className={index === data.criteria.experience.length - 1 ? "hidden" : ""} />
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <p className="text-center text-gray-500">No experience added</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default SelectedApplicant;

